const { zokou } = require("../framework/zokou");
const conf = require("../set");

// ═══════════════════════════════════════════════
//   ⚡ RAHMANI-XMD : FUN & UTILITIES
// ═══════════════════════════════════════════════

// 1. TRUTH (Truth or Dare)
zokou({
    nomCom: "truth",
    categorie: "Fun",
    reaction: "🤔",
    desc: "Get a random truth question",
    fromMe: false
}, async (dest, client, cmd) => {
    const truths = [
        "What is your biggest fear?",
        "What is the last lie you told?",
        "Who is your secret crush?",
        "What is your most embarrassing moment?",
        "Have you ever cheated on a test?",
        "What is the worst gift you have ever received?",
        "What is your biggest regret?",
        "What is the most childish thing you still do?"
    ];
    const random = truths[Math.floor(Math.random() * truths.length)];
    await cmd.repondre(`🤔 *TRUTH*\n\n${random}`);
});

// 2. DARE (Truth or Dare)
zokou({
    nomCom: "dare",
    categorie: "Fun",
    reaction: "🔥",
    desc: "Get a random dare challenge",
    fromMe: false
}, async (dest, client, cmd) => {
    const dares = [
        "Send a selfie right now!",
        "Text your ex 'I miss you' and screenshot the reply.",
        "Change your WhatsApp profile picture to a funny meme for 1 hour.",
        "Call a random contact and sing them a song.",
        "Speak in a foreign accent for the next 10 minutes.",
        "Post a silly status on your WhatsApp.",
        "Send the 10th picture in your gallery to the group.",
        "Do 20 push-ups right now."
    ];
    const random = dares[Math.floor(Math.random() * dares.length)];
    await cmd.repondre(`🔥 *DARE*\n\n${random}`);
});

// 3. JOKE (Random Jokes)
zokou({
    nomCom: "joke",
    categorie: "Fun",
    reaction: "😂",
    desc: "Get a random joke",
    fromMe: false
}, async (dest, client, cmd) => {
    const jokes = [
        "Why don't scientists trust atoms? Because they make up everything!",
        "I told my wife she was drawing her eyebrows too high. She looked surprised.",
        "Why did the scarecrow win an award? Because he was outstanding in his field!",
        "I'm reading a book on anti-gravity. It's impossible to put down!",
        "What do you call a fake noodle? An impasta!",
        "Why don't skeletons fight each other? They don't have the guts.",
        "What's the best thing about Switzerland? I don't know, but the flag is a big plus."
    ];
    const random = jokes[Math.floor(Math.random() * jokes.length)];
    await cmd.repondre(`😂 *JOKE*\n\n${random}`);
});

// 4. FLIRT (Compliments)
zokou({
    nomCom: "flirt",
    categorie: "Fun",
    reaction: "😘",
    desc: "Get a flirtatious compliment",
    fromMe: false
}, async (dest, client, cmd) => {
    const { msgRepondu, auteurMsgRepondu, repondre } = cmd;
    
    let target = "you";
    let mentions = [];
    if (msgRepondu && auteurMsgRepondu) {
        target = `@${auteurMsgRepondu.split('@')[0]}`;
        mentions.push(auteurMsgRepondu);
    }

    const flirts = [
        "Are you a magician? Because whenever I look at you, everyone else disappears.",
        "Do you have a map? I keep getting lost in your eyes.",
        "Are you a parking ticket? Because you've got 'FINE' written all over you.",
        "If you were a vegetable, you'd be a cute-cumber.",
        "Are you a time traveler? Because I see you in my future.",
        "Is your name Google? Because you have everything I've been searching for."
    ];
    const random = flirts[Math.floor(Math.random() * flirts.length)];
    await client.sendMessage(dest, { text: `😘 *FLIRT*\n\n${target}, ${random}`, mentions }, { quoted: cmd.ms });
});

// 5. SHIP (Shipping two users)
zokou({
    nomCom: "ship",
    categorie: "Fun",
    reaction: "❤️",
    desc: "Ship two users together",
    fromMe: false
}, async (dest, client, cmd) => {
    const { msgRepondu, auteurMsgRepondu, auteurMessage, repondre } = cmd;
    
    if (!msgRepondu || !auteurMsgRepondu) {
        return repondre("❌ *Reply to someone's message to ship them with you!*");
    }

    const user1 = auteurMessage.split('@')[0];
    const user2 = auteurMsgRepondu.split('@')[0];
    const percentage = Math.floor(Math.random() * 101);

    let emoji = "💔";
    if (percentage > 20) emoji = "😐";
    if (percentage > 40) emoji = "😊";
    if (percentage > 60) emoji = "❤️";
    if (percentage > 80) emoji = "💖";
    if (percentage > 95) emoji = "💍";

    let text = `❤️ *SHIP CALCULATOR*\n\n`;
    text += `@${user1} + @${user2}\n\n`;
    text += `Result: *${percentage}%*\n`;
    text += `${emoji}`;

    await client.sendMessage(dest, { text, mentions: [auteurMessage, auteurMsgRepondu] }, { quoted: cmd.ms });
});

// 6. CHARACTER (Analyze user character)
zokou({
    nomCom: "character",
    categorie: "Fun",
    reaction: "🔍",
    desc: "Analyze someone's character",
    fromMe: false
}, async (dest, client, cmd) => {
    const { msgRepondu, auteurMsgRepondu, auteurMessage, repondre } = cmd;

    let target = auteurMessage;
    if (msgRepondu && auteurMsgRepondu) target = auteurMsgRepondu;

    const traits = ["Brave", "Funny", "Kind", "Smart", "Loyal", "Mysterious", "Energetic", "Calm", "Creative", "Honest"];
    const trait1 = traits[Math.floor(Math.random() * traits.length)];
    let trait2 = traits[Math.floor(Math.random() * traits.length)];
    while (trait1 === trait2) trait2 = traits[Math.floor(Math.random() * traits.length)];

    const text = `🔍 *CHARACTER ANALYSIS*\n\n@${target.split('@')[0]}\n\n✨ Traits: *${trait1}* & *${trait2}*`;
    await client.sendMessage(dest, { text, mentions: [target] }, { quoted: cmd.ms });
});

// 7. ROAST (Roast someone)
zokou({
    nomCom: "roast",
    categorie: "Fun",
    reaction: "🔥",
    desc: "Roast someone",
    fromMe: false
}, async (dest, client, cmd) => {
    const { msgRepondu, auteurMsgRepondu, repondre } = cmd;
    
    if (!msgRepondu || !auteurMsgRepondu) {
        return repondre("❌ *Reply to someone to roast them!*");
    }

    const roasts = [
        "You're not stupid; you just have bad luck when thinking.",
        "I'd agree with you but then we'd both be wrong.",
        "You're the reason the gene pool needs a lifeguard.",
        "Somewhere out there is a tree tirelessly producing oxygen for you. You owe it an apology.",
        "You bring everyone so much joy... when you leave the room.",
        "I'm jealous of all the people that haven't met you yet."
    ];
    const random = roasts[Math.floor(Math.random() * roasts.length)];
    await client.sendMessage(dest, { text: `🔥 *ROAST*\n\n@${auteurMsgRepondu.split('@')[0]}, ${random}`, mentions: [auteurMsgRepondu] }, { quoted: cmd.ms });
});

// 8. 8BALL (Magic 8-Ball)
zokou({
    nomCom: "8ball",
    categorie: "Fun",
    reaction: "🎱",
    desc: "Ask the magic 8-ball a question",
    fromMe: false
}, async (dest, client, cmd) => {
    const { arg, repondre } = cmd;
    
    if (!arg[0]) return repondre("❌ *Ask a question!* Example: .8ball Will I be rich?");

    const responses = [
        "It is certain.", "Without a doubt.", "Yes, definitely.", "You may rely on it.",
        "As I see it, yes.", "Most likely.", "Outlook good.", "Yes.",
        "Reply hazy, try again.", "Ask again later.", "Better not tell you now.",
        "Cannot predict now.", "Concentrate and ask again.", "Don't count on it.",
        "My reply is no.", "My sources say no.", "Outlook not so good.", "Very doubtful."
    ];
    const random = responses[Math.floor(Math.random() * responses.length)];
    
    await repondre(`🎱 *MAGIC 8-BALL*\n\nQ: ${arg.join(" ")}\nA: *${random}*`);
});

// 9. PICK (Pick a random option)
zokou({
    nomCom: "pick",
    categorie: "Fun",
    reaction: "🎯",
    desc: "Pick a random option (e.g., .pick pizza burger)",
    fromMe: false
}, async (dest, client, cmd) => {
    const { arg, repondre } = cmd;
    
    if (!arg || arg.length < 2) return repondre("❌ *Provide at least two options!*\nExample: .pick pizza burger pasta");

    // Tenganisha kwa comma au nafasi
    const options = arg.join(" ").split(/[,\s]+/).filter(o => o.trim() !== "");
    const random = options[Math.floor(Math.random() * options.length)];
    
    await repondre(`🎯 *PICK*\n\nI choose: *${random}*`);
});
