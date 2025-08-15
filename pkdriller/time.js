const { zokou } = require('../framework/zokou');
const config = require('../config');

zokou({
    command: 'time',
    category: 'info',
    handler: async (sock, args, message) => {
        const { from } = message;
        const now = new Date();
        const timeText = `*L'heure actuelle est : ${now.toLocaleTimeString()}*`;

        await sock.sendMessage(from, { text: timeText }, { quoted: message });
    }
});
