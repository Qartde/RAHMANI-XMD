const { zokou } = require("../framework/zokou");
const { getContentType, downloadContentFromMessage } = require("@whiskeysockets/baileys");
const fs = require("fs-extra");
const { Sticker, StickerTypes } = require('wa-sticker-formatter');

zokou({ 
    nomCom: "vv", 
    aliases: ["send", "keep", "viewonce", "vo"], 
    categorie: "General",
    reaction: "👀"
}, async (dest, zk, commandeOptions) => {
    const { repondre, msgRepondu, ms } = commandeOptions;

    if (!msgRepondu) {
        await zk.sendMessage(dest, {
            text: '👀 *VIEW ONCE SAVER*\n\nReply to a view-once message (image/video) to save it.',
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
                    body: '👀 View Once Saver\n⚪ Reply to any view-once media',
                    thumbnailUrl: 'https://files.catbox.moe/aktbgo.jpg',
                    mediaType: 1,
                    renderSmallThumbnail: true
                }
            }
        }, { quoted: ms });
        return;
    }

    try {
        // Check if it's a view-once message
        const isViewOnce = msgRepondu.viewOnce || 
                          msgRepondu.imageMessage?.viewOnce || 
                          msgRepondu.videoMessage?.viewOnce;

        if (!isViewOnce) {
            await zk.sendMessage(dest, {
                text: '❌ *Not a view-once message!*\n\nReply to a message that disappears after viewing (🕷️ icon).',
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
                        body: '❌ Invalid Message Type\nPlease reply to a view-once message',
                        thumbnailUrl: 'https://files.catbox.moe/aktbgo.jpg',
                        mediaType: 1,
                        renderSmallThumbnail: true
                    }
                }
            }, { quoted: ms });
            return;
        }

        // Determine message type and extract content
        let mediaType = null;
        let mediaMessage = null;
        let caption = '';

        if (msgRepondu.imageMessage) {
            mediaType = 'image';
            mediaMessage = msgRepondu.imageMessage;
            caption = msgRepondu.imageMessage.caption || '';
        } else if (msgRepondu.videoMessage) {
            mediaType = 'video';
            mediaMessage = msgRepondu.videoMessage;
            caption = msgRepondu.videoMessage.caption || '';
        } else if (msgRepondu.audioMessage) {
            mediaType = 'audio';
            mediaMessage = msgRepondu.audioMessage;
        } else if (msgRepondu.documentMessage) {
            mediaType = 'document';
            mediaMessage = msgRepondu.documentMessage;
        } else {
            await zk.sendMessage(dest, {
                text: '❌ *Unsupported media type!*\n\nOnly image and video view-once messages are supported.',
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
                        body: '❌ Unsupported Type\nOnly images/videos work with view-once',
                        thumbnailUrl: 'https://files.catbox.moe/aktbgo.jpg',
                        mediaType: 1,
                        renderSmallThumbnail: true
                    }
                }
            }, { quoted: ms });
            return;
        }

        // Download the media
        await zk.sendMessage(dest, {
            text: '⏳ *Downloading view-once media...*',
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
                    body: '⏳ Processing your request...',
                    thumbnailUrl: 'https://files.catbox.moe/aktbgo.jpg',
                    mediaType: 1,
                    renderSmallThumbnail: true
                }
            }
        }, { quoted: ms });

        // Download using downloadContentFromMessage
        const stream = await downloadContentFromMessage(mediaMessage, mediaType);
        let buffer = Buffer.from([]);
        
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }

        // Prepare the message to send back
        let messageToSend = {};

        switch (mediaType) {
            case 'image':
                messageToSend = {
                    image: buffer,
                    caption: caption ? `📸 *VIEW ONCE SAVED*\n\n_Caption:_ ${caption}` : '📸 *VIEW ONCE SAVED*',
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
                            body: '📸 View Once Image Saved!',
                            thumbnailUrl: 'https://files.catbox.moe/aktbgo.jpg',
                            mediaType: 1,
                            renderSmallThumbnail: true
                        }
                    }
                };
                break;

            case 'video':
                messageToSend = {
                    video: buffer,
                    caption: caption ? `🎥 *VIEW ONCE SAVED*\n\n_Caption:_ ${caption}` : '🎥 *VIEW ONCE SAVED*',
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
                            body: '🎥 View Once Video Saved!',
                            thumbnailUrl: 'https://files.catbox.moe/aktbgo.jpg',
                            mediaType: 1,
                            renderSmallThumbnail: true
                        }
                    }
                };
                break;

            case 'audio':
                messageToSend = {
                    audio: buffer,
                    mimetype: 'audio/mp4',
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
                            body: '🎵 View Once Audio Saved!',
                            thumbnailUrl: 'https://files.catbox.moe/aktbgo.jpg',
                            mediaType: 1,
                            renderSmallThumbnail: true
                        }
                    }
                };
                break;

            case 'document':
                messageToSend = {
                    document: buffer,
                    fileName: mediaMessage.fileName || 'view_once_document.pdf',
                    mimetype: mediaMessage.mimetype,
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
                            body: '📄 View Once Document Saved!',
                            thumbnailUrl: 'https://files.catbox.moe/aktbgo.jpg',
                            mediaType: 1,
                            renderSmallThumbnail: true
                        }
                    }
                };
                break;
        }

        // Send the saved media
        await zk.sendMessage(dest, messageToSend, { quoted: ms });

    } catch (error) {
        console.error("Error processing view-once message:", error);
        
        await zk.sendMessage(dest, {
            text: '❌ *Error saving view-once message!*\n\n' + error.message,
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
                    body: '❌ Error Occurred\nPlease try again',
                    thumbnailUrl: 'https://files.catbox.moe/aktbgo.jpg',
                    mediaType: 1,
                    renderSmallThumbnail: true
                }
            }
        }, { quoted: ms });
    }
});
