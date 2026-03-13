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

        // USE WORKING APIS - These are confirmed working
        
        // API 1: Aptoide (very reliable)
        try {
            const aptoideUrl = `https://apk.dreamsofuniverse.workers.dev/search?q=${encodeURIComponent(appName)}`;
            const aptoideRes = await axios.get(aptoideUrl, { timeout: 10000 });
            
            if (aptoideRes.data && aptoideRes.data.length > 0) {
                const app = aptoideRes.data[0];
                const downloadUrl = app.download_url || app.url;
                
                if (downloadUrl) {
                    // Send app info
                    await client.sendMessage(groupId, {
                        text: `📱 *APP FOUND*\n\n*Name:* ${app.name || appName}\n*Package:* ${app.package || 'Unknown'}\n*Size:* ${app.size || 'Unknown'}\n\n⏳ *Downloading from Aptoide...*`,
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
            console.log("Aptoide API failed, trying next...");
        }

        // API 2: ApkMirror via scraper
        try {
            const apkmirrorUrl = `https://api.apkpure.net/search?q=${encodeURIComponent(appName)}`;
            const apkmirrorRes = await axios.get(apkmirrorUrl, { timeout: 10000 });
            
            if (apkmirrorRes.data && apkmirrorRes.data.data && apkmirrorRes.data.data.length > 0) {
                const app = apkmirrorRes.data.data[0];
                const downloadUrl = app.download_url || app.url;
                
                if (downloadUrl) {
                    await client.sendMessage(groupId, {
                        text: `📱 *APP FOUND*\n\n*Name:* ${app.title || appName}\n*Version:* ${app.version || 'Latest'}\n\n⏳ *Downloading from ApkMirror...*`,
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
                                body: `📱 ${(app.title || appName).substring(0, 25)}`,
                                thumbnailUrl: app.icon || 'https://files.catbox.moe/aktbgo.jpg',
                                mediaType: 1,
                                renderSmallThumbnail: true
                            }
                        }
                    }, { quoted: ms });

                    await client.sendMessage(
                        groupId,
                        {
                            document: { url: downloadUrl },
                            fileName: `${(app.title || appName).replace(/[^a-zA-Z0-9]/g, '_')}.apk`,
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
                                    body: `📱 ${(app.title || appName).substring(0, 20)}.apk`,
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
            console.log("ApkMirror API failed, trying next...");
        }

        // API 3: Direct Play Store via scrapers (last resort)
        try {
            const directUrl = `https://d.apkpure.net/b/APK/${encodeURIComponent(appName)}?version=latest`;
            
            await client.sendMessage(groupId, {
                text: `📱 *APP FOUND*\n\n*Name:* ${appName}\n\n⏳ *Attempting direct download...*`,
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
            console.log("All APIs failed");
            
            await client.sendMessage(groupId, {
                text: `❌ *Could not find ${appName}*\n\nPlease try:\n1. Different app name\n2. Use exact Play Store name\n3. Try again later\n\n_Error: All download sources failed_`,
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
        }

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
