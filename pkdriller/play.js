const { zokou } = require("../framework/zokou");
const axios = require("axios");
const ytSearch = require("yt-search");
const conf = require(__dirname + "/../set");

zokou(
  {
    nomCom: "play",
    aliases: ["song", "playdoc", "audio", "mp3"],
    categorie: "download",
    reaction: "🎧"
  },
  async (dest, zk, commandOptions) => {
    const { arg, ms, repondre } = commandOptions;

    if (!arg[0]) {
      return repondre("Please provide a song name.");
    }

    const query = arg.join(" ");

    try {
      // 🔎 YouTube search
      const searchResults = await ytSearch(query);
      if (!searchResults || !searchResults.videos.length) {
        return repondre("No song found for the specified query.");
      }

      const firstVideo = searchResults.videos[0];
      const videoUrl = firstVideo.url;

      // 🎧 GiftedTech API (ACTIVE – STREAM)
      const api = `https://ytapi.giftedtech.co.ke/api/ytdla.php?url=${encodeURIComponent(
        videoUrl
      )}&stream=true`;

      const res = await axios.get(api, {
        responseType: "arraybuffer",
        timeout: 60000
      });

      const audioBuffer = Buffer.from(res.data);

      const caption = `\nBmb Tech AUDIOS\n
╭┈┈┈⊷
┊Title: ${firstVideo.title}
┊Quality: High
┊Duration: ${firstVideo.timestamp}
╰┈┈┈┈┈┈┈┈┈┈┈┈┈⊷
⦿ *Direct YtLink:* ${videoUrl}
`;

      const contextInfo = {
        isForwarded: true,
        forwardingScore: 999,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363382023564830@newsletter",
          newsletterName: "Bmb Tech",
          serverMessageId: 143
        },
        externalAdReply: {
          title: conf.BOT,
          body: firstVideo.title,
          mediaType: 1,
          sourceUrl: conf.GURL,
          thumbnailUrl: firstVideo.thumbnail,
          renderLargerThumbnail: false,
          showAdAttribution: true
        }
      };

      // 🔊 AUDIO
      await zk.sendMessage(
        dest,
        {
          audio: audioBuffer,
          mimetype: "audio/mpeg",
          caption,
          contextInfo
        },
        { quoted: ms }
      );

      // 📁 DOCUMENT MP3
      await zk.sendMessage(
        dest,
        {
          document: audioBuffer,
          mimetype: "audio/mpeg",
          fileName: `${firstVideo.title}.mp3`.replace(/[^\w\s.-]/gi, ""),
          caption,
          contextInfo
        },
        { quoted: ms }
      );

    } catch (error) {
      console.error("PLAY ERROR:", error);
      return repondre("❌ Download failed. Please try again later.");
    }
  }
);
