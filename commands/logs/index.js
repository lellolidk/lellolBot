const axios = require('axios');

module.exports = {
    Name: 'logs',
    Aliases: [],
    Description: 'Hundebilder.',
    Enabled: true,
  
    Access: {
      Global: 0,
      Channel: 0,
    },
  
    Cooldown: {
      Global: 0,
      Channel: 2.5,
      User: 5,
    },
  
    Response: 1,
    
    execute: async (bot, userstate, utils, args) => {
        try {
            let channelName = userstate.channelName;
            let username = userstate.senderUsername;
      
            if (args.length === 2) {
                username = args[1];
            } else if (args.length === 3) {
                channelName = args[1];
                username = args[2];
            }

            return { text: `FeelsOkayMan 👉 https://logs.lellolidk.de/?channel=${channelName}&username=${username}`, reply: true };
        } catch (error) {
            console.error('Error:', error);
            return { text: 'FeelsBadMan 👎 Es ist leider ein Fehler aufgetreten wenn das weiterhin passiert wende dich an @lellolidk ', reply: true };
        }
    }
};
