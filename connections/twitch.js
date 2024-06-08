const fs = require('fs');
const path = require('path');
const { ChatClient, AlternateMessageModifier, SlowModeRateLimiter } = require('@kararty/dank-twitch-irc');

const configFilePath = path.resolve(__dirname, '..', 'config.json');
const config = require(configFilePath);
const { twitch } = config;

const client = new ChatClient({
    username: twitch.username,
    password: twitch.oauth,
    rateLimits: 'default',
    installDefaultMixins: true,
    maxChannelCountPerConnection: 1,
    connectionRateLimits: {
        parallelConnections: 50,
        releaseTime: 1000,
    },
});

function joinChannelsFromFile(filePath) {
    try {
        const channels = fs.readFileSync(filePath, 'utf8')
            .split('\n')
            .map(channel => channel.trim())
            .filter(channel => channel !== '');

        client.joinAll(channels);
    } catch (error) {
        console.error('Error beim joinen:', error);
    }
}

const channelsFilePath = path.resolve(__dirname, '../channels.txt');

joinChannelsFromFile(channelsFilePath);

client.use(new AlternateMessageModifier(client));
client.use(new SlowModeRateLimiter(client, 1));

client.connect(
    client.me('lellolidk', 'hi')
);

module.exports = { client };
