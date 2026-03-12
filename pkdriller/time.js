const { Meta } = require('../lib/');
const config = require('../config');

Meta({
    command: 'time',
    category: 'info',
    handler: async (sock, args, message) => {
        const { from } = message;
        const now = new Date();
        const timeText = `*L'heure actuelle est : ${now.toLocaleTimeString()}*`;

        await sock.sendMessage(from, { text: timeText }, { quoted: message });
    }
});
