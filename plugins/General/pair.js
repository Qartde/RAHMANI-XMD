const { bmbtz } = require("../../devbmb/bmbtz");
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, generateWAMessageFromContent, proto } = require("@whiskeysockets/baileys");
const pino = require("pino");
const fs = require("fs");
const path = require("path");

// Newsletter Context
const newsletterContext = {
  forwardingScore: 999,
  isForwarded: true,
  forwardedNewsletterMessageInfo: {
    newsletterJid: "120363353854480831@newsletter",
    newsletterName: "RAHMANI-XMD",
    serverMessageId: 1
  }
};

bmbtz({
  nomCom: "pair",
  alias: ["paircode", "session", "getcode"],
  categorie: "General",
  reaction: "🔐"
}, async (dest, client, commandeOptions) => {
  const { arg, repondre, ms, prefixe } = commandeOptions;
  const p = prefixe || ".";

  // 1. Validate Phone Number
  if (!arg || !arg[0]) {
    return repondre(`❌ *Please provide your WhatsApp number.*\nExample: ${p}pair 255693629079`);
  }

  let phoneNumber = arg[0].replace(/[^0-9]/g, '');
  
  if (phoneNumber.startsWith("0")) {
    return repondre(`❌ *Please remove the starting 0 and use the country code.*\nExample: ${p}pair 255693629079`);
  }

  if (phoneNumber.length < 10 || phoneNumber.length > 15) {
    return repondre(`❌ *Invalid phone number format.* Please check your number and try again.`);
  }

  await repondre(`⏳ *Generating Pair Code for +${phoneNumber}...*\n_Please wait a few seconds._`);

  // 2. Setup temporary folder for this session
  const sessionDir = path.join(__dirname, `../../temp_session_${phoneNumber}`);
  if (!fs.existsSync(sessionDir)) {
    fs.mkdirSync(sessionDir, { recursive: true });
  }

  try {
    const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
      version,
      logger: pino({ level: "silent" }),
      printQRInTerminal: false,
      auth: state,
      browser: ["Ubuntu", "Chrome", "20.0.04"],
    });

    // 3. Request Pairing Code from WhatsApp
    if (!sock.authState.creds.registered) {
      setTimeout(async () => {
        try {
          const code = await sock.requestPairingCode(phoneNumber);
          const formattedCode = code?.match(/.{1,4}/g)?.join("-") || code;

          const captionText = 
`*╭━━━〔 🔐 PAIR CODE 〕━━━⬣*
*┃*
*┃ 📱 *Number:* +${phoneNumber}
*┃ 🔑 *Code:* ${formattedCode}
*┃*
*╰━━━━━━━━━━━━━━━━━━⬣*

*📌 Instructions:*
1. Open WhatsApp on your phone.
2. Go to Linked Devices > Link a Device.
3. Tap "Link with phone number instead".
4. Enter the code above.

*🥀 Powered by RAHMANI-XMD 🥀*`;

          // 4. Generate Interactive Message with Copy Button
          const buttons = [
            {
              name: "cta_copy",
              buttonParamsJson: JSON.stringify({
                display_text: "📋 Copy Pair Code",
                copy_code: code // The raw code without dashes for easy copying
              })
            }
          ];

          const viewOnceMessage = {
            viewOnceMessage: {
              message: {
                messageContextInfo: {
                  deviceListMetadata: {},
                  deviceListMetadataVersion: 2
                },
                interactiveMessage: proto.Message.InteractiveMessage.create({
                  body: proto.Message.InteractiveMessage.Body.create({
                    text: captionText
                  }),
                  footer: proto.Message.InteractiveMessage.Footer.create({
                    text: "RAHMANI-XMD"
                  }),
                  header: proto.Message.InteractiveMessage.Header.create({
                    title: "",
                    subtitle: "",
                    hasMediaAttachment: false
                  }),
                  nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                    buttons
                  })
                })
              }
            }
          };

          const waMsg = generateWAMessageFromContent(dest, viewOnceMessage, {});
          await client.relayMessage(dest, waMsg.message, {
            messageId: waMsg.key.id
          }, {
            contextInfo: newsletterContext
          });

        } catch (err) {
          console.error("Pair Code Error:", err);
          await repondre(`❌ *Failed to generate code.* Make sure the number is correct and try again.`);
          fs.rmSync(sessionDir, { recursive: true, force: true });
        }
      }, 3000);
    } else {
      await repondre(`❌ *This number is already linked to a session.*`);
    }

    // 5. Handle connection updates
    sock.ev.on("connection.update", async (update) => {
      const { connection, lastDisconnect } = update;

      if (connection === "open") {
        await client.sendMessage(dest, {
          text: `✅ *Success!* WhatsApp linked successfully for +${phoneNumber}.\n\n_You can now close this chat or use the bot._`,
          contextInfo: newsletterContext
        }, { quoted: ms });

        // Send credentials file
        const credsPath = path.join(sessionDir, "creds.json");
        if (fs.existsSync(credsPath)) {
          const credsBuffer = fs.readFileSync(credsPath);
          await client.sendMessage(dest, {
            document: credsBuffer,
            mimetype: 'application/json',
            fileName: `creds_${phoneNumber}.json`,
            caption: `📁 *Session Credentials*\nUpload this file to your bot's session folder to keep it running.`
          }, { quoted: ms });
        }

        // Clean up after sending
        setTimeout(() => {
          if (fs.existsSync(sessionDir)) fs.rmSync(sessionDir, { recursive: true, force: true });
        }, 10000);
      }

      if (connection === "close") {
        const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
        if (!shouldReconnect) {
          if (fs.existsSync(sessionDir)) fs.rmSync(sessionDir, { recursive: true, force: true });
        }
      }
    });

    sock.ev.on("creds.update", saveCreds);

  } catch (error) {
    console.error("Pair Command Error:", error);
    await repondre(`❌ *An error occurred.* Please try again later.`);
    if (fs.existsSync(sessionDir)) fs.rmSync(sessionDir, { recursive: true, force: true });
  }
});
