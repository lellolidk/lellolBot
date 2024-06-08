const fs = require('fs');
const path = require('path');

module.exports = {
    Name: 'join',
    Aliases: ['addbot'],
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
    execute: async (bot, userstate, utils, msg) => {
        try {
            if (!userstate || !userstate.displayName) {
                console.error('Benutzerinformationen fehlen oder sind ungültig.');
                return { text: 'Ficksex' };
            }

            const userChannel = userstate.displayName.toLowerCase();

            const channelsFilePath = path.resolve(__dirname, '..', '..', 'channels.txt');

            let channels = [];
            try {
                channels = fs.readFileSync(channelsFilePath, 'utf8')
                    .split('\n')
                    .map(channel => channel.trim())
                    .filter(channel => channel !== '');
            } catch (error) {
                console.error('Error:', error);
            }

            if (!channels.includes(userChannel)) {
                channels.push(userChannel);

                fs.writeFileSync(channelsFilePath, channels.join('\n'));

                await bot.join(userChannel);
                return { text: 'FeelsOkayMan 👉 Ich bin erfolgreich deinem Channel beigetreten.', reply: true};
            } else {
                console.log(`Bot ist bereits dem Kanal ${userChannel} beigetreten.`);
                return { text: 'FeelsDankMan 👉 Bot ist bereits deinem Channel beigetreten.', reply: true, me: true};
            }
        } catch (error) {
            console.error('Error:', error);
            return { text: 'FeelsBadMan 👎 Es ist leider ein Fehler aufgetreten wenn das weiterhin passiert wende dich an @lellolidk ', reply: true };        
        }
    }
};
