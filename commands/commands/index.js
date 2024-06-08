const axios = require('axios');
const config = require('../../config.json');

module.exports = {
    Name: 'commands',
    Aliases: ['help'],
    Description: 'Sendet die Befehlsliste per Whisper an einen Benutzer.',
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
  
    execute: async (bot, userstate, context, msg)  => {
        try {
            const userToSend = userstate.senderUserID;
            
            const CommandsWhisper = async (userToSend) => {
                try {
                    const whisperMessage = "Hier die Commands:  https://lellolidk.de/lellolbot/commands/ ";
                    
                    await axios.post(`https://api.twitch.tv/helix/whispers?from_user_id=636823070&to_user_id=${userToSend}`, 
                    { message: whisperMessage }, 
                    {
                        headers: {
                            'Authorization': `Bearer ${config.twitch.helix.token}`,
                            'Client-ID': config.twitch.helix.clientid,
                            'Content-Type': 'application/json',
                        }
                    });
        
                    return { text: 'FeelsOkayMan 👍 Commands per Whisper gesendet', reply: true };
                } catch (error) {
                    console.error('Error:', error);
                    return { text: 'FeelsBadMan 👎 Es ist leider ein Fehler aufgetreten wenn das weiterhin passiert wende dich an @lellolidk ', reply: true };
                }
            };
            
            return await CommandsWhisper(userToSend);
        } catch (error) {
            console.error('Error:', error);
            return { text: 'FeelsBadMan 👎 Es ist leider ein Fehler aufgetreten wenn das weiterhin passiert wende dich an @lellolidk ', reply: true };        
        }
    },
};
