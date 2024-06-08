const fetch = require('node-fetch');

module.exports = {
    Name: 'clip',
    Aliases: [],
    Enabled: true,

    Access: {
        Global: 0,
        Channel: 0,
    },

    Cooldown: {
        Global: 10,
        Channel: 10,
        User: 30,
    },

    Response: 1,

    execute: async (client, userstate, context, args) => {
        const username = userstate.senderUsername
        const channel = userstate.channelName;
        const clipURL = `https://api.thefyrewire.com/twitch/clips/create/f484ecd95425cd7cfcc0ef2c2f7a89b8?channel=${channel}`;

        try {
            const response = await fetch(clipURL, { method: 'POST' });

            if (response.ok) {
                const data = await response.text();
                return { text: `🎬 ${data}`, reply: true };
            } else {
                throw new Error('FeelsDankMan 👉 Der Streamer ist vermutlich Offline');
            }
        } catch (error) {
            console.error('Error:', error);
            return { text: 'FeelsBadMan 👎 Es ist leider ein Fehler aufgetreten wenn das weiterhin passiert wende dich an @lellolidk ', reply: true };
        }
    }
};
