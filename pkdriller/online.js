const { zokou } = require("../framework/zokou");
const { delay } = require("@whiskeysockets/baileys");
const cron = require('node-cron');

// Store online tracking
global.onlineTracker = global.onlineTracker || {};

zokou({
  nomCom: "trackonline",
  aliases: ["track", "onlinetrack"],
  reaction: "📈",
  categorie: "Group"
}, async (origineMessage, zk, commandeOptions) => {
  const { repondre, verifGroupe, superUser, verifAdmin, arg, ms } = commandeOptions;

  try {
    if (!verifGroupe) {
      return repondre("❌ *Groups only!*");
    }

    if (!verifAdmin && !superUser) {
      return repondre("❌ *Admin only!*");
    }

    if (arg.length === 0) {
      return repondre(`📌 *TRACK ONLINE COMMANDS*\n\n` +
        `*.trackonline start* - Start tracking\n` +
        `*.trackonline stop* - Stop tracking\n` +
        `*.trackonline report* - Get report\n\n` +
        `> Powered by Rahmani`);
    }

    const subCommand = arg[0].toLowerCase();
    const groupId = origineMessage;

    if (subCommand === 'start') {
      if (global.onlineTracker[groupId]?.active) {
        return repondre("❌ *Tracking already active!*");
      }

      global.onlineTracker[groupId] = {
        active: true,
        history: [],
        lastCheck: null
      };

      repondre("✅ *Online tracking started!*\n\nI'll check every 30 minutes.\n\n> Powered by Rahmani");

      // Start cron job (every 30 minutes)
      const job = cron.schedule('*/30 * * * *', async () => {
        if (!global.onlineTracker[groupId]?.active) {
          job.stop();
          return;
        }

        try {
          const groupMetadata = await zk.groupMetadata(groupId);
          const participants = groupMetadata.participants;
          const onlineNow = [];
          const botJid = zk.user.id.split(':')[0] + '@s.whatsapp.net';

          for (const participant of participants) {
            if (participant.id === botJid) continue;
            
            try {
              await zk.presenceSubscribe(participant.id);
              await delay(200);
              
              const presence = zk.presences?.[participant.id];
              if (presence?.lastKnownPresence === 'available') {
                onlineNow.push(participant.id);
              }
            } catch (e) {}
          }

          global.onlineTracker[groupId].history.push({
            time: new Date().toLocaleString(),
            count: onlineNow.length,
            members: onlineNow
          });

          // Send report if there are online members
          if (onlineNow.length > 0) {
            await zk.sendMessage(groupId, {
              text: `⏰ *Scheduled Check*\n\n` +
                    `🟢 Online: ${onlineNow.length}\n` +
                    `👥 Members: ${onlineNow.map(j => `@${j.split('@')[0]}`).join(' ')}`,
              mentions: onlineNow
            });
          }

          global.onlineTracker[groupId].lastCheck = new Date();
          
        } catch (error) {
          console.error("Cron error:", error);
        }
      }, {
        timezone: "Africa/Nairobi"
      });

      global.onlineTracker[groupId].cronJob = job;

    } else if (subCommand === 'stop') {
      if (!global.onlineTracker[groupId]?.active) {
        return repondre("❌ *No active tracking!*");
      }

      global.onlineTracker[groupId].active = false;
      if (global.onlineTracker[groupId].cronJob) {
        global.onlineTracker[groupId].cronJob.stop();
      }

      repondre("⏹️ *Tracking stopped!*\n\n> Powered by Rahmani");

    } else if (subCommand === 'report') {
      const tracker = global.onlineTracker[groupId];
      
      if (!tracker || tracker.history.length === 0) {
        return repondre("📊 *No tracking data yet!*\n\n> Powered by Rahmani");
      }

      let report = `╭━━━「 *TRACKING REPORT* 」━━━╮\n`;
      report += `┃\n`;
      report += `┃ 📊 *Total checks:* ${tracker.history.length}\n`;
      report += `┃\n`;
      
      tracker.history.slice(-10).forEach((check, i) => {
        report += `┃ ${i + 1}. ${check.time}\n`;
        report += `┃    🟢 Online: ${check.count}\n`;
      });
      
      report += `┃\n`;
      report += `┃ ⏱️ *Last check:* ${tracker.lastCheck?.toLocaleString() || 'Never'}\n`;
      report += `┃\n`;
      report += `╰━━━━━━━━━━━━━━━━━╯\n\n`;
      report += `> Powered by Rahmani`;

      repondre(report);
    }

  } catch (error) {
    console.error("Track online error:", error);
    repondre("❌ *Error!*\n\n> Powered by Rahmani");
  }
});
