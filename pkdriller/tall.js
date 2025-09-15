const { zokou } = require('../framework/zokou');
const traduire = require("../framework/traduction") ;
const { default: axios } = require('axios');
const fs = require('fs');
const pkg = require('@whiskeysockets/baileys');
const { generateWAMessageFromContent, proto } = pkg;

zokou({ nomCom: "gpt", reaction: "🤠", categorie: "ai" }, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;

  try {
    if (!arg || arg.length === 0) {
      return repondre('> ® Rahmani.\n\n What help can I offer you today?');
    }

    // Combine arguments into a single string
    const prompt = arg.join(' ');
    const response = await fetch(`https://api.gurusensei.workers.dev/llama?prompt=${prompt}`);
    const data = await response.json();

    if (data && data.response && data.response.response) {
      const answer = data.response.response;

      // Check if the answer contains code
      const codeMatch = answer.match(/```([\s\S]*?)```/);

      const msg = generateWAMessageFromContent(dest, {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2
            },
            interactiveMessage: proto.Message.InteractiveMessage.create({
              body: proto.Message.InteractiveMessage.Body.create({
                text: answer
              }),
              footer: proto.Message.InteractiveMessage.Footer.create({
                text: "> *® Rahmani*"
              }),
              header: proto.Message.InteractiveMessage.Header.create({
                title: "",
                subtitle: "",
                hasMediaAttachment: false
              }),
              nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                buttons: [] // No buttons
              })
            })
          }
        }
      }, {});

      await zk.relayMessage(dest, msg.message, {
        messageId: msg.key.id
      });
    } else {
      throw new Error('Invalid response from the API.');
    }
  } catch (error) {
    console.error('Error getting response:', error.message);
    repondre('Error getting response.');
  }
});
