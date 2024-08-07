const axios = require('axios');
const fs = require('fs');
const config = require('../../config.json');

const clientID = config.spotify.clientid;
const clientSecret = config.spotify.clientsecret;
const refreshToken = config.spotify.refreshtoken;
const tokenFile = './spotify_token.json';
const tokenURL = 'https://accounts.spotify.com/api/token';

let accessToken = '';
let lastRefreshTime = null;

async function refreshAccessToken() {
    try {
        const response = await axios.post(tokenURL, {
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            client_id: clientID,
            client_secret: clientSecret
        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        accessToken = response.data.access_token;
        lastRefreshTime = Date.now();
        saveAccessToken();
        //console.log('Neuer AccessToken erhalten:', accessToken);
    } catch (error) {
        //console.error('Error bei refreshAccessToken:', error.response.data);
        throw error;
    }
}

function saveAccessToken() {
    const tokenData = {
        accessToken: accessToken,
        lastRefreshTime: lastRefreshTime
    };
    fs.writeFileSync(tokenFile, JSON.stringify(tokenData));
}

function loadAccessToken() {
    try {
        const tokenData = JSON.parse(fs.readFileSync(tokenFile, 'utf8'));
        accessToken = tokenData.accessToken;
        lastRefreshTime = tokenData.lastRefreshTime;
        //console.log('AccessToken geladen:', accessToken);
    } catch (err) {
        console.error('Error:', err);
    }
}

function isTokenExpired() {
    if (!lastRefreshTime || !accessToken) return true;
    const currentTime = Date.now();
    const elapsedTime = currentTime - lastRefreshTime;
    return elapsedTime >= 3600000;
}

async function resumePlayback() {
    try {
        await axios.put('https://api.spotify.com/v1/me/player/pause?device_id=9dce3b5d2e08a997a31cda125769586bb177a23c', null, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        console.log('Wiedergabe pausiert.');
    } catch (error) {
        console.error('Error:', error);
    }
}

loadAccessToken();
setInterval(refreshAccessToken, 3600000);

module.exports = {
    Name: 'pause',
    Aliases: [],
    Enabled: true,

    Access: {
        Global: 0,
        Channel: 2,
        User: ["lellolidk"]
    },

    Cooldown: {
        Global: 0,
        Channel: 2.5,
        User: 5,
    },

    Response: 1,

    execute: async (bot, userstate, context, args) => {
        try {
            if (userstate.displayName === 'lellolidk') {
                if (isTokenExpired()) {
                    await refreshAccessToken();
                }

                await resumePlayback();
                return { text: 'FeelsOkayMan 👍 Song pausiert.', reply: true };
            } else {
                return { text: 'FeelsBadMan 👎 Nur lellolidk kann das.', reply: true };
            }
        } catch (error) {
            console.error('Ein Fehler ist aufgetreten:', error);
            return { text: 'error.', reply: true };
        }
    },
};
