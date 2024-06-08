module.exports = {
    Name: 'echo',
    Aliases: ['say', 'eco'],
    Enabled: true,
  
    Access: {
      Global: 0,
      Channel: 2,
    },
  
    Cooldown: {
      Global: 0,
      Channel: 2.5,
      User: 5,
    },
  
    Response: 1,
    execute: async (bot, userstate, utils, msg) => {
        try {
            if (userstate.displayName === 'lellolidk') {
                const message = msg.join(' ');
                return { text: message, reply: false }; 
            }
        } catch (error) {
            console.error('Error:', error);
            return { text: 'FeelsBadMan 👎 Es ist leider ein Fehler aufgetreten wenn das weiterhin passiert wende dich an @lellolidk ', reply: true };
        }
    }
};
 