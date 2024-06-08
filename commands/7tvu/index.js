const axios = require('axios');

module.exports = {
    Name: '7tvu',
    Aliases: ['stvu', '7tvuid', 'stvuid'],
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
         
            const idGetter = await axios.get(`https://api.ivr.fi/v2/twitch/user?login=${channelName}`);

            const TwitchID = idGetter.data[0].id;
            
            const stvInfo = await axios.get(`https://7tv.io/v3/users/twitch/${TwitchID}`);
            
            const stvID = stvInfo.data.user.id;

            if (channelName) {
                return { text: `FeelsOkayMan 👉 ${stvID} ● https://7tv.app/users/${stvID}`, reply: true };
            } else {
                return { text: `FeelsBadMan 👎 Error`, reply: true };
            }
        } catch (error) {
            console.error('Error:', error);
            return { text: 'FeelsBadMan 👎 Es ist leider ein Fehler aufgetreten wenn das weiterhin passiert wende dich an @lellolidk ', reply: true };
        }
    }
};
