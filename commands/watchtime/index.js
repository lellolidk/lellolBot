const axios = require('axios');

module.exports = {
    Name: 'watchtime',
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
            let channelName;
            if (args.length > 0) {
                channelName = args[0].replace(/[@#,\s]/g, '');
            } else {
                channelName = userstate.channelName;
            }   
            
            const channelResponse = await axios.get(`https://api.streamelements.com/kappa/v2/channels/${channelName}`);
            
            const SEId = channelResponse.data._id;
            
            const watchtimeResponse = await axios.get(`https://api.streamelements.com/kappa/v2/points/${SEId}/watchtime?limit=200000&offset=0`);
            
            const users = watchtimeResponse.data.users;
            
            let targetUser;
            if (args.length > 0) {
                targetUser = args[0].replace(/[@#,\s]/g, '');
                targetUser = users.find(user => user.username.toLowerCase() === channelName.toLowerCase());
            } else {
                targetUser = users.find(user => userstate.senderUsername === user.username);
            }
            
            if (targetUser) {
                const watchtimeInMinutes = targetUser.minutes;
                const weeks = Math.floor(watchtimeInMinutes / (7 * 24 * 60));
                const days = Math.floor((watchtimeInMinutes % (7 * 24 * 60)) / (24 * 60));
                const hours = Math.floor((watchtimeInMinutes % (24 * 60)) / 60);
                const minutes = watchtimeInMinutes % 60;
                
                let timeString = '';
                if (weeks > 0) timeString += `${weeks} Woche${weeks > 1 ? 'n' : ''} `;
                if (days > 0) timeString += `${days} Tag${days > 1 ? 'e' : ''} `;
                if (hours > 0) timeString += `${hours} Stunde${hours > 1 ? 'n' : ''} `;
                if (minutes > 0) timeString += `${minutes} Minute${minutes > 1 ? 'n' : ''}`;

                return { text: `FeelsOkayMan 👉 ${targetUser.username} hat insgesamt ${timeString} Watchtime.`, reply: true };
            } else {
                return { text: `FeelsBadMan 👎 Den User ${channelName} nicht gefunden.`, reply: true };
            }
        } catch (error) {
            console.error('Error:', error);
            return { text: 'FeelsBadMan 👎 Es ist leider ein Fehler aufgetreten wenn das weiterhin passiert wende dich an @lellolidk ', reply: true };
        }
    }
};
