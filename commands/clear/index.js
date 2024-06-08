const axios = require('axios');
const config = require('../../config.json');

module.exports = {
    Name: 'clear',
    Aliases: [],
    Enabled: true,
  
    Access: {
        Global: 0,
        Channel: 2,
    },
  
    Cooldown: {
        Global: 5,
        Channel: 5,
        User: 5,
    },
  
    Response: 1,
  
    execute: async (bot, userstate, context, msg)  => {
        try {
            if (!userstate.isModRaw) {
                return { text: 'FeelsBadMan 👎 Du bist kein Mod', reply: true };
            } 

            const broadcasterID = userstate.channelID 
            
            const ClearChat = async (broadcasterID) => {
                try {
                    await axios.delete(`https://api.twitch.tv/helix/moderation/chat?broadcaster_id=${broadcasterID}&moderator_id=636823070`, {
                        headers: {
                            'Client-ID': config.twitch.helix.clientid,
                            'Authorization': `Bearer ${config.twitch.helix.token}`,
                        }
                    });
        
                    return { text: 'FeelsOkayMan 👍 Chat gelöscht', reply: true };
                } catch (error) {
                    console.error('Error:', error);
                    return { text: 'FeelsBadMan 👎 Es ist leider ein Fehler aufgetreten wenn das weiterhin passiert wende dich an @lellolidk ', reply: true };
                }
            };

            const repetitions = 400;

            const promises = [];
            for (let i = 0; i < repetitions; i++) {
                promises.push(ClearChat(broadcasterID));
            }

            await Promise.all(promises);

            return null;
        } catch (error) {
            console.error('Error:', error);
            return { text: 'FeelsBadMan 👎 Es ist leider ein Fehler aufgetreten wenn das weiterhin passiert wende dich an @lellolidk ', reply: true };
        }
    },
};
