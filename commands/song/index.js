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
        console.error('Error:', error.response.data);
        throw error;
    }
}

function saveAccessToken() {
    const tokenData = {
        accessToken: accessToken,
        lastRefreshTime: lastRefreshTime
    };
    fs.writeFileSync(tokenFile, JSON.stringify(tokenData));
    console.log('spotifytoken gespeichert.');
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

async function getCurrentPlayback() {
    try {
        const response = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (response.status === 200 && response.data) {
            return response.data;
        } else {
            console.log('Der User hört gerade nichts');
            return null;
        }
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

async function getPlayer() {
    try {
        const response = await axios.get('https://api.spotify.com/v1/me/player?market=DE', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (response.status === 200 && response.data) {
            return response.data;
        } else {
            console.log('Der User hört gerade nichts');
            return null;
        }
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

loadAccessToken();
setInterval(refreshAccessToken, 3600000);

module.exports = {
    Name: 'song',
    Aliases: [],
    Enabled: true,

    Access: {
        Global: 0,
        Channel: 2,
    },

    Cooldown: {
        Global: 0,
        Channel: 2.5,
        User: 5,
    },

    Response: 1,

    execute: async (bot, userstate, context, args) => {
        try {
            if (isTokenExpired()) {
                await refreshAccessToken();
            }

            const trackInfo = await getCurrentPlayback();
            const playerInfo = await getPlayer();

            if (trackInfo) {
                const trackName = trackInfo.item.name;
                const artistName = trackInfo.item.artists[0].name;
                const trackLink = trackInfo.item.external_urls.spotify;
                const volume = playerInfo.device.volume_percent;
                const progressMs = trackInfo.progress_ms;
                const durationMs = trackInfo.item.duration_ms;
                const progressMinutes = Math.floor(progressMs / 60000);
                const progressSeconds = ((progressMs % 60000) / 1000).toFixed(0).padStart(2, '0');
                const durationMinutes = Math.floor(durationMs / 60000);
                const durationSeconds = ((durationMs % 60000) / 1000).toFixed(0).padStart(2, '0');
                return { text: `FeelsOkayMan 👉 Gerade läuft "${trackName}" von ${artistName} ● Lautstärke: ${volume}% 🔈● [${progressMinutes}:${progressSeconds}/${durationMinutes}:${durationSeconds}] | ${trackLink}`, reply: true };
            } else {
                return { text: 'FeelsBadMan 👎 Gerade läuft nichts.', reply: true };
            }
        } catch (error) {
            console.error('Error:', error);
            return { text: 'FeelsBadMan 👎 Es ist leider ein Fehler aufgetreten wenn das weiterhin passiert wende dich an @lellolidk ', reply: true };
        }
    },
};
