const { zokou } = require("../framework/zokou");
const fancy = require("../rahmani/style");

zokou({
    nomCom: "fancy",
    categorie: "Fun",
    reaction: "〽️",
    desc: "Generate fancy text styles",
    fromMe: false
}, async (dest, client, cmd) => {
    const { arg, repondre, prefixe } = cmd;

    // 1. Check if ID and text are provided
    if (!arg || arg.length < 2) {
        return repondre(`❌ *Usage:* ${prefixe || "."}fancy <style_id> <text>\n\n*Example:* ${prefixe || "."}fancy 10 RAHMANI XMD\n\n_Use_.fancy 0 _to see all available styles._`);
    }

    const id = arg[0].match(/\d+/)?.[0];
    const text = arg.slice(1).join(" ");

    // 2. Show list of styles if ID is 0
    if (id === "0") {
        return repondre(fancy.list('*RAHMANI-XMD*', fancy));
    }

    // 3. Apply the chosen style
    try {
        const selectedStyle = fancy[parseInt(id) - 1];
        
        if (selectedStyle) {
            return repondre(fancy.apply(selectedStyle, text));
        } else {
            return repondre('❌ *Style not found. Use .fancy 0 to see available styles.*');
        }
    } catch (error) {
        console.error("Fancy Error:", error);
        return repondre('❌ *An error occurred while generating the text.*');
    }
});
