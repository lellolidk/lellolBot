const { spawn } = require('child_process');

function restartBot() {
    console.log('Neustart des Bots...');
    const botProcess = spawn(process.argv[0], process.argv.slice(1), {
        detached: true,
        stdio: 'inherit'
    });
    botProcess.unref();
    process.exit();
}

module.exports = {
    Name: 'restart',
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

    execute: async (client, userstate, utils, msg) => {
        try {
            if (userstate.senderUsername === 'lellolidk') {
                setTimeout(() => {
                    restartBot();
                }, 1000);

                return { text: 'FeelsOkayMan 👉 Bot wird nun neugestartet', reply: true };
            } else {
                return { text: 'FeelsDankMan 👉 Nur lellolidk kann das.', reply: true };
            }        
        } catch (err) {
            console.log(err);
            return { text: 'FeelsBadMan 👎 Es ist leider ein Fehler aufgetreten, wenn das weiterhin passiert, wende dich an @lellolidk.', reply: true };
        }
    }
};
