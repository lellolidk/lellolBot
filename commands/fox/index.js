const axios = require('axios');

module.exports = {
    Name: 'fox',
    Aliases: ['🦊', ' 🦊', 'fuchs'],
    Description: 'Fuchsbilder.',
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
    
    execute: async (bot, userstate, utils, msg) => {
        try {
            const response = await axios.get('https://randomfox.ca/floof/');
            const imageUrl = response.data.image;
            return { text: `🦊 : ${imageUrl}`, reply: true };
        } catch (error) {
            console.error('Fehler beim Ausführen des Befehls:', error);
            return { text: 'FeelsBadMan 👎 Es ist leider ein Fehler aufgetreten wenn das weiterhin passiert wende dich an @lellolidk ', reply: true };
        }
    }
};
