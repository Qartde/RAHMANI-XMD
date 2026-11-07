const { bmbtz } = require("../../devbmb/bmbtz");
const axios = require('axios');
const yts = require('yt-search');

const BOT_NAME = 'RAHMANI-XMD';
const NEWSLETTER_JID = '120363353854480831@newsletter';
const NEWSLETTER_NAME = 'Rahmani xmd Info';

/**
 * What the user sees (2 messages, nothing else):
 *   1. the picture with the details, sent as soon as the YouTube search is done
 *   2. the song / video itself
 */

// ====== STYLE MPYA WA CAPTION ======
const buildCaption = (type, video) => {
  const banner = type === "video" ? "🎬 VIDEO PLAYER" : "🎵 SONG PLAYER";
  return (
    `*╭━━━〔 ${banner} 〕━━━⬣*\n` +
    `*┃*\n` +
    `*┃ 🎵 Title    :* ${video.title}\n` +
    `*┃ ⏱️ Duration :* ${video.timestamp || 'LIVE'}\n` +
    `*┃ 👀 Views    :* ${Number(video.views || 0).toLocaleString()}\n` +
    `*┃ 📅 Uploaded :* ${video.ago || '-'}\n` +
    `*┃ 📺 Channel  :* ${(video.author && video.author.name) || '-'}\n` +
    `*┃*\n` +
    `*╰━━━━━━━━━━━━━━━━━━⬣*\n\n` +
    `🔗 ${video.url}\n\n` +
    `*🥀 Powered by ${BOT_NAME} 🥀*`
  );
};

const getContextInfo = (query = '', botName = BOT_NAME) => ({
  forwardingScore: 1,
  isForwarded: true,
  forwardedNewsletterMessageInfo: {
    newsletterJid: NEWSLETTER_JID,
    newsletterName: NEWSLETTER_NAME,
    serverMessageId: -1
  },
  body: query ? `Requested song: ${query}` : undefined,
  title: botName
});

const API_BASE = 'https://apis.davidcyril.name.ng';
const API_KEY = process.env.DAVIDCYRIL_API_KEY || '';
const API_TIMEOUT_MS = { audio: 30000, video: 90000 };
const MAX_VIDEO_BYTES = 90 * 1024 * 1024;

const SOURCES = {
  audio: [
    { path: '/download/ytmp3',    by: 'url', pick: (r) => r.download_url },
    { path: '/download/ytmp3-v2', by: 'url', pick: (r) => r.download },
    { path: '/play-v2',          by: 'q',   pick: (r) => r.audio && r.audio.url },
  ],
  video: [
    { path: '/download/ytmp4',   by: 'url', pick: (r) => r.download_url },
    { path: '/youtube/mp444',    by: 'url', pick: (r) => r.url },
  ],
};

const anyLink = (r) => r.download_url || r.download || r.url || (r.audio && r.audio.url) || null;

const shortError = (err) => {
  if (!err) return 'unknown error';
  const status = err.response && err.response.status;
  const body = err.response && err.response.data;
  const detail = body && typeof body === 'object' ? (body.message || body.error || JSON.stringify(body)) : (typeof body === 'string' ? body : '');
  const base = err.code === 'ECONNABORTED' ? 'timed out' : (err.message || String(err));
  return `${status ? 'HTTP ' + status + ' ' : ''}${base}${detail ? ' - ' + String(detail).slice(0, 120) : ''}`.slice(0, 220);
};

async function fetchFromSource(kind, src, video, query) {
  const headers = API_KEY ? { 'X-API-Key': API_KEY } : {};
  const params = src.by === 'q' ? { q: video.title || query } : { url: video.url };
  const response = await axios.get(`${API_BASE}${src.path}`, { params, headers, timeout: API_TIMEOUT_MS[kind] || 30000 });
  const data = response && response.data;
  const ok = data && (data.success === true || data.status === true || data.status === 200) && data.result;
  const link = ok ? (src.pick(data.result) || anyLink(data.result)) : null;
  if (!link) throw new Error('no link in the answer');
  return { downloadUrl: link, title: data.result.title || '' };
}

async function getLink(kind, video, query) {
  const problems = [];
  for (const src of SOURCES[kind]) {
    try {
      return await fetchFromSource(kind, src, video, query);
    } catch (err) {
      problems.push(`${src.path}: ${shortError(err)}`);
      console.log('[PLAY] source failed, trying the next one:', problems[problems.length - 1]);
    }
  }
  const error = new Error(problems.join(' | ') || 'No download source answered.');
  error.details = problems;
  throw error;
}

async function sendWithFallback(kind, video, query, send) {
  const problems = [];
  for (const src of SOURCES[kind]) {
    try {
      const result = await fetchFromSource(kind, src, video, query);
      await send(result);
      return result;
    } catch (err) {
      problems.push(`${src.path}: ${shortError(err)}`);
      console.log('[PLAY] source failed, trying the next one:', problems[problems.length - 1]);
    }
  }
  const error = new Error(problems.join(' | ') || 'No download source answered.');
  error.details = problems;
  throw error;
}

async function sendVideoFile(client, to, ms, result, fallbackName) {
  const fileName = `${result.title || fallbackName}.mp4`;
  try {
    return await client.sendMessage(to, { video: { url: result.downloadUrl }, mimetype: 'video/mp4', fileName }, { quoted: ms });
  } catch (firstError) {
    console.log('[PLAY] sending the link failed, downloading the video first:', shortError(firstError));
    const file = await axios.get(result.downloadUrl, {
      responseType: 'arraybuffer',
      timeout: 120000,
      maxContentLength: MAX_VIDEO_BYTES,
      maxBodyLength: MAX_VIDEO_BYTES,
      headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/120 Mobile Safari/537.36' },
    });
    return client.sendMessage(to, { video: Buffer.from(file.data), mimetype: 'video/mp4', fileName }, { quoted: ms });
  }
}

function startEarly(promiseFactory) {
  const promise = promiseFactory();
  promise.catch(() => {});
  return promise;
}

const text = (client, to, ms, message) =>
  client.sendMessage(to, { text: message, contextInfo: getContextInfo() }, { quoted: ms });

function registerCommand({ nomCom, reaction, kind, askText, label }) {
  bmbtz(
    { nomCom, categorie: "Search", reaction },
    async (origineMessage, client, commandeOptions) => {
      const { ms, arg } = commandeOptions;
      const query = arg.join(' ');
      if (!query) return text(client, origineMessage, ms, `❓ ${askText}`);

      try {
        const search = await yts(query);
        const video = search.videos[0];
        if (!video) return text(client, origineMessage, ms, '❌ No results found for your query.');

        const linkEarly = startEarly(() => getLink(kind === 'video' ? 'video' : 'audio', video, query));

        await client.sendMessage(
          origineMessage,
          {
            image: { url: video.thumbnail },
            caption: buildCaption(kind === 'video' ? 'video' : (kind === 'document' ? 'song' : 'audio'), video),
            contextInfo: getContextInfo(kind === 'audio' ? query : '')
          },
          { quoted: ms }
        );

        let result;
        try {
          result = await linkEarly;
        } catch (err) {
          console.error(`[${nomCom.toUpperCase()}] download link error:`, err && err.message ? err.message : err);
          return text(client, origineMessage, ms, `❌ Failed to retrieve the ${label} download link.`);
        }

        const safeTitle = video.title.replace(/[\\/:*?"<>|]/g, '');
        const downloadUrl = result.downloadUrl;

        if (kind === 'audio') {
          const fileName = `${result.title || safeTitle}.mp3`;
          await client.sendMessage(
            origineMessage,
            {
              audio: { url: downloadUrl },
              mimetype: 'audio/mpeg',
              fileName,
              title: BOT_NAME,
              body: `Requested song :${query}`,
              image: { url: video.thumbnail, renderSmallThumbnail: true },
              contextInfo: getContextInfo()
            },
            { quoted: ms }
          );
        } else if (kind === 'document') {
          const fileName = `${result.title || safeTitle}.mp3`;
          await client.sendMessage(
            origineMessage,
            { document: { url: downloadUrl }, mimetype: 'audio/mpeg', fileName },
            { quoted: ms }
          );
        } else {
          const fileName = `${result.title || safeTitle}.mp4`;
          await client.sendMessage(
            origineMessage,
            { video: { url: downloadUrl }, mimetype: 'video/mp4', fileName },
            { quoted: ms }
          );
        }
      } catch (err) {
        console.error(`[${nomCom.toUpperCase()}] Error:`, err);
        await text(client, origineMessage, ms, '❌ An error occurred while processing your request.');
      }
    }
  );
}

registerCommand({ nomCom: "song", reaction: "🎶", kind: "document", askText: 'Please provide a song name or keyword.', label: 'MP3' });

let buttons = null;
try {
  buttons = require('../../lib/buttons');
} catch (e) {
  console.log('⚠️ [play] lib/buttons.js is missing - upload it to get the buttons. Using plain text for now.');
}

const CHOICE_TTL_MS = 30 * 60 * 1000;
const pending = new Map();

function rememberChoice(video, query) {
  const now = Date.now();
  for (const [k, v] of pending) if (now - v.at > CHOICE_TTL_MS) pending.delete(k);
  if (pending.size > 500) pending.delete(pending.keys().next().value);
  let code;
  do { code = Math.random().toString(36).slice(2, 8); } while (pending.has(code));
  pending.set(code, { video, query, at: now });
  return code;
}

async function pictureOf(video) {
  try {
    const res = await axios.get(video.thumbnail, { responseType: 'arraybuffer', timeout: 8000 });
    return Buffer.from(res.data);
  } catch (e) {
    return undefined;
  }
}

function registerChoice({ nomCom, reaction, askText, banner }) {
  bmbtz(
    { nomCom, categorie: "Search", reaction },
    async (origineMessage, client, commandeOptions) => {
      const { ms, arg, prefixe, mybotpic } = commandeOptions;
      const query = arg.join(' ');
      if (!query) return text(client, origineMessage, ms, `❓ ${askText}`);
      const p = prefixe || '.';

      try {
        const search = await yts(query);
        const video = search.videos[0];
        if (!video) return text(client, origineMessage, ms, '❌ No results found for your query.');

        const code = rememberChoice(video, query);
        const list = [
          { text: '🎵 AUDIO', id: `${p}playaudio ${code}` },
          { text: '📄 DOCUMENT', id: `${p}playdoc ${code}` },
          { text: '🎬 VIDEO', id: `${p}playvideo ${code}` },
        ];
        const body = buildCaption(banner, video);

        if (!buttons) {
          return text(client, origineMessage, ms, `${body}\n\n*📌 Type one of these:*\n${list.map((b) => '• ' + b.id).join('\n')}`);
        }
        await buttons.sendButtons(client, origineMessage, {
          body,
          title: banner === 'video' ? '🎬 VIDEO PLAYER' : '🎵 SONG PLAYER',
          buttons: list,
          thumbnail: await pictureOf(video),
          mybotpic,
        });
      } catch (err) {
        console.error(`[${nomCom.toUpperCase()}] Error:`, err);
        await text(client, origineMessage, ms, '❌ An error occurred while processing your request.');
      }
    }
  );
}

function registerDeliver({ nomCom, kind, label, reaction }) {
  bmbtz(
    { nomCom, categorie: "Search", reaction, hidden: true },
    async (origineMessage, client, commandeOptions) => {
      const { ms, arg } = commandeOptions;
      const item = pending.get(String((arg && arg[0]) || '').trim());
      if (!item) {
        return text(client, origineMessage, ms, '❌ This choice has expired. Search again, for example: .play <song name>');
      }
      const { video, query } = item;
      const safeTitle = video.title.replace(/[\\/:*?"<>|]/g, '');
      try {
        if (kind === 'video') {
          await text(client, origineMessage, ms, '⏳ *Preparing your video, please wait...*');
        }
        await sendWithFallback(kind === 'video' ? 'video' : 'audio', video, query, async (result) => {
          const downloadUrl = result.downloadUrl;
          if (kind === 'audio') {
            await client.sendMessage(
              origineMessage,
              {
                audio: { url: downloadUrl },
                mimetype: 'audio/mpeg',
                fileName: `${result.title || safeTitle}.mp3`,
                title: BOT_NAME,
                body: `Requested song :${query}`,
                image: { url: video.thumbnail, renderSmallThumbnail: true },
                contextInfo: getContextInfo()
              },
              { quoted: ms }
            );
          } else if (kind === 'document') {
            await client.sendMessage(
              origineMessage,
              { document: { url: downloadUrl }, mimetype: 'audio/mpeg', fileName: `${result.title || safeTitle}.mp3` },
              { quoted: ms }
            );
          } else {
            await sendVideoFile(client, origineMessage, ms, result, safeTitle);
          }
        });
      } catch (err) {
        console.error(`[${nomCom.toUpperCase()}] Error:`, err && err.message ? err.message : err);
        const why = err && err.details && err.details.length ? `\n\n*⚠️ Reason:*\n${err.details.join('\n')}` : '';
        await text(client, origineMessage, ms, `❌ Failed to send the ${label} file. Please try again in a moment.${why}`);
      }
    }
  );
}

registerChoice({ nomCom: "play", reaction: "🎵", askText: 'Please provide a song name or keyword.', banner: 'audio' });
registerChoice({ nomCom: "video", reaction: "🎬", askText: 'Please provide a video name or keyword.', banner: 'video' });

registerDeliver({ nomCom: "playaudio", kind: "audio", label: "MP3", reaction: "🎵" });
registerDeliver({ nomCom: "playdoc", kind: "document", label: "MP3", reaction: "📄" });
registerDeliver({ nomCom: "playvideo", kind: "video", label: "MP4", reaction: "🎬" });
