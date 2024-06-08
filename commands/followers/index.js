const axios = require('axios');

module.exports = {
    Name: 'followers',
    Aliases: ['followcount', 'fc'],
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
          let channelName;
          if (args.length > 0) {
            channelName = args[0].replace(/[@#,\s]/g, '');
          } else {
            channelName = userstate.channelName;
          }            
            const response = await axios.get('https://decapi.me/twitch/followcount/' + channelName);
            const fc = response.data;
            return { text: `FeelsOkayMan 👉 ${channelName} hat ${fc} Followers`, reply: true };
        } catch (error) {
            console.error('Error:', error);
            return { text: 'FeelsBadMan 👎 Es ist leider ein Fehler aufgetreten wenn das weiterhin passiert wende dich an @lellolidk ', reply: true };
        }
    }
};
