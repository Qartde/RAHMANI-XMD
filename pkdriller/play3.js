const {
  zokou
} = require("../framework/zokou");
const ytSearch = require('yt-search');
const axios = require('axios');

zokou({
  'nomCom': "play",
  'desc': "Download audio from YouTube",
  'categorie': "Download",
  'reaction': '🎵',
  'fromMe': "true"
}, async (_0x4d1cb2, _0x6e67fd, _0x17c78a) => {
  
  const {
    ms: _0x42d661,
    arg: _0x32ab8b,
    repondre: _0x1e9691
  } = _0x17c78a;
  
  // Check if song name provided
  if (!_0x32ab8b || _0x32ab8b.length === 0) {
    return _0x1e9691("╭━━━━━━━━━━━━━━╮\n┃   🎵 *PLAY* 🎵\n╰━━━━━━━━━━━━━━╯\n\n┌─── *USAGE* ───┐\n│ Please provide a song name\n│\n│ 📝 *Example:*\n│ .play Calm Down\n│ .play Love Nwantiti\n└────────────────┘\n\n*RAHMANI-XMD* 🎵");
  }
  
  const query = _0x32ab8b.join(" ");
  const repoUrl = "https://github.com/Qartde/RAHMANI-XMD";
  const groupUrl = "https://chat.whatsapp.com/DTnrZzULVtP5r0E9rhoFOj";
  const channelUrl = "https://whatsapp.com/channel/0029VatokI45EjxufALmY32X";
  const thumbnail = "https://files.catbox.moe/aktbgo.jpg";
  
  try {
    // Send searching message
    await _0x6e67fd.sendMessage(_0x4d1cb2, {
      'text': "🔍 *Searching for:* " + query + "..."
    }, {
      'quoted': _0x42d661
    });
    
    // Search YouTube
    const searchResults = await ytSearch(query);
    
    if (!searchResults || !searchResults.videos.length) {
      return _0x1e9691("❌ No results found for: " + query);
    }
    
    const firstVideo = searchResults.videos[0];
    const videoUrl = firstVideo.url;
    const songTitle = firstVideo.title;
    const duration = firstVideo.timestamp;
    const videoThumbnail = firstVideo.thumbnail;
    
    // Try multiple download APIs
    const apis = [
      `https://api.davidcyriltech.my.id/ytplay?query=${encodeURIComponent(query)}`,
      `https://api.dreaded.site/api/ytdl/audio?url=${encodeURIComponent(videoUrl)}`,
      `https://api.giftedtech.web.id/api/download/ytmp3?url=${encodeURIComponent(videoUrl)}&apikey=gifted`,
      `https://api.zenkey.my.id/api/ytplay?query=${encodeURIComponent(query)}&apikey=zenkey`,
      `https://api.ryzendesu.vip/api/downloader/ytmp3?url=${encodeURIComponent(videoUrl)}`
    ];
    
    let downloadUrl = null;
    
    for (const api of apis) {
      try {
        const response = await axios.get(api, { timeout: 8000 });
        
        // Check different response formats
        if (response.data) {
          // David API format
          if (response.data.status === true && response.data.result?.download_url) {
            downloadUrl = response.data.result.download_url;
            break;
          }
          // Gifted API format
          else if (response.data.success === true && response.data.result?.download_url) {
            downloadUrl = response.data.result.download_url;
            break;
          }
          // Dreaded API format
          else if (response.data.status === 200 && response.data.result?.download_url) {
            downloadUrl = response.data.result.download_url;
            break;
          }
          // Zenkey API format
          else if (response.data.result?.download_url) {
            downloadUrl = response.data.result.download_url;
            break;
          }
          // Ryzendesu API format
          else if (response.data.url) {
            downloadUrl = response.data.url;
            break;
          }
          // Direct URL string
          else if (typeof response.data === 'string' && response.data.includes('http')) {
            const match = response.data.match(/https?:\/\/[^\s"']+/);
            if (match) downloadUrl = match[0];
            break;
          }
        }
      } catch (e) {
        // Try next API
      }
    }
    
    // If no download URL found
    if (!downloadUrl) {
      return _0x1e9691("╭━━━━━━━━━━━━━━╮\n┃   ❌ *FAILED* ❌\n╰━━━━━━━━━━━━━━╯\n\n┌─── *ERROR* ───┐\n│ Could not get download link\n│\n│ 🎵 *Title:* " + songTitle.substring(0, 30) + "\n│ 🔗 *Watch:* " + videoUrl + "\n└────────────────┘\n\n*RAHMANI-XMD* 🎵");
    }
    
    // Send audio with context info
    await _0x6e67fd.sendMessage(_0x4d1cb2, {
      'audio': { 'url': downloadUrl },
      'mimetype': 'audio/mpeg',
      'contextInfo': {
        'forwardingScore': 999,
        'isForwarded': true,
        'forwardedNewsletterMessageInfo': {
          'newsletterJid': "120363353854480831@newsletter",
          'newsletterName': "RAHMANI-XMD",
          'serverMessageId': 143
        },
        'externalAdReply': {
          'title': songTitle.substring(0, 30),
          'body': duration + " • RAHMANI-XMD",
          'thumbnailUrl': videoThumbnail || thumbnail,
          'sourceUrl': channelUrl,
          'mediaType': 1,
          'renderLargerThumbnail': false,
          'showAdAttribution': true
        }
      }
    }, {
      'quoted': _0x42d661
    });
    
    // Send success message
    await _0x6e67fd.sendMessage(_0x4d1cb2, {
      'text': "╭━━━━━━━━━━━━━━╮\n┃   ✅ *DOWNLOADED* ✅\n╰━━━━━━━━━━━━━━╯\n\n┌─── *SONG INFO* ───┐\n│ 🎵 *Title:* " + songTitle.substring(0, 30) + "\n│ ⏱️ *Duration:* " + duration + "\n│ 📺 *Channel:* " + (firstVideo.author?.name || 'Unknown') + "\n└────────────────────┘\n\n┌─── *LINKS* ───┐\n│ 📢 *Channel:* tap below\n│ 🔗 *YouTube:* " + videoUrl + "\n│ 👥 *Group:* tap below\n└────────────────┘\n\n*RAHMANI-XMD* 🎵",
      'contextInfo': {
        'forwardingScore': 999,
        'isForwarded': true,
        'forwardedNewsletterMessageInfo': {
          'newsletterJid': "120363353854480831@newsletter",
          'newsletterName': "RAHMANI-XMD",
          'serverMessageId': 143
        },
        'externalAdReply': {
          'title': "🎵 " + songTitle.substring(0, 25),
          'body': duration + " • Tap to join group",
          'thumbnailUrl': videoThumbnail || thumbnail,
          'sourceUrl': groupUrl,  // CTA inapeleka kwenye group
          'mediaType': 1,
          'renderLargerThumbnail': true,
          'showAdAttribution': true
        }
      }
    }, {
      'quoted': _0x42d661
    });
    
  } catch (_0x141e7b) {
    console.log("❌ play Command Error: " + _0x141e7b);
    
    // Simple fallback
    await _0x6e67fd.sendMessage(_0x4d1cb2, {
      'text': "❌ Error: " + _0x141e7b.message
    }, {
      'quoted': _0x42d661
    });
  }
});
