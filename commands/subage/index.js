const axios = require('axios');
const config = require('../../config.json');

module.exports = {
    Name: 'sa',
    Aliases: ['subage'],
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
            let senderName = userstate.senderUsername;
            let channelName = userstate.channelName;
            let channelID = userstate.channelID;

            if (args.length > 0 && args[0]) {
                senderName = args[0].replace(/[@#,\s]/g, '');
            }

            if (args.length > 1 && args[1]) {
                channelName = args[1].replace(/[@#,\s]/g, '');
                const channelInfoResponse = await axios.get(`https://api.twitch.tv/helix/users?login=${channelName}`, {
                    headers: {
                        'Client-ID': config.twitch.helix.clientid,
                        'Authorization': 'Bearer ' + config.twitch.helix.token
                    }
                });
                channelID = channelInfoResponse.data.data[0].id;
            }

            const channelInfoResponse = await axios.get(`https://api.twitch.tv/helix/users?id=${channelID}`, {
                headers: {
                    'Client-ID': config.twitch.helix.clientid,
                    'Authorization': 'Bearer ' + config.twitch.helix.token
                }
            });

            const channelInfo = channelInfoResponse.data.data[0];
            console.log("Channel Info:", channelInfo);
            if (channelInfo && (channelInfo.broadcaster_type !== 'affiliate' && channelInfo.broadcaster_type !== 'partner')) {
                return { text: `FeelsBadMan 👎 Der Channel ${channelName.split('').join('󠀀')} ist kein Affiliate oder Partner`, reply: true };
            }

            const response = await axios.get(`https://api.ivr.fi/v2/twitch/subage/${senderName}/${channelName}`);
            const subInfo = response.data;

            let subMonthsText = '';
            if (subInfo.cumulative && subInfo.cumulative.months > 0) {
                subMonthsText = `${subInfo.cumulative.months} Monate lang sub`;
            }

            if (subInfo.meta && subInfo.meta.type === 'paid') {
                const daysRemaining = subInfo.streak.daysRemaining;
                const subEnd = new Date(subInfo.streak.end);
                const now = new Date();

                const subEndInMs = subEnd - now;
                const subEndInDays = Math.ceil(subEndInMs / (1000 * 60 * 60 * 24));
                const subEndInMonths = Math.floor(subEndInDays / 30);
                const subEndInHours = Math.floor((subEndInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

                let subEndText = '';
                if (subEndInMonths > 0) {
                    subEndText = `${subEndInMonths} Monaten, ${daysRemaining} Tagen und ${subEndInHours} Stunden`;
                } else {
                    subEndText = `${daysRemaining} Tagen und ${subEndInHours} Stunden`;
                }

                const message = `FeelsOkayMan 👉 ${senderName.split('').join('󠀀')} ist sub bei ${channelName.split('').join('󠀀')} mit einem Tier ${subInfo.meta.tier} Sub ● ${subMonthsText} ● [Sub endet/verlängert sich in ${subEndText}]`;
                return { text: message, reply: true };
            } else if (subInfo.meta && subInfo.meta.type === 'gift') {
                const gifter = subInfo.meta.giftMeta?.gifter?.displayName || 'Unknown';
                const gifter2 = subInfo.meta.giftMeta?.gifter?.login || 'Unknown';
                const daysRemaining = subInfo.streak.daysRemaining;
                const subEnd = new Date(subInfo.streak.end);
                const now = new Date();

                const subEndInMs = subEnd - now;
                const subEndInDays = Math.ceil(subEndInMs / (1000 * 60 * 60 * 24));
                const subEndInMonths = Math.floor(subEndInDays / 30);
                const subEndInHours = Math.floor((subEndInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

                let subEndText = '';
                if (subEndInMonths > 0) {
                    subEndText = `${subEndInMonths} Monaten, ${daysRemaining} Tagen und ${subEndInHours} Stunden`;
                } else {
                    subEndText = `${daysRemaining} Tagen und ${subEndInHours} Stunden`;
                }

                const message = `FeelsOkayMan 👉 ${senderName.split('').join('󠀀󠀀')} ist sub bei ${channelName.split('').join('󠀀')} mit einem Tier ${subInfo.meta.tier} Sub ● ${subMonthsText} ● gegiftet von ${gifter.split('').join('󠀀')} (${gifter2.split('').join('󠀀')}) ● [Sub endet/verlängert sich  in ${subEndText}]`;
                return { text: message, reply: true };
            } else {
                return { text: `FeelsBadMan 👎 ${senderName.split('').join('󠀀')} hat kein Aktiven Sub bei ${channelName.split('').join('󠀀')} `, reply: true };
            }
        } catch (error) {
            console.error('Error:', error);
            return { text: 'FeelsBadMan 👎 Es ist leider ein Fehler aufgetreten wenn das weiterhin passiert wende dich an @lellolidk ', reply: true };
        }
    }
};
