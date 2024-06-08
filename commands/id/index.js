const axios = require('axios');

module.exports = {
    Name: 'id',
    Aliases: ['uid'],
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
              channelName = userstate.senderUsername;
          }            
       
          const idGetter = await axios.get(`https://api.ivr.fi/v2/twitch/user?login=${channelName}`);

          const TwitchID = idGetter.data[0].id;

          return { text: 'FeelsOkayMan 👉 ' + TwitchID, reply: true };
        } catch (error) {
            console.error('Error:', error);
            return { text: 'FeelsBadMan 👎 Es ist leider ein Fehler aufgetreten wenn das weiterhin passiert wende dich an @lellolidk ', reply: true };
        }
    }
};
