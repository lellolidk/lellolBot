const axios = require('axios');

module.exports = {
    Name: 'dog',
    Aliases: ['🐶', ' 🐶', 'hund'],
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
            const response = await axios.get('https://api.thedogapi.com/v1/images/search');
            const imageUrl = response.data[0].url;
            return { text: `🐶  : ${imageUrl}`, reply: true };
        } catch (error) {
            console.error('Error:', error);
            return { text: 'FeelsBadMan 👎 Es ist leider ein Fehler aufgetreten wenn das weiterhin passiert wende dich an @lellolidk ', reply: true };
        }
    }
};
