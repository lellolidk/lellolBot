const fetch = require('node-fetch');

module.exports = {
    Name: 'ffzsub',
    Aliases: [],
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

    execute: async (client, userstate, context, args) => {
        const username = args.length > 0 ? args[0].replace(/[@#,\s]/g, '') : userstate.senderUsername;
        const response = await sendFFZUserInfo(username);
        return response;
    }
}

async function fetchFFZUserInfo(username) {
    try {
        const response = await fetch(`https://api.frankerfacez.com/v1/_user/${username}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch FFZ user data for ${username}. Status: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

async function sendFFZUserInfo(username) {
    const userData = await fetchFFZUserInfo(username);
    if (userData !== null) {
        const isSubwoofer = userData.user?.is_subwoofer || false;
        const isDonor = userData.user?.is_donor || false;
        let message;
        if (isSubwoofer || isDonor) {
            message = `FeelsOkayMan 👉 ${username} ist/war Sub bei FFZ`;
        } else {
            message = `WeirdChamp 👉 ${username} ist kein Sub bei FFZ`;
        }
        return { text: message, reply: true };
    } else {
        return { text: 'FeelsDankMan 👎 Den User gibt es nicht ', reply: true };
    }
}
