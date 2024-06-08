module.exports = {
    Name: 'meppl',
    Aliases: ['mepplgotdrip', 'mebbl'],
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
            return {
                text: `@MEPPLGOTDRIP #SupporterNummer1`,
                reply: true,
            };
        } catch (error) {
            console.error('Fehler beim Ausführen des Befehls:', error);
            return { text: 'FeelsBadMan 👎 Es ist leider ein Fehler aufgetreten wenn das weiterhin passiert wende dich an @lellolidk ', reply: true };
        }
    }
};
 