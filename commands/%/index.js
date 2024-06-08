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
            const randomNumber = Math.random() * 100; // Generate a random number between 0 and 100
            const percentage = Math.floor(randomNumber); // Round down the number to remove the decimal part
            return { text: `${percentage}%`, reply: true };
        } catch (error) {
            console.error('Error executing command:', error);
            return { text: 'FeelsBadMan 👎 An error occurred. Please try again later or contact @lellolidk if this issue persists.', reply: true };
        }
    }
};
