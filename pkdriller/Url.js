const { Sticker, createSticker, StickerTypes } = require('wa-sticker-formatter');
const { zokou } = require("../framework/zokou");
const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const fs = require("fs-extra");
const ffmpeg = require("fluent-ffmpeg");
const { Catbox } = require('node-catbox');

const catbox = new Catbox();

async function uploadToCatbox(Path) {
    if (!fs.existsSync(Path)) {
        throw new Error("File does not exist");
    }

    try {
        const response = await catbox.uploadFile({
            path: Path
        });

        if (response) {
            return response;
        } else {
            throw new Error("Error retrieving the file link");
        }
    } catch (err) {
        throw new Error(String(err));
    }
}

async function convertToMp3(inputPath, outputPath) {
    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .toFormat("mp3")
            .on("error", (err) => reject(err))
            .on("end", () => resolve(outputPath))
            .save(outputPath);
    });
}

zokou({ 
    nomCom: "url", 
    categorie: "General", 
    reaction: "👨🏿‍💻" 
}, async (origineMessage, zk, commandeOptions) => {
    const { msgRepondu, repondre, ms } = commandeOptions;

    if (!msgRepondu) {
        await zk.sendMessage(origineMessage, {
            text: '❌ *Please reply to an image, video, or audio file.*',
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
                    body: '⚪ *URL Generator*\nReply to any media file to get a direct link!',
                    thumbnailUrl: 'https://files.catbox.moe/aktbgo.jpg',
                    mediaType: 1,
                    renderSmallThumbnail: true
                }
            }
        }, { quoted: ms });
        return;
    }

    let mediaPath, mediaType;

    if (msgRepondu.videoMessage) {
        const videoSize = msgRepondu.videoMessage.fileLength;

        if (videoSize > 50 * 1024 * 1024) {
            await zk.sendMessage(origineMessage, {
                text: '❌ *The video is too long. Please send a smaller video.*',
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
                        body: '⚠️ *Video Size Limit*\nMaximum size allowed: 50MB',
                        thumbnailUrl: 'https://files.catbox.moe/aktbgo.jpg',
                        mediaType: 1,
                        renderSmallThumbnail: true
                    }
                }
            }, { quoted: ms });
            return;
        }

        mediaPath = await zk.downloadAndSaveMediaMessage(msgRepondu.videoMessage);
        mediaType = 'video';
    } else if (msgRepondu.imageMessage) {
        mediaPath = await zk.downloadAndSaveMediaMessage(msgRepondu.imageMessage);
        mediaType = 'image';
    } else if (msgRepondu.audioMessage) {
        mediaPath = await zk.downloadAndSaveMediaMessage(msgRepondu.audioMessage);
        mediaType = 'audio';

        const outputPath = `${mediaPath}.mp3`;

        try {
            await convertToMp3(mediaPath, outputPath);
            fs.unlinkSync(mediaPath);
            mediaPath = outputPath;
        } catch (error) {
            console.error("Error converting audio to MP3:", error);
            await zk.sendMessage(origineMessage, {
                text: '❌ *Failed to process the audio file.*',
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
                        body: '⚠️ *Audio Processing Error*\nPlease try again with a different file',
                        thumbnailUrl: 'https://files.catbox.moe/aktbgo.jpg',
                        mediaType: 1,
                        renderSmallThumbnail: true
                    }
                }
            }, { quoted: ms });
            return;
        }
    } else {
        await zk.sendMessage(origineMessage, {
            text: '❌ *Unsupported media type. Reply with an image, video, or audio file.*',
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
                    body: '⚠️ *Invalid Media*\nSupported formats: Image, Video, Audio',
                    thumbnailUrl: 'https://files.catbox.moe/aktbgo.jpg',
                    mediaType: 1,
                    renderSmallThumbnail: true
                }
            }
        }, { quoted: ms });
        return;
    }

    try {
        const catboxUrl = await uploadToCatbox(mediaPath);
        fs.unlinkSync(mediaPath);

        // Send success message with media preview
        let mediaTypeEmoji = '';
        let mediaTypeText = '';
        
        switch (mediaType) {
            case 'image':
                mediaTypeEmoji = '🖼️';
                mediaTypeText = 'Image';
                break;
            case 'video':
                mediaTypeEmoji = '🎥';
                mediaTypeText = 'Video';
                break;
            case 'audio':
                mediaTypeEmoji = '🎵';
                mediaTypeText = 'Audio';
                break;
        }

        // Try to send the actual media as preview if possible
        try {
            if (mediaType === 'image') {
                await zk.sendMessage(origineMessage, {
                    image: { url: catboxUrl },
                    caption: `𝐑𝐀𝐇𝐌𝐀𝐍𝐈-𝐗𝐌𝐃 URL\n\n${mediaTypeEmoji} *${mediaTypeText}*\n🔗 *Link:* ${catboxUrl}`,
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
                            body: `${mediaTypeEmoji} ${mediaTypeText} Upload Successful!\n⚪ Click to open link`,
                            thumbnailUrl: mediaType === 'image' ? catboxUrl : 'https://files.catbox.moe/aktbgo.jpg',
                            mediaType: 1,
                            renderSmallThumbnail: true,
                            sourceUrl: catboxUrl
                        }
                    }
                }, { quoted: ms });
            } else {
                await zk.sendMessage(origineMessage, {
                    text: `𝐑𝐀𝐇𝐌𝐀𝐍𝐈-𝐗𝐌𝐃 URL\n\n${mediaTypeEmoji} *${mediaTypeText}*\n🔗 *Link:* ${catboxUrl}`,
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
                            body: `${mediaTypeEmoji} ${mediaTypeText} Upload Successful!\n⚪ Click to open link`,
                            thumbnailUrl: 'https://files.catbox.moe/aktbgo.jpg',
                            mediaType: 1,
                            renderSmallThumbnail: true,
                            sourceUrl: catboxUrl
                        }
                    }
                }, { quoted: ms });
            }
        } catch (previewError) {
            // Fallback to simple text message if preview fails
            await zk.sendMessage(origineMessage, {
                text: `𝐑𝐀𝐇𝐌𝐀𝐍𝐈-𝐗𝐌𝐃 URL\n\n${mediaTypeEmoji} *${mediaTypeText}*\n🔗 *Link:* ${catboxUrl}`,
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
                        body: `${mediaTypeEmoji} ${mediaTypeText} Upload Successful!`,
                        thumbnailUrl: 'https://files.catbox.moe/aktbgo.jpg',
                        mediaType: 1,
                        renderSmallThumbnail: true
                    }
                }
            }, { quoted: ms });
        }

    } catch (error) {
        console.error('Error while creating your URL:', error);
        await zk.sendMessage(origineMessage, {
            text: '❌ *Oops, an error occurred while uploading.*',
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
                    body: '⚠️ *Upload Failed*\nPlease try again later',
                    thumbnailUrl: 'https://files.catbox.moe/aktbgo.jpg',
                    mediaType: 1,
                    renderSmallThumbnail: true
                }
            }
        }, { quoted: ms });
    }
});
