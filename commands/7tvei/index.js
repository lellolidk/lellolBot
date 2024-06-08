const axios = require('axios');
const config = require('../../config.json');

function convertUnixToReadableDate(unixTimestamp) {
    const date = new Date(unixTimestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${day}.${month}.${year}`;
}

module.exports = {
    Name: '7tvemoteinfo',
    Aliases: ['7tvei', 'stvei', 'stvemoteinfo'],
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
            const emoteName = args[0];
            const senderUserID = userstate.channelID;

            if (!emoteName) {
                return { text: 'FeelsDankMan 👎 Gib ein Emote namen an', reply: true };
            }

            const userInfoResponse = await axios.get(`https://7tv.io/v3/users/twitch/${senderUserID}`);
            const userInfo = userInfoResponse.data;

            if (!userInfo.emote_set || !userInfo.emote_set.emotes) {
                return { text: `FeelsDankMan 👎 Konnte den Emote-set nicht getten`, reply: true };
            }

            const emoteSet = userInfo.emote_set.emotes;

            const emote = emoteSet.find(e => e.name.toLowerCase() === emoteName.toLowerCase());

            if (!emote) {
                return { text: `FeelsDankMan 👎 Der Emote ${emoteName} wurde nicht gefunden in deinem Emote set`, reply: true };
            }

            const emoteID = emote.id;

            const emoteInfoResponse = await axios.get(`https://7tv.io/v3/emotes/${emoteID}`);
            const emoteInfo = emoteInfoResponse.data;
            const createdDate = emoteInfo.versions[0].createdAt;
            const emoteOwner = emoteInfo.owner.display_name;
            const readableDate = convertUnixToReadableDate(createdDate);

            return {
                text: `FeelsOkayMan 👉 Der Emote ${emoteName} wurde am ${readableDate} erstellt von ${emoteOwner} ● https://cdn.7tv.app/emote/${emoteID}/4x.webp ● https://7tv.app/emotes/${emoteID}`,
                reply: true,
            };

        } catch (error) {
            console.error('Error:', error);
            return { text: 'FeelsBadMan 👎 Es ist leider ein Fehler aufgetreten wenn das weiterhin passiert wende dich an @lellolidk ', reply: true };
        }
    }
};
