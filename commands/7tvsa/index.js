const axios = require('axios');
const config = require('../../config.json');

module.exports = {
    Name: '7tvsubage',
    Aliases: ['7tvsa', 'stvsubage', 'stvsa'],
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

    execute: async (bot, userstate, context, args) => {
        let twitchUserId;
        let twitchUserName;

        if (args.length > 0) {
            twitchUserName = args[0].replace(/[@#,\s]/g, '');
            twitchUserId = await getTwitchUserIdByUsername(twitchUserName);
        } else {
            twitchUserId = userstate.senderUserID;
            twitchUserName = userstate.senderUsername;
        }

        if (!twitchUserId) {
            return { text: `FeelsBadMan 👉 Ich konnte leider die ID vom User nicht holen`, reply: true };
        }

        const userId = await getUserIdFromTwitchId(twitchUserId);
        if (!userId) {
            return { text: `FeelsDankMan 👉 ${twitchUserName} hat derzeit kein 7TV Sub`, reply: true };
        }

        try {
            const { subscriptionData, customerId } = await getSubscriptionData(userId);
            if (!subscriptionData || !subscriptionData.age) {
                return { text: `FeelsOkayMan 👉 Du hast derzeit kein Sub bei 7TV FeelsDankMan`, reply: true };
            }

            const formattedAge = formatDaysToMonthsAndDays(subscriptionData.age);
            const endDate = new Date(subscriptionData.end_at);
            const formattedEndDate = formatDate(endDate);

            let subscriptionMessage = `FeelsOkayMan 👉 ${twitchUserName} ist 7TV Sub seit ${formattedAge} ● Endet am ${formattedEndDate}`;

            if (customerId && customerId !== subscriptionData.subscription.subscriber_id) {
                const customerUsername = await getUsernameFromCustomerId(customerId);
                if (customerUsername) {
                    subscriptionMessage += ` ● Gekauft von ${customerUsername}`;
                }
            }

            return { text: subscriptionMessage, reply: true };
        } catch (error) {
            console.error('Error:', error);
            return { text: 'FeelsBadMan 👎 Es ist leider ein Fehler aufgetreten wenn das weiterhin passiert wende dich an @lellolidk ', reply: true };
        }
    }
};

async function getTwitchUserIdByUsername(username) {
    try {
        const response = await axios.get(`https://api.twitch.tv/helix/users?login=${username}`, {
            headers: {
                'Client-ID': config.twitch.clientid,
                'Authorization': 'Bearer ' + config.twitch.bearertoken
            }
        });
        return response.data.data[0]?.id || null;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

async function getUserIdFromTwitchId(twitchUserId) {
    try {
        const response = await axios.get(`https://7tv.io/v3/users/twitch/${twitchUserId}`);
        return response.data.user.id;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

async function getSubscriptionData(userId) {
    try {
        const response = await axios.get(`https://egvault.7tv.io/v1/subscriptions/${userId}`);
        const subscriptionData = response.data;
        const customerId = subscriptionData?.subscription?.customer_id || null;
        return { subscriptionData, customerId };
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

async function getUsernameFromCustomerId(customerId) {
    try {
        const response = await axios.get(`https://7tv.io/v3/users/${customerId}`);
        return response.data.display_name;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

function formatDaysToMonthsAndDays(days) {
    if (days === 1) {
        return '1 Tag';
    } else {
        const months = Math.floor(days / 30);
        const remainingDays = days % 30;
        if (months === 0) {
            return `${remainingDays} Tage`;
        } else if (remainingDays === 0) {
            return `${months} Monate`;
        } else {
            return `${months} Monate und ${remainingDays} Tage`;
        }
    }
}

function formatDate(date) {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return date.toLocaleDateString('de-DE', options);
}
