const axios = require('axios');

module.exports = {
    Name: 'chatters',
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
            const getChattersInfo = async (channelName) => {
                try {
                    const response = await Promise.race([
                        axios.get(`https://api.markzynk.com/twitch/chatters/${channelName}`),
                        new Promise(resolve => setTimeout(() => resolve({ data: { chatters: { viewers: [] } } }), 5000)) // Timeout after 5 seconds
                    ]);
                    const chatters = response.data.chatters;
                    
                    const modsCount = chatters.moderators.length;
                    const vipsCount = chatters.vips.length;
                    const usersCount = chatters.viewers.length;
                    const allCount = modsCount + vipsCount + usersCount;

                    const isBroadcaster = chatters.broadcasters.includes(channelName);
                    const broadcasterIcon = isBroadcaster ? '✅' : '❌';

                    const message = `FeelsOkayMan 👉 Es sind gerade ${allCount} User im Chat ● Broadcaster ${broadcasterIcon} ● ${modsCount} Moderatoren ● ${vipsCount} VIPs ● ${usersCount} Viewer`;
                    
                    return { text: message, reply: true };
                } catch (error) {
                    console.error('Error:', error);
                    const userCountResponse = await axios.get(`https://api.markzynk.com/twitch/chatters/${channelName}/count`);
                    const userCount = userCountResponse.data.count;

                    const message = `FeelsOkayMan 👉 Die genauen Users kann ich nicht erkennen aber es sind ${userCount} User im Chat`;
                    return { text: message, reply: true };
                }
            };

            return await getChattersInfo(channelName);
        } catch (error) {
            console.error('Error:', error);
            return { text: 'FeelsBadMan 👎 Es ist leider ein Fehler aufgetreten wenn das weiterhin passiert wende dich an @lellolidk ', reply: true };        
        }
    },
};