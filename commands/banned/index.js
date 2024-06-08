const axios = require('axios');
const config = require('../../config.json');

module.exports = {
    Name: 'banned',
    Aliases: ['isbanned'],
    Enabled: true,
  
    Access: {
        Global: 0,
        Channel: 0,
    },
  
    Cooldown: {
        Global: 5,
        Channel: 5,
        User: 5,
    },
  
    Response: 1,
  
    execute: async (bot, userstate, context, args)  => {
        try {
            let channelName;
            if (args.length > 0) {
                channelName = args[0].replace(/[@#,\s]/g, '');
            } else {
                channelName = userstate.senderUsername;
            }            
            const response = await fetch(`https://api.ivr.fi/v2/twitch/user?login=${channelName}`);
            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }
            const data = await response.json();
            if (data.length === 0) {
                return { text: `FeelsBadMan 👉 Der User exisitert nicht`, reply: true };
            }
            const userData = data[0];
            const displayName = userData.displayName || 'Nicht verfügbar';
            const banned = userData.banned || false;
            const banReason = userData.banReason || 'Nicht verfügbar';
            const updatedAt = new Date(userData.updatedAt).toLocaleString();

            if (banned) {
                return { text: `FeelsBadMan 👉  ${displayName} ist gebannt mit dem Grund ${banReason} und wurde am ${updatedAt} gebannt monkaTOS`, reply: true };
            } else {
                return { text: `papaGood 👉  ${displayName} nicht gebannt Saved`, reply: true };
            }
        } catch (error) {
            console.error('Error:', error);
            return { text: 'FeelsBadMan 👎 Es ist leider ein Fehler aufgetreten wenn das weiterhin passiert wende dich an @lellolidk ', reply: true };
        }
    }
};
