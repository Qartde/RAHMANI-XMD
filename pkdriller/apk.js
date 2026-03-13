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

        // ============= DIRECT DOWNLOAD LINKS FOR POPULAR APPS =============
        const popularApps = {
            'whatsapp': 'https://archive.org/download/com.whatsapp_202504/com.whatsapp_v2.25.7.83_apkpure.com.apk',
            'facebook': 'https://archive.org/download/com.facebook.katana_202504/com.facebook.katana_v462.0.0.0.69_apkpure.com.apk',
            'instagram': 'https://archive.org/download/com.instagram.android_202504/com.instagram.android_v360.0.0.29.81_apkpure.com.apk',
            'capcut': 'https://archive.org/download/com.lemon.lvoverseas_202504/com.lemon.lvoverseas_v12.6.0_apkpure.com.apk',
            'spotify': 'https://archive.org/download/com.spotify.music_202504/com.spotify.music_v8.9.24.613_apkpure.com.apk',
            'youtube': 'https://archive.org/download/com.google.android.youtube_202504/com.google.android.youtube_v19.25.38_apkpure.com.apk',
            'tiktok': 'https://archive.org/download/com.zhiliaoapp.musically_202504/com.zhiliaoapp.musically_v34.2.3_apkpure.com.apk',
            'snapchat': 'https://archive.org/download/com.snapchat.android_202504/com.snapchat.android_v12.75.0.45_apkpure.com.apk',
            'telegram': 'https://archive.org/download/org.telegram.messenger_202504/org.telegram.messenger_v10.10.3_apkpure.com.apk',
            'twitter': 'https://archive.org/download/com.twitter.android_202504/com.twitter.android_v10.32.0_apkpure.com.apk',
            'gmail': 'https://archive.org/download/com.google.android.gm_202504/com.google.android.gm_v2025.04.06_apkpure.com.apk',
            'maps': 'https://archive.org/download/com.google.android.apps.maps_202504/com.google.android.apps.maps_v11.125.0103_apkpure.com.apk',
            'chrome': 'https://archive.org/download/com.android.chrome_202504/com.android.chrome_v122.0.6261.105_apkpure.com.apk',
            'netflix': 'https://archive.org/download/com.netflix.mediaclient_202504/com.netflix.mediaclient_v8.130.0_apkpure.com.apk',
            'prime video': 'https://archive.org/download/com.amazon.avod.thirdpartyclient_202504/com.amazon.avod.thirdpartyclient_v3.0.382.2_apkpure.com.apk',
            'microsoft word': 'https://archive.org/download/com.microsoft.office.word_202504/com.microsoft.office.word_v16.0.17827.20156_apkpure.com.apk',
            'microsoft excel': 'https://archive.org/download/com.microsoft.office.excel_202504/com.microsoft.office.excel_v16.0.17827.20156_apkpure.com.apk',
            'microsoft powerpoint': 'https://archive.org/download/com.microsoft.office.powerpoint_202504/com.microsoft.office.powerpoint_v16.0.17827.20156_apkpure.com.apk'
        };

        const appKey = appName.toLowerCase().trim();
        
        // Check if it's a popular app with direct link
        if (popularApps[appKey]) {
            const downloadUrl = popularApps[appKey];
            
            await client.sendMessage(groupId, {
                text: `📱 *APP FOUND (Direct Link)*\n\n*Name:* ${appName}\n*Source:* Internet Archive\n\n⏳ *Downloading...*`,
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
                    document: { url: downloadUrl },
                    fileName: `${appName.replace(/[^a-zA-Z0-9]/g, '_')}.apk`,
                    mimetype: "application/vnd.android.package-archive",
                    caption: `📱 *${appName.toUpperCase()} APK*\n\n> Downloaded via RAHMANI-XMD`,
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
                            sourceUrl: downloadUrl
                        }
                    }
                },
                { quoted: ms }
            );
            return;
        }

        // ============= SEARCH VIA APKPURE WEBSITE =============
        try {
            // Try to search via APKPure
            const searchUrl = `https://api.droidjam.workers.dev/search?q=${encodeURIComponent(appName)}`;
            const searchRes = await axios.get(searchUrl, { timeout: 10000 });
            
            if (searchRes.data && searchRes.data.length > 0) {
                const app = searchRes.data[0];
                const downloadUrl = app.download_url || app.url;
                
                if (downloadUrl) {
                    await client.sendMessage(groupId, {
                        text: `📱 *APP FOUND*\n\n*Name:* ${app.name || app.title || appName}\n*Version:* ${app.version || 'Latest'}\n\n⏳ *Downloading...*`,
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

                    await client.sendMessage(
                        groupId,
                        {
                            document: { url: downloadUrl },
                            fileName: `${(app.name || appName).replace(/[^a-zA-Z0-9]/g, '_')}.apk`,
                            mimetype: "application/vnd.android.package-archive",
                            caption: `📱 *${(app.name || appName).toUpperCase()} APK*\n\n> Downloaded via RAHMANI-XMD`,
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
            console.log("Search API failed:", e.message);
        }

        // ============= DIRECT APKPURE DOWNLOAD =============
        try {
            const apkpureUrl = `https://d.apkpure.net/b/APK/${encodeURIComponent(appName)}?version=latest`;
            
            // Try to verify if the link works
            const headCheck = await axios.head(apkpureUrl, { timeout: 5000 }).catch(() => null);
            
            if (headCheck && headCheck.status === 200) {
                await client.sendMessage(groupId, {
                    text: `📱 *ATTEMPTING DIRECT DOWNLOAD*\n\n*Name:* ${appName}\n*Source:* APKPure\n\n⏳ *Downloading...*`,
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
                        document: { url: apkpureUrl },
                        fileName: `${appName.replace(/[^a-zA-Z0-9]/g, '_')}.apk`,
                        mimetype: "application/vnd.android.package-archive",
                        caption: `📱 *${appName.toUpperCase()} APK*\n\n> Downloaded via RAHMANI-XMD`,
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
                                sourceUrl: apkpureUrl
                            }
                        }
                    },
                    { quoted: ms }
                );
                return;
            }
        } catch (e) {
            console.log("APKPure direct failed");
        }

        // ============= IF ALL FAILED, SUGGEST POPULAR APPS =============
        const popularList = Object.keys(popularApps).slice(0, 10).map(app => `• ${app}`).join('\n');
        
        await client.sendMessage(groupId, {
            text: `❌ *Could not find "${appName}"*\n\n📱 *Try these popular apps:*\n${popularList}\n\nOr visit: https://apkpure.com/search?q=${encodeURIComponent(appName)}`,
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
                    body: '❌ App Not Found',
                    thumbnailUrl: 'https://files.catbox.moe/aktbgo.jpg',
                    mediaType: 1,
                    renderSmallThumbnail: true
                }
            }
        }, { quoted: ms });

    } catch (error) {
        console.error("Error during APK download process:", error);
        
        await client.sendMessage(groupId, {
            text: '❌ *APK download failed.*\n\nPlease try:\n1. Use exact app name\n2. Try popular apps like whatsapp, facebook\n3. Download manually from apkpure.com',
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
