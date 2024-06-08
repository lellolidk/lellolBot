const fs = require('fs').promises;
const path = require('path');

const ignoreFilePath = path.join(__dirname, '../../ignore.txt');

const loadIgnoredUsers = async () => {
    try {
        const data = await fs.readFile(ignoreFilePath, 'utf8');
        return new Set(data.split('\n').filter(Boolean));
    } catch (error) {
        if (error.code === 'ENOENT') {
            return new Set();
        }
        throw error;
    }
};

const saveIgnoredUsers = async (ignoredUsers) => {
    const data = Array.from(ignoredUsers).join('\n');
    await fs.writeFile(ignoreFilePath, data, 'utf8');
};

module.exports = {
    Name: 'ignore',
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

    execute: async (bot, userstate, utils, args) => {
        try {
            if (userstate.senderUsername !== 'lellolidk') {
                return { text: 'FeelsBadMan 👎 Nur @lellolidk kann diesen Command benutzen FeelsDankMan', reply: true };
            }

            if (args.length === 0) {
                return { text: 'FeelsDankMan 👎 Gib einen Username an', reply: true };
            }

            const usernameToIgnore = args[0].replace(/[@#,\s]/g, '');
            const ignoredUsers = await loadIgnoredUsers();

            if (ignoredUsers.has(usernameToIgnore)) {
                ignoredUsers.delete(usernameToIgnore);
                await saveIgnoredUsers(ignoredUsers);
                return { text: `FeelsOkayMan 👉 ${usernameToIgnore} wird jetzt nicht mehr ignoriert vom Bot`, reply: true };
            } else {
                ignoredUsers.add(usernameToIgnore);
                await saveIgnoredUsers(ignoredUsers);
                return { text: `FeelsOkayMan 👉 ${usernameToIgnore} wird jetzt ignoriert vom Bot`, reply: true };
            }
        } catch (error) {
            console.error('Error:', error);
            return { text: 'FeelsBadMan 👎 Es ist leider ein Fehler aufgetreten wenn das weiterhin passiert wende dich an @lellolidk ', reply: true };
        }
    },
};
