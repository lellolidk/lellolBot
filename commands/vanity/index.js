const axios = require('axios');

module.exports = {
    Name: 'vanity',
    Aliases: [],
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
            let channelName = userstate.senderUsername;
            let targetUser = null;
            let targetChannel = null;

            if (args.length >= 1) {
                targetUser = args[0].replace(/[@#,\s]/g, '');
                if (args.length >= 2) {
                    targetChannel = args[1].replace(/[@#,\s]/g, '');
                }
            }

            if (targetUser && !targetChannel) {
                return { text: `FeelsOkayMan 👉 https://vanity.zonian.dev/?u=${targetUser}`, reply: true };
            }

            if (targetUser && targetChannel) {
                return { text: `FeelsOkayMan 👉 https://vanity.zonian.dev/?u=${targetUser}&c=${targetChannel}`, reply: true };
            }

            return { text: `FeelsOkayMan 👉 https://vanity.zonian.dev/?u=${channelName}`, reply: true };
        } catch (error) {
            console.error('Error:', error);
            return { text: 'FeelsBadMan 👎 Es ist leider ein Fehler aufgetreten wenn das weiterhin passiert wende dich an @lellolidk ', reply: true };
        }
    }
};
