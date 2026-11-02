"use strict";
/**
 * lib/buttons.js
 *
 * WhatsApp blocked buttonsMessage on regular accounts in 2023. The only
 * interactive widget that still works reliably on @whiskeysockets/baileys is
 * the LIST message (a "Choose an option" picker). This file uses that.
 *
 * What the user sees:
 *   - A text message with the status / info text
 *   - A green "Choose an option" button at the bottom
 *   - Tapping it opens a scrollable list of choices
 *   - Tapping a choice sends back its id, and the bot runs it as a command
 *
 * replyId() reads the chosen id from a list reply or from any other
 * interactive reply type (buttons, native-flow, template) so that any
 * previously stored BUTTON_STYLE keeps working.
 */
const fs = require("fs");
const path = require("path");

const MAX_BUTTONS = 10; // lists support up to 10 rows per section
const STYLES = ["list", "native", "text"];

// ---------------------------------------------------------------------------
// Bold font (Toxic-MD style labels)
// ---------------------------------------------------------------------------
function boldFont(text) {
  return String(text).replace(/[A-Za-z0-9]/g, (ch) => {
    const c = ch.charCodeAt(0);
    if (c >= 65 && c <= 90) return String.fromCodePoint(0x1d400 + (c - 65));
    if (c >= 97 && c <= 122) return String.fromCodePoint(0x1d41a + (c - 97));
    if (c >= 48 && c <= 57) return String.fromCodePoint(0x1d7ce + (c - 48));
    return ch;
  });
}

// ---------------------------------------------------------------------------
// Reading the chosen option
// ---------------------------------------------------------------------------
function unwrap(message) {
  let m = message || {};
  for (let i = 0; i < 4; i++) {
    const inner = (m.ephemeralMessage && m.ephemeralMessage.message) ||
      (m.viewOnceMessage && m.viewOnceMessage.message) ||
      (m.deviceSentMessage && m.deviceSentMessage.message);
    if (!inner) break;
    m = inner;
  }
  return m;
}

function replyId(message) {
  const m = unwrap(message);
  // list reply (the one we use)
  if (m.listResponseMessage && m.listResponseMessage.singleSelectReply)
    return m.listResponseMessage.singleSelectReply.selectedRowId || "";
  // legacy buttons
  if (m.buttonsResponseMessage && m.buttonsResponseMessage.selectedButtonId)
    return m.buttonsResponseMessage.selectedButtonId;
  if (m.templateButtonReplyMessage && m.templateButtonReplyMessage.selectedId)
    return m.templateButtonReplyMessage.selectedId;
  // native-flow (pair.js style)
  const flow = m.interactiveResponseMessage &&
    m.interactiveResponseMessage.nativeFlowResponseMessage;
  if (flow && flow.paramsJson) {
    try {
      const p = typeof flow.paramsJson === "string"
        ? JSON.parse(flow.paramsJson) : flow.paramsJson;
      if (p && p.id) return String(p.id);
    } catch (e) {}
  }
  return "";
}

// ---------------------------------------------------------------------------
// Current style (stored setting or env var, defaults to "list")
// ---------------------------------------------------------------------------
function currentStyle() {
  let value = process.env.BUTTON_STYLE;
  try {
    const stored = require("./settingsCache").getSetting("BUTTON_STYLE", "");
    if (stored) value = stored;
  } catch (e) {}
  value = String(value || "list").toLowerCase().trim();
  // toxic / wrapped / legacy are no longer supported → use list
  if (["toxic", "wrapped", "legacy"].includes(value)) return "list";
  return STYLES.includes(value) ? value : "list";
}

function plainTextVersion(body, footer, btns) {
  return `${body}\n\nType one of these:\n${btns.map(b => "• " + b.id).join("\n")}${footer ? "\n\n" + footer : ""}`;
}

// ---------------------------------------------------------------------------
// Thumbnail (kept for API compatibility; not needed for list messages)
// ---------------------------------------------------------------------------
async function makeThumbnail(source) {
  if (!source) return null;
  try {
    if (Buffer.isBuffer(source)) return source;
    if (/^https?:\/\//i.test(String(source))) {
      const res = await fetch(source, { signal: AbortSignal.timeout(8000) });
      if (!res.ok) return null;
      return Buffer.from(await res.arrayBuffer());
    }
    return fs.readFileSync(source);
  } catch (e) { return null; }
}

async function defaultThumbnail(mybotpic) {
  try {
    const dir = path.join(__dirname, "..", "plugins", "scs");
    const files = fs.readdirSync(dir).filter(f => /^menu\d+\.(jpg|jpeg|png)$/i.test(f));
    if (files.length) {
      const buf = await makeThumbnail(path.join(dir, files[Math.floor(Math.random() * files.length)]));
      if (buf) return buf;
    }
  } catch (e) {}
  try {
    const url = typeof mybotpic === "function" ? mybotpic() : "";
    if (url) return await makeThumbnail(url);
  } catch (e) {}
  return null;
}

// ---------------------------------------------------------------------------
// List style — the only interactive widget that reliably works
// ---------------------------------------------------------------------------
async function sendListStyle(client, jid, { body, footer, title, buttons, mentions }) {
  await client.sendMessage(jid, {
    text: body,
    footer: footer || "RAHMANI-XMD",
    title: title || "",
    buttonText: "Choose an option ▾",
    sections: [{
      title: title || "Options",
      rows: buttons.map(b => ({
        rowId: b.id,
        title: b.text,
        description: b.id,
      })),
    }],
    ...(mentions && mentions.length ? { mentions } : {}),
  });
}

// ---------------------------------------------------------------------------
// Native style — quick_reply (the pair.js way, works on most forks)
// ---------------------------------------------------------------------------
async function sendNativeStyle(client, jid, { body, footer, title, buttons, mentions }) {
  const { generateWAMessageFromContent, proto } = require("@whiskeysockets/baileys");
  const I = proto.Message.InteractiveMessage;
  const interactive = I.create({
    body: I.Body.create({ text: body }),
    footer: I.Footer.create({ text: footer }),
    header: I.Header.create({ title, subtitle: "", hasMediaAttachment: false }),
    ...(mentions && mentions.length ? { contextInfo: { mentionedJid: mentions } } : {}),
    nativeFlowMessage: I.NativeFlowMessage.create({
      buttons: buttons.map(b => ({
        name: "quick_reply",
        buttonParamsJson: JSON.stringify({ display_text: b.text, id: b.id }),
      })),
    }),
  });
  const content = {
    viewOnceMessage: {
      message: {
        messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
        interactiveMessage: interactive,
      },
    },
  };
  const msg = generateWAMessageFromContent(jid, content, {});
  if (typeof client.rememberSentId === "function") client.rememberSentId(msg.key.id);
  await client.relayMessage(jid, msg.message, { messageId: msg.key.id });
}

// ---------------------------------------------------------------------------
// Main send function
// ---------------------------------------------------------------------------
async function sendButtons(client, jid, {
  body, footer = "", buttons, title = "", subtitle = "",
  mentions = [], thumbnail = null, style, mybotpic
} = {}) {
  const list = (buttons || []).slice(0, MAX_BUTTONS);

  const asText = async () => {
    await client.sendMessage(jid, {
      text: plainTextVersion(body, footer, list), mentions,
    });
    return "text";
  };

  if (!list.length || String(process.env.BUTTONS || "").toLowerCase() === "off")
    return asText();

  const wanted = STYLES.includes(style) ? style : currentStyle();
  if (wanted === "text") return asText();

  const args = { body, footer, title, subtitle, buttons: list, thumbnail, mentions, mybotpic };

  if (wanted === "native") {
    try { await sendNativeStyle(client, jid, args); return "native"; }
    catch (e) {
      console.log("[buttons] native failed:", e && e.message ? e.message : e);
      return asText();
    }
  }

  // list (default)
  try { await sendListStyle(client, jid, args); return "list"; }
  catch (e) {
    console.log("[buttons] list failed:", e && e.message ? e.message : e);
    try { await sendNativeStyle(client, jid, args); return "native"; }
    catch (e2) { return asText(); }
  }
}

module.exports = {
  sendButtons, replyId, boldFont,
  makeThumbnail, defaultThumbnail,
  currentStyle, STYLES, MAX_BUTTONS,
};
