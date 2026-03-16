const { zokou } = require("../framework/zokou");
const { delay } = require("@whiskeysockets/baileys");

zokou({
  nomCom: "add",
  aliases: ["addmember", "addparticipant", "invite"],
  reaction: "➕",
  categorie: "Group"
}, async (origineMessage, zk, commandeOptions) => {
  const { repondre, arg, verifGroupe, superUser, verifAdmin, ms } = commandeOptions;

  try {
    // Check if it's a group
    if (!verifGroupe) {
      return repondre("❌ *This command only works in groups!*");
    }

    // Check if user is admin or superuser
    if (!verifAdmin && !superUser) {
      return repondre("❌ *You need to be admin to use this command!*");
    }

    // Check if numbers provided
    if (arg.length === 0) {
      return repondre(`📌 *HOW TO ADD 30 MEMBERS*\n\n` +
        `*Usage:*\n` +
        `.add 2547XXXXXX,2547XXXXXX,2547XXXXXX\n\n` +
        `*Example:*\n` +
        `.add 254712345678,254798765432,254711223344\n\n` +
        `*Maximum:* 30 numbers at once\n\n` +
        `> Powered by Rahmani`);
    }

    // Parse numbers (support comma separated)
    let numbers = [];
    if (arg.join(' ').includes(',')) {
      numbers = arg.join(' ').split(',').map(n => n.trim());
    } else {
      numbers = arg;
    }

    // Clean numbers (remove non-numeric) and limit to 30
    numbers = numbers
      .map(n => n.replace(/[^0-9]/g, ''))
      .filter(n => n.length >= 10 && n.length <= 15)
      .slice(0, 30);

    if (numbers.length === 0) {
      return repondre("❌ *No valid numbers found!*\n\n> Powered by Rahmani");
    }

    // Send initial message
    await repondre(`⏳ *Adding ${numbers.length} participant(s)...*\n\n_Please wait, this may take a few moments_\n\n> Powered by Rahmani`);

    // Get group metadata
    const groupMetadata = await zk.groupMetadata(origineMessage);
    const groupName = groupMetadata.subject;
    
    // Results tracking
    let success = [];
    let failed = [];
    let alreadyInGroup = [];

    // Add participants one by one with delay
    for (let i = 0; i < numbers.length; i++) {
      const number = numbers[i];
      const jid = number + '@s.whatsapp.net';

      try {
        // Check if already in group
        const isAlreadyInGroup = groupMetadata.participants.some(p => p.id === jid);
        
        if (isAlreadyInGroup) {
          alreadyInGroup.push(number);
          continue;
        }

        // Try to add participant
        await zk.groupParticipantsUpdate(origineMessage, [jid], "add");
        success.push(number);
        
        // Update progress every 5 adds
        if ((i + 1) % 5 === 0 || i === numbers.length - 1) {
          await repondre(`📊 *Progress: ${i + 1}/${numbers.length}*\n` +
            `✅ Added: ${success.length}\n` +
            `❌ Failed: ${failed.length}\n` +
            `👥 Already in: ${alreadyInGroup.length}\n\n` +
            `> Powered by Rahmani`);
        }

        // Delay to avoid rate limiting
        await delay(2000);

      } catch (error) {
        console.log(`Failed to add ${number}:`, error.message);
        
        if (error.message?.includes('rate-overlimit')) {
          await repondre('⏳ *Rate limit detected, waiting 10 seconds...*\n\n> Powered by Rahmani');
          await delay(10000);
        } else if (error.message?.includes('not-authorized')) {
          failed.push(`${number} (bot not authorized)`);
        } else if (error.message?.includes('group-full')) {
          failed.push(`${number} (group full)`);
        } else if (error.message?.includes('privacy')) {
          failed.push(`${number} (privacy settings)`);
        } else {
          failed.push(number);
        }
      }
    }

    // Final report
    let report = `╭━━━「 *ADD RESULTS* 」━━━╮\n`;
    report += `┃\n`;
    report += `┃ 👥 *Group:* ${groupName}\n`;
    report += `┃ 📊 *Requested:* ${numbers.length}\n`;
    report += `┃\n`;
    report += `┃ ✅ *Added:* ${success.length}\n`;
    
    if (success.length > 0) {
      report += `┃    ${success.slice(0, 5).map(n => `@${n}`).join(', ')}${success.length > 5 ? ` +${success.length - 5} more` : ''}\n`;
    }
    
    report += `┃\n`;
    report += `┃ 👥 *Already in:* ${alreadyInGroup.length}\n`;
    
    if (alreadyInGroup.length > 0) {
      report += `┃    ${alreadyInGroup.slice(0, 5).map(n => `@${n}`).join(', ')}${alreadyInGroup.length > 5 ? ` +${alreadyInGroup.length - 5} more` : ''}\n`;
    }
    
    report += `┃\n`;
    report += `┃ ❌ *Failed:* ${failed.length}\n`;
    
    if (failed.length > 0) {
      report += `┃    ${failed.slice(0, 5).join(', ')}${failed.length > 5 ? ` +${failed.length - 5} more` : ''}\n`;
    }
    
    report += `┃\n`;
    report += `╰━━━━━━━━━━━━━━━━━╯\n\n`;
    report += `_Use .invitelink for those who failed._\n`;
    report += `> Powered by Rahmani`;

    // Create mentions array
    const mentions = success.slice(0, 10).map(n => n + '@s.whatsapp.net');

    await zk.sendMessage(origineMessage, {
      text: report,
      mentions: mentions
    }, { quoted: ms });

  } catch (error) {
    console.error("Add command error:", error);
    repondre("❌ *Error adding participants!*\n\n> Powered by Rahmani");
  }
});
