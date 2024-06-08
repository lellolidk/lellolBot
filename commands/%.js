module.exports = {
    Name: '%',
    Aliases: [],
    Description: 'Generates a random percentage.',
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
    execute: async (sb, userstate, utils, msg) => {
        try {
            const randomNumber = Math.random() * 100;
            const percentage = Math.floor(randomNumber);
            return { text: `${percentage}%`, reply: true };
        } catch (error) {
            console.error('Error:', error);
            return { text: 'FeelsBadMan 👎 Es ist leider ein Fehler aufgetreten wenn das weiterhin passiert wende dich an @lellolidk ', reply: true };
        }
    }
};
