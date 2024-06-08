const axios = require('axios');

module.exports = {
    Name: 'accage',
    Aliases: ['accountage', 'aa'],
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

            const getInfo = async (channelName) => {
                try {
                    const response = await axios.get(`https://decapi.me/twitch/accountage/${channelName}?precision=5&lang=de`);
                    const accountAge = response.data;

                    if (accountAge.startsWith('User not found')) {
                        return { text: 'FeelsBadMan 👎 User nicht gefunden', reply: true };
                    } else {
                        return { text: `FeelsOkayMan 👉 Der Account ${channelName} ist schon ${accountAge} alt`, reply: true };
                    }
                } catch (error) {
                    return { text: 'FeelsBadMan 👎 Es ist leider ein Fehler aufgetreten wenn das weiterhin passiert wende dich an @lellolidk ', reply: true };
                }
            };

            return await getInfo(channelName);
        } catch (error) {
            console.error('Error:', error);
            return { text: 'FeelsBadMan 👎 Es ist leider ein Fehler aufgetreten wenn das weiterhin passiert wende dich an @lellolidk ', reply: true };
        }
    }
};
