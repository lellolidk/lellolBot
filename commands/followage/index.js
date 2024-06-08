const axios = require('axios');

module.exports = {
    Name: 'followage',
    Aliases: ['fa'],
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
          let senderUsername;
          if (args.length > 0) {
            senderUsername = args[0].replace(/[@#,\s]/g, '');
          } else {
            senderUsername = userstate.senderUsername;
          }          
            const response = await axios.get('https://decapi.me/twitch/followage/' + channelName + '/' + senderUsername + '?token=NtwzErb5qBtDKXwuSihBsZ4osGZejoajAywOErCQ&lang=de');
            const fc = response.data;
            return { text: `FeelsOkayMan 👉 ${senderUsername} folgt seit ${fc}`, reply: true };
        } catch (error) {
            console.error('Error:', error);
            return { text: 'FeelsBadMan 👎 Es ist leider ein Fehler aufgetreten wenn das weiterhin passiert wende dich an @lellolidk ', reply: true };
        }
    }
};
