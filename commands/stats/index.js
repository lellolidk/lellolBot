const axios = require('axios');

module.exports = {
    Name: 'stats',
    Aliases: [],
    Enabled: true,
  
    Access: {
        Global: 0,
        Channel: 2,
    },
  
    Cooldown: {
        Global: 5,
        Channel: 5,
        User: 5,
    },
  
    Response: 1,
  
    execute: async (bot, userstate, context, args)  => {
        try {
            const subCommand = args[0];
            if (subCommand === '7tv') {
                return await execute7TVStats(bot, userstate, context, args.slice(1));
            } else if (subCommand === 'bttv') {
                return await executeBTTVStats(bot, userstate, context, args.slice(1));
            } else if (subCommand === 'ffz') {
                return await executeFFZStats(bot, userstate, context, args.slice(1));
            } else if (subCommand === 'chatters') {
                return await executeChattersStats(bot, userstate, context, args.slice(1));
            } else if (subCommand === 'twitch') {
                return await executeTwitchStats(bot, userstate, context, args.slice(1));
            } else if (subCommand === 'commands') {
                return await executeCommandsStats(bot, userstate, context, args.slice(1));
            } else {
                return { text: 'FeelsOkayMan 👉 Versuchs mal so: -stats (7tv, bttv, ffz, chatters, twitch, commands) ', reply: true };
            }
        } catch (error) {
            console.error('Error:', error);
            return { text: 'FeelsBadMan 👎 Es ist leider ein Fehler aufgetreten wenn das weiterhin passiert wende dich an @lellolidk ', reply: true };        
        }
    },
};

async function execute7TVStats(bot, userstate, context, args) {
    try {
        const response = await axios.get('https://api.streamelements.com/kappa/v2/chatstats/global/stats');
        const sevenTVEmotes = response.data.sevenTVEmotes;
        
        const sortedEmotes = sevenTVEmotes.sort((a, b) => b.amount - a.amount);
        
        let topMessage = "FeelsOkayMan 👉 Top 10 7TV: ";
        
        const topEmotes = sortedEmotes.slice(0, 10).map((emote, index) => ` ${index + 1}. ${emote.emote.split('').join('󠀀')} - ${emote.amount}`).join(" ● ");
        
        if (topMessage.length > 500) {
            const splitMessages = topMessage.match(/.{1,400}/g);
            for (const splitMessage of splitMessages) {
                await bot.say(splitMessage);
            }
        } else {
            return { text: 'FeelsOkayMan 👉' + topEmotes, reply: true };
        }
    } catch (error) {
        console.error('Error:', error);
        return { text: 'FeelsBadMan 👎 Es ist leider ein Fehler aufgetreten wenn das weiterhin passiert wende dich an @lellolidk ', reply: true };        
    }
}

async function executeBTTVStats(bot, userstate, context, args) {
    try {
        const response = await axios.get('https://api.streamelements.com/kappa/v2/chatstats/global/stats');
        const bttvEmotes = response.data.bttvEmotes;
        
        const sortedEmotes = bttvEmotes.sort((a, b) => b.amount - a.amount);
        
        let topMessage = "FeelsOkayMan 👉 Top 10 BTTV: ";
        
        const topEmotes = sortedEmotes.slice(0, 10).map((emote, index) => ` ${index + 1}. ${emote.emote.split('').join('󠀀')} - ${emote.amount}`).join(" ● ");
        
        if (topMessage.length > 500) {
            const splitMessages = topMessage.match(/.{1,400}/g);
            for (const splitMessage of splitMessages) {
                await bot.say(splitMessage);
            }
        } else {
            return { text: 'FeelsOkayMan 👉' + topEmotes, reply: true };
        }
    } catch (error) {
        console.error('Error:', error);
        return { text: 'FeelsBadMan 👎 Es ist leider ein Fehler aufgetreten wenn das weiterhin passiert wende dich an @lellolidk ', reply: true };        
    }
}

async function executeFFZStats(bot, userstate, context, args) {
    try {
        const response = await axios.get('https://api.streamelements.com/kappa/v2/chatstats/global/stats');
        const ffzEmotes = response.data.ffzEmotes;
        
        const sortedEmotes = ffzEmotes.sort((a, b) => b.amount - a.amount);
        
        let topMessage = "FeelsOkayMan 👉 Top 10 BTTV: ";
        
        const topEmotes = sortedEmotes.slice(0, 10).map((emote, index) => ` ${index + 1}. ${emote.emote.split('').join('󠀀')} - ${emote.amount}`).join(" ● ");
        
        if (topMessage.length > 500) {
            const splitMessages = topMessage.match(/.{1,400}/g);
            for (const splitMessage of splitMessages) {
                await bot.say(splitMessage);
            }
        } else {
            return { text: 'FeelsOkayMan 👉' + topEmotes, reply: true };
        }
    } catch (error) {
        console.error('Error:', error);
        return { text: 'FeelsBadMan 👎 Es ist leider ein Fehler aufgetreten wenn das weiterhin passiert wende dich an @lellolidk ', reply: true };        
    }
}

async function executeChattersStats(bot, userstate, context, args) {
    try {
        const response = await axios.get('https://api.streamelements.com/kappa/v2/chatstats/global/stats');
        const chatters = response.data.chatters;
        
        const sortedEmotes = chatters.sort((a, b) => b.amount - a.amount);
        
        let topMessage = "FeelsOkayMan 👉 Top 10 BTTV: ";
        
        const topEmotes = sortedEmotes.slice(0, 10).map((emote, index) => ` ${index + 1}. ${emote.name.split('').join('󠀀')} - ${emote.amount}`).join(" ● ");
        
        if (topMessage.length > 500) {
            const splitMessages = topMessage.match(/.{1,400}/g);
            for (const splitMessage of splitMessages) {
                await bot.say(splitMessage);
            }
        } else {
            return { text: 'FeelsOkayMan 👉' + topEmotes, reply: true };
        }
    } catch (error) {
        console.error('Error:', error);
        return { text: 'FeelsBadMan 👎 Es ist leider ein Fehler aufgetreten wenn das weiterhin passiert wende dich an @lellolidk ', reply: true };        
    }
}

async function executeTwitchStats(bot, userstate, context, args) {
    try {
        const response = await axios.get('https://api.streamelements.com/kappa/v2/chatstats/global/stats');
        const twitchEmotes = response.data.twitchEmotes;
        
        const sortedEmotes = twitchEmotes.sort((a, b) => b.amount - a.amount);
        
        let topMessage = "FeelsOkayMan 👉 Top 10 BTTV: ";
        
        const topEmotes = sortedEmotes.slice(0, 10).map((emote, index) => ` ${index + 1}. ${emote.emote.split('').join('󠀀')} - ${emote.amount}`).join(" ● ");
        
        if (topMessage.length > 500) {
            const splitMessages = topMessage.match(/.{1,400}/g);
            for (const splitMessage of splitMessages) {
                await bot.say(splitMessage);
            }
        } else {
            return { text: 'FeelsOkayMan 👉' + topEmotes, reply: true };
        }
    } catch (error) {
        console.error('Error:', error);
        return { text: 'FeelsBadMan 👎 Es ist leider ein Fehler aufgetreten wenn das weiterhin passiert wende dich an @lellolidk ', reply: true };        
    }
}

async function executeCommandsStats(bot, userstate, context, args) {
    try {
        const response = await axios.get('https://api.streamelements.com/kappa/v2/chatstats/global/stats');
        const commands = response.data.commands;
        
        const sortedEmotes = commands.sort((a, b) => b.amount - a.amount);
        
        let topMessage = "FeelsOkayMan 👉 Top 10 BTTV: ";
        
        const topEmotes = sortedEmotes.slice(0, 9).map((emote, index) => ` ${index + 1}. ${emote.command.split('').join('󠀀')} - ${emote.amount}`).join(" ● ");
        
        if (topEmotes.length > 500) {
            return { text: 'FeelsOkayMan 👉' + topEmotes, reply: true };
        } else {
            return { text: 'FeelsOkayMan 👉' + topEmotes, reply: true };
        }
    } catch (error) {
        console.error('Error:', error);
        return { text: 'FeelsBadMan 👎 Es ist leider ein Fehler aufgetreten wenn das weiterhin passiert wende dich an @lellolidk ', reply: true };        
    }
}

