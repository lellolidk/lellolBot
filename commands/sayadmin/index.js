module.exports = {
    Name: 'sayadmin',
    Aliases: [],
    Enabled: true,
  
    Access: {
      Global: 0,
      Channel: 0,
    },
  
    Cooldown: {
      Global: 0,
      Channel: 0,
      User: 0,
    },
  
    Response: 1,
    execute: async (bot, userstate, utils, msg) => {
        if (userstate.senderUsername !== 'lellolidk') {
            return { text: 'Nur lellol darf das', reply: true };
        }
        
        if (msg.length < 2) {
            return { text: 'kurde', reply: true };
        }
        
        const targetChannel = msg[0]; 
        const message = msg.slice(1).join(' ');
        
        try {
            bot.say(targetChannel, message);
            return { text: `Nachricht erfolgreich im Kanal ${targetChannel} gesendet.`, reply: true };
        } catch (error) {
            console.error('Error:', error);
            return { text: 'FeelsBadMan 👎 Es ist leider ein Fehler aufgetreten wenn das weiterhin passiert wende dich an @lellolidk ', reply: true };
        }
    }
};
