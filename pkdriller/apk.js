const { zokou } = require("../framework/zokou");
const fs = require('fs-extra');
const conf = require('../set');
const { default: axios } = require("axios");
const ffmpeg = require("fluent-ffmpeg");

zokou({
    'nomCom': 'apk',
    'aliases': ['app', 'playstore', 'modapk', 'androidapp'],
    'reaction': '📱',
    'categorie': 'Download'
}, async (groupId, client, context) => {
    const { repondre, arg, ms } = context;

    try {
        // Check if app name is provided
        const appName = arg.join(" ");
        if (!appName) {
            await client.sendMessage(groupId, {
                text: '📱 *APK DOWNLOADER*\n\nPlease provide an app name.\n\nExample: `.apk whatsapp`',
                contextInfo: {
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363353854480831@newsletter',
                        newsletterName: 'RAHMANI XMD',
                        serverMessageId: 143
                    },
                    forwardingScore: 999,
                    externalAdReply: {
                        title: 'RAHMANI XMD',
                        body: '📱 APK Downloader\n⚪ Enter app name to search',
                        thumbnailUrl: 'https://files.catbox.moe/aktbgo.jpg',
                        mediaType: 1,
                        renderSmallThumbnail: true
                    }
                }
            }, { quoted: ms });
            return;
        }

        // Send searching message
        await client.sendMessage(groupId, {
            text: `🔍 *Searching for:* ${appName}\n⏳ Please wait...`,
            contextInfo: {
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363353854480831@newsletter',
                    newsletterName: 'RAHMANI XMD',
                    serverMessageId: 143
                },
                forwardingScore: 999,
                externalAdReply: {
                    title: 'RAHMANI XMD',
                    body: `🔍 Searching: ${appName.substring(0, 20)}`,
                    thumbnailUrl: 'https://files.catbox.moe/aktbgo.jpg',
                    mediaType: 1,
                    renderSmallThumbnail: true
                }
            }
        }, { quoted: ms });

        // Use working API endpoints
        const searchUrl = `https://d1nx5z51y5vjse.cloudfront.net/apk/search?q=${encodeURIComponent(appName)}`;
        const searchResponse = await axios.get(searchUrl);
        
        if (!searchResponse.data || searchResponse.data.length === 0) {
            await client.sendMessage(groupId, {
                text: `❌ *No apps found for:* ${appName}\n\nPlease try another name.`,
                contextInfo: {
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363353854480831@newsletter',
                        newsletterName: 'RAHMANI XMD',
                        serverMessageId: 143
                    },
                    forwardingScore: 999,
                    externalAdReply: {
                        title: 'RAHMANI XMD',
                        body: '❌ No Results Found',
                        thumbnailUrl: 'https://files.catbox.moe/aktbgo.jpg',
                        mediaType: 1,
                        renderSmallThumbnail: true
                    }
                }
            }, { quoted: ms });
            return;
        }

        // Get first app result
        const app = searchResponse.data[0];
        
        // Alternative: Try multiple API sources
        let downloadUrl = null;
        let appName_display = app.name || app.title || app.app_name || appName;
        let appIcon = app.icon || app.image || 'https://files.catbox.moe/aktbgo.jpg';
        let appDeveloper = app.developer || app.author || 'Unknown';
        let appSize = app.size || 'Unknown';

        // Try different API endpoints for download
        const downloadEndpoints = [
            `https://d1nx5z51y5vjse.cloudfront.net/apk/download?id=${app.id || app.app_id || ''}`,
            `https://api.souravprogramming.com/apk/download?name=${encodeURIComponent(appName)}`,
            `https://apk-dl.vercel.app/api/download?app=${encodeURIComponent(appName)}`
        ];

        for (const endpoint of downloadEndpoints) {
            try {
                const dlResponse = await axios.get(endpoint, { timeout: 8000 });
                if (dlResponse.data && (dlResponse.data.url || dlResponse.data.dllink || dlResponse.data.download)) {
                    downloadUrl = dlResponse.data.url || dlResponse.data.dllink || dlResponse.data.download;
                    break;
                }
            } catch (e) {
                continue; // Try next endpoint
            }
        }

        // Fallback: If no download URL found, use direct Aptoide search
        if (!downloadUrl) {
            try {
                const aptoideResponse = await axios.get(`https://apk-dl.vercel.app/api/search?q=${encodeURIComponent(appName)}`);
                if (aptoideResponse.data && aptoideResponse.data.url) {
                    downloadUrl = aptoideResponse.data.url;
                }
            } catch (e) {
                console.log("Aptoide fallback failed");
            }
        }

        if (!downloadUrl) {
            await client.sendMessage(groupId, {
                text: `❌ *Cannot download:* ${appName}\n\nUnable to fetch download link. Please try another app or try again later.`,
                contextInfo: {
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363353854480831@newsletter',
                        newsletterName: 'RAHMANI XMD',
                        serverMessageId: 143
                    },
                    forwardingScore: 999,
                    externalAdReply: {
                        title: 'RAHMANI XMD',
                        body: '❌ Download Failed',
                        thumbnailUrl: 'https://files.catbox.moe/aktbgo.jpg',
                        mediaType: 1,
                        renderSmallThumbnail: true
                    }
                }
            }, { quoted: ms });
            return;
        }

        // Send app info first
        await client.sendMessage(groupId, {
            text: `📱 *APP FOUND*\n\n*Name:* ${appName_display}\n*Developer:* ${appDeveloper}\n*Size:* ${appSize}\n\n⏳ *Downloading...*`,
            contextInfo: {
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363353854480831@newsletter',
                    newsletterName: 'RAHMANI XMD',
                    serverMessageId: 143
                },
                forwardingScore: 999,
                externalAdReply: {
                    title: 'RAHMANI XMD',
                    body: `📱 ${appName_display.substring(0, 25)}`,
                    thumbnailUrl: appIcon,
                    mediaType: 1,
                    renderSmallThumbnail: true
                }
            }
        }, { quoted: ms });

        // Send the APK file
        await client.sendMessage(
            groupId,
            {
                document: { url: downloadUrl },
                fileName: `${appName_display.replace(/[^a-zA-Z0-9]/g, '_')}.apk`,
                mimetype: "application/vnd.android.package-archive",
                caption: "📱 *RAHMANI-XMD APK DOWNLOADER*\n\n> Powered by RAHMANI-XMD",
                contextInfo: {
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363353854480831@newsletter',
                        newsletterName: 'RAHMANI XMD',
                        serverMessageId: 143
                    },
                    forwardingScore: 999,
                    externalAdReply: {
                        title: 'RAHMANI XMD',
                        body: `📱 ${appName_display.substring(0, 20)}.apk`,
                        thumbnailUrl: appIcon,
                        mediaType: 1,
                        renderSmallThumbnail: true,
                        sourceUrl: downloadUrl
                    }
                }
            },
            { quoted: ms }
        );

    } catch (error) {
        console.error("Error during APK download process:", error);
        
        await client.sendMessage(groupId, {
            text: '❌ *APK download failed.*\n\nPlease try again later or use another app name.\n\n_Error: ' + error.message + '_',
            contextInfo: {
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363353854480831@newsletter',
                    newsletterName: 'RAHMANI XMD',
                    serverMessageId: 143
                },
                forwardingScore: 999,
                externalAdReply: {
                    title: 'RAHMANI XMD',
                    body: '❌ Download Error',
                    thumbnailUrl: 'https://files.catbox.moe/aktbgo.jpg',
                    mediaType: 1,
                    renderSmallThumbnail: true
                }
            }
        }, { quoted: ms });
    }
});
