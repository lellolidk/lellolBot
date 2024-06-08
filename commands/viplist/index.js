const axios = require('axios');
const config = require('../../config.json');

function formatGrantedAtDate(grantedAt) {
    const date = new Date(grantedAt);
    return date.toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' });
}

async function uploadToHastebin(data) {
    try {
        const response = await axios.post('https://paste.lellolidk.de/documents', data);
        if (response.data && response.data.key) {
            return `https://paste.lellolidk.de/${response.data.key}`;
        } else {
            throw new Error('Invalid response from Hastebin');
        }
    } catch (error) {
        console.error('Error pasting Hastebin: ', error);
        return null;
    }
}

module.exports = {
    Name: 'viplist',
    Aliases: ['vl'],
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
            
            if (!senderUsername) {
                return { text: 'FeelsDankMan 👎 Konnte den User nicht finden', reply: true };
            }

            const response = await axios.get(`https://api.modscanner.com/twitch/user/${senderUsername}`);
            const userInfo = response.data;

            if (response.data.message === 'User not found') {
                return { text: `FeelsBadMan 👎 Der User ist gebannt oder existiert nicht`, reply: true };
            }

            const modList = userInfo.viping;

            if (modList.length === 0) {
                return { text: `FeelsDankMan 👎 Der User ist bei keinem VIP`, reply: true };
            }

            const modListText = modList.map(mod => {
                const formattedDate = formatGrantedAtDate(mod.grantedAt);
                return `${mod.displayName} (${mod.login}) - VIP seit: ${formattedDate}`;
            }).join('\n');

            const hastebinUrl = await uploadToHastebin(modListText);

            if (!hastebinUrl) {
                return { text: 'FeelsBadMan 👎 Es ist leider ein Fehler aufgetreten wenn das weiterhin passiert wende dich an @lellolidk ', reply: true };
            }

            return {
                text: `👮 Der User ist bei den Channels VIP - ${hastebinUrl}`,
                reply: true,
            };

        } catch (error) {
            console.error('Error beim getting vom user:', error);
            if (error.response && error.response.data && error.response.data.message === 'User not found') {
                return { text: `FeelsBadMan 👎 Der User ist gebannt.`, reply: true };
            }
            return { text: 'FeelsBadMan 👎 Es ist leider ein Fehler aufgetreten wenn das weiterhin passiert wende dich an @lellolidk ', reply: true };
        }
    }
};
