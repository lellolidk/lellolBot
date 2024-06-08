const axios = require('axios');

module.exports = {
    Name: 'vips',
    Aliases: [],
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
            const response = await axios.get(`https://api.ivr.fi/v2/twitch/modvip/${userstate.channelName}`);
            const vips = response.data.vips;

            if (vips.length > 0) {
                const pasteContent = vips.map((vip, index) => {
                    const grantedAt = new Date(vip.grantedAt);
                    const now = new Date();
                    const diffTime = Math.abs(now - grantedAt);
                    const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30));
                    const diffDays = Math.floor((diffTime % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
                    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const channelLink = `https://twitch.tv/${vip.login}`;
                    return `${index + 1} • Channel: ${vip.login} • VIP geworden vor: ${diffMonths} Monaten ${diffDays} Tagen und ${diffHours} Stunden • Link: ${channelLink}`;
                }).join('\n');
                
                const pasteKey = await postModList(pasteContent);
                const pasteLink = `https://paste.lellolidk.de/${pasteKey}`;
                return { text: `FeelsOkayMan 👉 ${pasteLink}`, reply: true };
            } else {
                return { text: 'FeelsBadMan 👎 Der Channel hat keine VIPs ', reply: true };
            }
        } catch (error) {
            console.error('Fehler beim Abrufen der VIP-Liste:', error);
            let errorMessage = 'Es ist ein Fehler aufgetreten beim Abrufen der VIP-Liste.';
            if (error.response && error.response.status === 404) {
                errorMessage = 'Der Channel hat keine VIPs. 3Head';
            }
            return { text: 'FeelsBadMan 👎 Es ist leider ein Fehler aufgetreten wenn das weiterhin passiert wende dich an @lellolidk ', reply: true };
        }
    }
};

async function postModList(viplist) {
    try {
        const response = await axios.post('https://paste.lellolidk.de/documents', viplist);
        return response.data.key;
    } catch (error) {
        console.error('Error beim pasten:', error);
        throw error;
    }
}
