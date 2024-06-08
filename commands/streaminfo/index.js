const axios = require('axios');
const config = require('../../config.json');

module.exports = {
    Name: 'streaminfo',
    Aliases: ['si'],
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
            const getInfo = async (channelName) => {
                try {
                    const response = await axios.get(`https://api.twitch.tv/helix/streams?user_login=${channelName}`, {
                        headers: {
                            'Client-ID': config.twitch.helix.clientid,
                            'Authorization': `Bearer ${config.twitch.helix.token}`,
                        }
                    });

                    const streamData = response.data.data[0];
                    if (!streamData) {
                        return { text: 'FeelsBadMan 👎 Der Channel ist offline SadChamp', reply: true };
                    }

                    const {
                        user_name,
                        game_name,
                        title,
                        viewer_count,
                        started_at
                    } = streamData;

                    const startDate = new Date(started_at);
                    const formattedDate = `${startDate.getDate()}.${startDate.getMonth() + 1}.${startDate.getFullYear()}`;

                    const message = `FeelsOkayMan 👉 Der Channel ${user_name} ist gerade live HeCrazy ● Es wird gerade ${game_name} gegamed mit ${viewer_count} Viewern ● Der Title ist: "${title}" ● Angefangen zu Streamen am ${formattedDate} um ${startDate.toLocaleTimeString()} Uhr`;

                    return { text: message, reply: true };
                } catch (error) {
                    console.error('Fehler beim Abrufen der Stream-Informationen:', error);
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
