const os = require('os');
const fs = require('fs');
const path = require('path');

function formatUptime(uptimeSeconds) {
    const days = Math.floor(uptimeSeconds / (3600 * 24));
    const hours = Math.floor((uptimeSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const seconds = Math.floor(uptimeSeconds % 60);

    let uptimeString = '';
    if (days > 0) uptimeString += `${days} ${days === 1 ? 'Tag' : 'Tage'} und `;
    if (hours > 0 || days > 0) uptimeString += `${hours} ${hours === 1 ? 'Stunde' : 'Stunden'} und `;
    if (minutes > 0 || hours > 0 || days > 0) uptimeString += `${minutes} ${minutes === 1 ? 'Minute' : 'Minuten'} und `;
    uptimeString += `${seconds} ${seconds === 1 ? 'Sekunde' : 'Sekunden'}`;

    return uptimeString.trim();
}

function countFolders(directory) {
    try {
        const folders = fs.readdirSync(directory);
        return folders.filter(folder => fs.statSync(path.join(directory, folder)).isDirectory()).length;
    } catch (error) {
        console.error(`Error counting folders in ${directory}: ${error}`);
        return 0;
    }
}

module.exports = {
    Name: 'ping',
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
    execute: async (bot, userstate, utils, msg) => {
        try {
            if (!bot.ping) {
                throw new Error('Ping method not available');
            }

            const { performance } = require("perf_hooks");
            const t1 = performance.now();
            await bot.ping();
            const t2 = performance.now();
            const latency =  (t2 - t1).toFixed(0);
            const botUptime = formatUptime(process.uptime());
            const channelsFilePath = path.resolve(__dirname, '..', '..', 'channels.txt');
            const channelsCount = fs.readFileSync(channelsFilePath, 'utf8').split('\n').filter(Boolean).length;
            const commandCount = countFolders(path.join(__dirname, '..'));
            const memoryUsageMB = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
            const totalMemoryGB = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
            const freeMemoryGB = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
            const usedMemoryGB = (totalMemoryGB - freeMemoryGB).toFixed(2);
            const version = "0.69B";
            return {
                text: `🏓 PONG! 🕑 [ ${botUptime} ] ● 🔗 [${channelsCount}] Channels ● [${commandCount}] Commands ● ${usedMemoryGB} GB / ${totalMemoryGB} GB RAM ● Version 💽 [ ${version} ] ● ${latency} ms`,
                reply: true,
            };

        } catch (err) {
            console.log(err);
            return { text: 'FeelsBadMan 👎 Es ist leider ein Fehler aufgetreten wenn das weiterhin passiert wende dich an @lellolidk ', reply: true };        
        }
    }
};
