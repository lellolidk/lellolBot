const axios = require('axios');
const config = require('../../config.json');

function formatDate(unixTimestamp) {
    const date = new Date(unixTimestamp);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('de-DE', options);
}

module.exports = {
    Name: '7tvage',
    Aliases: [],
    Description: 'Get the creation date of a user from 7TV.',
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
    execute: async (bot, userstate, utils, args) => {
        try {
            let senderUsername;
            if (args.length > 0) {
                senderUsername = args[0].replace(/[@#,\s]/g, '');
            } else {
                senderUsername = userstate.senderUsername;
            }
            const userID = await axios.get(`https://api.ivr.fi/v2/twitch/user?login=${senderUsername}`)
            const senderUserID = userID.data[0].id

            const userInfo = await axios.get(`https://7tv.io/v3/users/twitch/${senderUserID}`);
            const createdAt = userInfo.data.user.created_at;

            if (!createdAt) {
                return { text: 'FeelsDankMan 👎 Konnte dein Erstellungs Datum nicht getten', reply: true };
            }

            const formattedDate = formatDate(createdAt);

            return {
                text: `FeelsOkayMan 👉 Der User ist am ${formattedDate} 7tv gejoint`,
                reply: true,
            };

        } catch (error) {
            console.error('Error:', error);
            return { text: 'FeelsBadMan 👎 Es ist leider ein Fehler aufgetreten wenn das weiterhin passiert wende dich an @lellolidk ', reply: true };
        }
    }
};
