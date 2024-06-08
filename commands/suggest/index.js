const axios = require('axios');

module.exports = {
    Name: 'suggest',
    Aliases: [],
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
    execute: async (client, userstate, utils, args) => {
        const suggestion = args.join(' ');
        const username = userstate.senderUsername;
    
        if (!suggestion) {
            return { text: 'FeelsDankMan Du musst auch eine Nachricht angeben', reply: true };        
        }

        client.say('lellolidk', 'dink lellolidk dink neue suggestion von ' + username + ' | Nachricht: ' + suggestion)
        const webhookURL = 'Discord Webhook hier rein';
        
        await axios.post(webhookURL, {
            content: `Neue Suggestion von ${username} | Nachricht: ${suggestion}`
        });
        return { text: 'FeelsOkayMan 👍 Danke für deine Suggestion', reply: true };    
            
    }
};
 