const fs = require('fs');
const path = require('path');
const channelConfigFilePath = path.join(__dirname, '../../channelConfig.json');

module.exports = {
    Name: 'prefix',
    Enabled: true,

    Access: {
        Global: 2,
        Channel: 2,
    },

    Cooldown: {
        Global: 20,
        Channel: 20,
        User: 20,
    },

    Response: 0,

    execute: (client, userstate, utils, args) => {
        const newPrefix = args[0];
        if (!newPrefix) {
            return { text: 'FeelsDankMan 👉 Du musst ein Prefix angeben', reply: true };
        }

        let channelConfig;
        try {
            channelConfig = JSON.parse(fs.readFileSync(channelConfigFilePath, 'utf8'));
        } catch (error) {
            console.error('Error beim speichern:', error);
            channelConfig = {};
        }

        const channelSettings = channelConfig[userstate.channelName] || {};
        channelSettings.prefix = newPrefix;
        channelConfig[userstate.channelName] = channelSettings;

        try {
            fs.writeFileSync(channelConfigFilePath, JSON.stringify(channelConfig, null, 2));
        } catch (error) {
            console.error('Error:', error);
            return { text: 'FeelsBadMan 👎 Es ist leider ein Fehler aufgetreten wenn das weiterhin passiert wende dich an @lellolidk ', reply: true };
        }

        return { text: `papaNice Der Prefix für diesen Channel ist nun auf: ${newPrefix}`, reply: true };
    }
};
