const axios = require('axios');
const config = require('../../config.json');

module.exports = {
    Name: 'color',
    Aliases: [],
    Enabled: true,

    Access: {
        Global: 0,
        Channel: 0,
    },

    Cooldown: {
        Global: 4,
        Channel: 4,
        User: 4,
    },

    Response: 1,
    execute: async (bot, userstate, utils, args) => {
        try {
            let senderUsername;
            if (args.length > 0) {
                senderUsername = args[0].replace(/[@#,\s]/g, '');
            } else {
                senderUsername = userstate.senderUsername;
            }   
            
            const userInfo = await axios.get(`https://api.ivr.fi/v2/twitch/user?login=${senderUsername}`);
            const userColor = userInfo.data[0].chatColor;

            if (!userColor) {
                return { text: 'FeelsDankMan 👎 Ich konnte die Farbe nicht getten', reply: true };
            }

            changeBotColor(userColor);

            const userColorHex = userColor.replace('#', '');
            
            const colorInfo = await axios.get(`https://www.thecolorapi.com/id?format=json&hex=${userColorHex}`);
            const colorName = colorInfo.data.name.value;

            const message = `${senderUsername}'s color is: █████████ ${userColor} - (${colorName})`;
            bot.me(userstate.channelName, message);

            setTimeout(async () => {
                await changeBotColor('#00ECFF');
            }, 60000);

        } catch (error) {
            console.error('Error:', error);
            return { text: 'FeelsBadMan 👎 Es ist leider ein Fehler aufgetreten wenn das weiterhin passiert wende dich an @lellolidk ', reply: true };
        }
    }
};

async function changeBotColor(color) {
    try {
        await axios.put('https://api.twitch.tv/helix/chat/color', 
            {
                user_id: config.twitch.id,
                color: color
            }, 
            {
                headers: {
                    'Authorization': `Bearer ${config.twitch.helix.token}`,
                    'Client-Id': config.twitch.helix.clientid,
                    'Content-Type': 'application/json'
                }
            }
        );
    } catch (error) {
        console.error('Error:', error);
    }
}
