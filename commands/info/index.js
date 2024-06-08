const axios = require('axios');
const config = require('../../config.json');

module.exports = {
    Name: 'info',
    Aliases: ['?'],
    Enabled: true,
  
    Access: {
        Global: 0,
        Channel: 0,
    },
  
    Cooldown: {
        Global: 5,
        Channel: 5,
        User: 5,
    },
  
    Response: 1,
  
    execute: async (bot, userstate, context, args)  => {
        try {
            let channelName;
            if (args.length > 0) {
                channelName = args[0].replace(/[@#,\s]/g, '');
            } else {
                channelName = userstate.senderUsername;
            }            
            const getInfo = async (channelName) => {
                try {
                    const response = await axios.get(`https://api.ivr.fi/v2/twitch/user?login=${channelName}`);

                    const userData = response.data[0];
                    if (!userData) {
                        return { text: 'FeelsBadMan 👎 User nicht gefunden', reply: true };
                    }

                    const {
                        displayName,
                        id,
                        bio,
                        roles,
                        badges,
                        createdAt,
                        chatColor
                    } = userData;

                    const createdAtDate = new Date(createdAt);
                    const formattedDate = `${createdAtDate.getDate()}.${createdAtDate.getMonth() + 1}.${createdAtDate.getFullYear()}`;

                    const affiliateOrPartner = roles.isPartner ? 'Partner' : (roles.isAffiliate ? 'Affiliate' : 'Kein Affiliate/Partner');
                    const badgeTitle = badges.length > 0 ? badges[0].title : 'Kein Badge';

                    const message = `FeelsOkayMan 👉 Der User '${displayName}' mit der UserID ${id} ist ${affiliateOrPartner} ● Die Bio des Users lautet: "${bio}" ● Account wurde am ${formattedDate} erstellt ● Badge: ${badgeTitle} ● Farbe: ${chatColor} `;

                    return { text: message, reply: true };
                } catch (error) {
                    console.error('Error:', error);
                    return { text: 'FeelsBadMan 👎 Es ist leider ein Fehler aufgetreten wenn das weiterhin passiert wende dich an @lellolidk ', reply: true };
                }
            };

            return await getInfo(channelName);
        } catch (error) {
            console.error('Error:', error);
            return { text: 'FeelsBadMan 👎 Es ist leider ein Fehler aufgetreten wenn das weiterhin passiert wende dich an @lellolidk ', reply: true };
        }
    }
};
