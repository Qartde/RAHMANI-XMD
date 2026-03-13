const { zokou } = require("../framework/zokou");
const fs = require('fs-extra');
const conf = require('../set');
const { default: axios } = require("axios");

zokou({
    'nomCom': 'apk',
    'aliases': ['app', 'playstore', 'modapk', 'androidapp'],
    'reaction': '📱',
    'categorie': 'Download'
}, async (groupId, client, context) => {
    const { repondre, arg, ms } = context;

    try {
        const appName = arg.join(" ");
        if (!appName) {
            await client.sendMessage(groupId, {
                text: '📱 *APK DOWNLOADER*\n\nExample: `.apk whatsapp`',
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
                        body: '📱 Enter app name',
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

        // ============= WORKING APKPURE API =============
        try {
            // First, search for the app
            const searchUrl = `https://apkpure.net/search?q=${encodeURIComponent(appName)}`;
            
            // Get app details from APKPure
            const apiUrl = `https://pureapkapi.vercel.app/api/search?query=${encodeURIComponent(appName)}`;
            const searchRes = await axios.get(apiUrl, { timeout: 15000 });
            
            if (searchRes.data && searchRes.data.length > 0) {
                const app = searchRes.data[0];
                
                // Get download link
                const downloadApi = `https://pureapkapi.vercel.app/api/download?url=${encodeURIComponent(app.url || app.download_url || '')}`;
                const downloadRes = await axios.get(downloadApi, { timeout: 15000 });
                
                if (downloadRes.data && downloadRes.data.url) {
                    const downloadUrl = downloadRes.data.url;
                    
                    // Send app info
                    await client.sendMessage(groupId, {
                        text: `📱 *APP FOUND*\n\n*Name:* ${app.name || app.title || appName}\n*Size:* ${app.size || 'Unknown'}\n*Version:* ${app.version || 'Latest'}\n\n⏳ *Downloading...*`,
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
                                body: `📱 ${(app.name || appName).substring(0, 25)}`,
                                thumbnailUrl: app.icon || 'https://files.catbox.moe/aktbgo.jpg',
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
                            fileName: `${(app.name || appName).replace(/[^a-zA-Z0-9]/g, '_')}.apk`,
                            mimetype: "application/vnd.android.package-archive",
                            caption: `📱 *${(app.name || appName).toUpperCase()}*\n\n> Downloaded via RAHMANI-XMD`,
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
                                    body: `📱 ${(app.name || appName).substring(0, 20)}.apk`,
                                    thumbnailUrl: app.icon || 'https://files.catbox.moe/aktbgo.jpg',
                                    mediaType: 1,
                                    renderSmallThumbnail: true,
                                    sourceUrl: downloadUrl
                                }
                            }
                        },
                        { quoted: ms }
                    );
                    return;
                }
            }
        } catch (e) {
            console.log("APKPure API failed:", e.message);
        }

        // ============= BACKUP: DIRECT APKPURE DOWNLOAD =============
        try {
            const directUrl = `https://d.apkpure.net/b/APK/${encodeURIComponent(appName)}?version=latest`;
            
            // Try to download directly
            await client.sendMessage(groupId, {
                text: `📱 *ATTEMPTING DIRECT DOWNLOAD*\n\n*Name:* ${appName}\n\n⏳ *Downloading from APKPure...*`,
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
                        body: `📱 ${appName.substring(0, 25)}`,
                        thumbnailUrl: 'https://files.catbox.moe/aktbgo.jpg',
                        mediaType: 1,
                        renderSmallThumbnail: true
                    }
                }
            }, { quoted: ms });

            await client.sendMessage(
                groupId,
                {
                    document: { url: directUrl },
                    fileName: `${appName.replace(/[^a-zA-Z0-9]/g, '_')}.apk`,
                    mimetype: "application/vnd.android.package-archive",
                    caption: `📱 *${appName.toUpperCase()}*\n\n> Downloaded via RAHMANI-XMD`,
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
                            body: `📱 ${appName.substring(0, 20)}.apk`,
                            thumbnailUrl: 'https://files.catbox.moe/aktbgo.jpg',
                            mediaType: 1,
                            renderSmallThumbnail: true,
                            sourceUrl: directUrl
                        }
                    }
                },
                { quoted: ms }
            );
            return;

        } catch (e) {
            console.log("Direct download failed:", e.message);
        }

        // ============= LAST RESORT: SEND LINK =============
        const searchLink = `https://apkpure.net/search?q=${encodeURIComponent(appName)}`;
        
        await client.sendMessage(groupId, {
            text: `❌ *Cannot download directly*\n\n🔗 *Search manually:*\n${searchLink}\n\n📱 *Popular apps:*\n• whatsapp\n• facebook\n• instagram\n• capcut\n• spotify\n• youtube`,
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
                    body: '📱 Click to search APKPure',
                    thumbnailUrl: 'https://files.catbox.moe/aktbgo.jpg',
                    mediaType: 1,
                    renderSmallThumbnail: true,
                    sourceUrl: searchLink
                }
            }
        }, { quoted: ms });

    } catch (error) {
        console.error("Error:", error);
        
        await client.sendMessage(groupId, {
            text: '❌ *Error*\n\nTry: https://apkpure.net/search?q=' + encodeURIComponent(arg.join(" ")),
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
                    body: '❌ Error',
                    thumbnailUrl: 'https://files.catbox.moe/aktbgo.jpg',
                    mediaType: 1,
                    renderSmallThumbnail: true
                }
            }
        }, { quoted: ms });
    }
});
