const { zokou } = require("../framework/zokou");
const axios = require("axios");
const config = require("../set");

/* ===== VERIFIED CONTACT ===== */
const quotedContact = {
  key: {
    fromMe: false,
    participant: "0@s.whatsapp.net",
    remoteJid: "status@broadcast"
  },
  message: {
    contactMessage: {
      displayName: "BMB TECH VERIFIED ✅",
      vcard: `BEGIN:VCARD
VERSION:3.0
FN:BMB TECH VERIFIED ✅
ORG:BMB TECH BOT;
TEL;type=CELL;type=VOICE;waid=${config.OWNER_NUMBER || "0000000000"}:+${config.OWNER_NUMBER || "0000000000"}
END:VCARD`
    }
  }
};

zokou(
  {
    nomCom: "play",
    alias: ["ytmp3"],
    categorie: "Main",
    reaction: "🎶"
  },
  async (from, conn, context) => {

    const { arg, repondre, ms } = context;
    const q = arg.join(" ");

    /* ===== NEWSLETTER CONTEXT ===== */
    const newsletterContext = {
      mentionedJid: [ms.key.participant || ms.participant || from],
      forwardingScore: 999,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: "120363382023564830@newsletter",
        newsletterName: "Bmb",
        serverMessageId: 143
      }
    };

    try {
      if (!q) {
        return repondre("❗ Please provide a song name.");
      }

      // ⏳ Reaction processing
      await conn.sendMessage(from, {
        react: { text: "⏳", key: ms.key }
      });

      const apiUrl = `https://apis.davidcyriltech.my.id/play?query=${encodeURIComponent(q)}`;
      const { data } = await axios.get(apiUrl);

      if (!data.status || !data.result?.download_url) {
        await conn.sendMessage(from, {
          react: { text: "❌", key: ms.key }
        });
        return repondre("❌ No audio found or API error.");
      }

      const song = data.result;

      await conn.sendMessage(
        from,
        {
          audio: { url: song.download_url },
          mimetype: "audio/mpeg",
          fileName: `${song.title}.mp3`,
          contextInfo: newsletterContext
        },
        { quoted: quotedContact }
      );

      await conn.sendMessage(from, {
        react: { text: "✅", key: ms.key }
      });

      await repondre(`🎵 *${song.title}*\nDownloaded Successfully ✅`);

    } catch (err) {
      console.error("PLAY ERROR:", err);

      await conn.sendMessage(from, {
        react: { text: "❌", key: ms.key }
      });

      repondre("⚠️ Error occurred. Try again.");
    }
  }
);
