const { join } = require('path');
const path = require('path');
const fs = require('fs');
const { client } = require('./connections/twitch');
const utils = require('./utils/utils');
const config = require('./config.json');
const channelConfigFilePath = path.join(__dirname, 'channelConfig.json');

const {
  setCooldown,
  deleteCooldown,
  hasCooldown,
} = require('./utils/cooldown');

const commands = new Map();
const aliases = new Map();

const ignoreFilePath = path.join(__dirname, 'ignore.txt');

const loadIgnoredUsers = () => {
  if (fs.existsSync(ignoreFilePath)) {
    const data = fs.readFileSync(ignoreFilePath, 'utf8');
    return new Set(data.split('\n').filter(Boolean));
  }
  return new Set();
};

let ignoredUsers = loadIgnoredUsers();

function loadCommands() {
  const commandFolders = fs.readdirSync(join(__dirname, 'commands'), {
    withFileTypes: true,
  });

  for (const folder of commandFolders) {
    if (!folder.isDirectory()) continue;

    const folderPath = join(__dirname, 'commands', folder.name, 'index.js');

    try {
      const stats = fs.lstatSync(folderPath);
      if (!stats.isFile()) continue;
    } catch (error) {
      console.error(`Error loading command file: ${folderPath}`, error);
      continue;
    }

    const command = require(folderPath);

    if (command.Name) {
      commands.set(command.Name, command);
    }

    if (command.Aliases && Array.isArray(command.Aliases)) {
      command.Aliases.forEach((alias) => aliases.set(alias, command.Name));
    }
  }
}

function isAuthorized(userstate, command) {
  const globalAccess = command.Access.Global;
  const channelAccess = command.Access.Channel;

  const isOwner = config.twitch.bot.owners.includes(userstate.senderUserID);
  const isAdmin =
    config.twitch.bot.admins.includes(userstate.senderUserID) || isOwner;

  if (globalAccess === 1 && !isAdmin) return false;
  if (globalAccess === 2 && !isOwner) return false;

  if (
    channelAccess === 1 &&
    !(
      userstate.badges.some((badge) =>
        ['vip', 'moderator', 'broadcaster'].includes(badge.name)
      ) ||
      isOwner ||
      isAdmin
    )
  ) {
    return false;
  }

  if (
    channelAccess === 2 &&
    !(
      userstate.badges.some((badge) =>
        ['moderator', 'broadcaster'].includes(badge.name)
      ) ||
      isOwner ||
      isAdmin
    )
  ) {
    return false;
  }

  if (
    channelAccess === 3 &&
    !(
      userstate.badges.some((badge) => badge.name === 'broadcaster') ||
      isOwner ||
      isAdmin
    )
  ) {
    return false;
  }

  return true;
}

async function handleCommand(userstate, cmd, msg) {
  const command = commands.get(cmd) || commands.get(aliases.get(cmd));

  if (
    !command ||
    !command.Enabled ||
    !isAuthorized(userstate, command) ||
    hasCooldown(`${command.Name}`) ||
    hasCooldown(`${command.Name}-${userstate.channelID}`) ||
    hasCooldown(`${command.Name}-${userstate.senderUserID}`)
  ) {
    return;
  }

  if (!config.twitch.bot.admins.includes(userstate.senderUserID)) {
    setCooldown(`${command.Name}`, Date.now() + command.Cooldown.Global * 1000);
    setCooldown(
      `${command.Name}-${userstate.channelID}`,
      Date.now() + command.Cooldown.Channel * 1000
    );
    setCooldown(
      `${command.Name}-${userstate.senderUserID}`,
      Date.now() + command.Cooldown.User * 1000
    );
  }

  try {
    const response = await command.execute(client, userstate, utils, msg);

    if (response?.text) {
      const responseText = Array.isArray(response.text)
        ? response.text
        : [response.text];

      for (let i = 0; i < responseText.length; i++) {
        const text = message(responseText[i]?.trim());

        for (let j = 0; j < text.length; j++) {
          switch (command.Response) {
            case 0: {
              client.say(userstate.channelName, text[j].trim());
              break;
            }
            case 1: {
              client.say(
                userstate.channelName,
                text[j].trim(),
                userstate.messageID
              );
              break;
            }
            default:
              break;
          }
        }
      }
    }
  } catch (error) {
    console.error(error);
    client.say(userstate.channelName, error.message, userstate.messageID);
  }
}

function message(text) {
  const maxLength = 450;
  const minSplitIndex = maxLength - 25;
  const messages = [];

  while (text.length > maxLength) {
    let splitIndex = text.lastIndexOf(' ', minSplitIndex);
    if (splitIndex === -1) {
      splitIndex = maxLength;
    }
    messages.push(text.substring(0, splitIndex));
    text = text.substring(splitIndex + 1);
  }

  if (text.length > 0) {
    messages.push(text);
  }

  return messages;
}

client.on('ready', async () => {
  console.info('[Client] Ready');
});

client.on('JOIN', (userstate) => {
  console.info('[Client]', `Joined #${userstate.channelName}`);
});

client.on('PART', (userstate) => {
  console.info('[Client]', `Left #${userstate.channelName}`);
});

client.on('PRIVMSG', async (userstate) => {
  let channelConfig;
  try {
    channelConfig = JSON.parse(fs.readFileSync(channelConfigFilePath, 'utf8'));
  } catch (error) {
    console.error('Error:', error);
    channelConfig = {};
  }

  const channelSettings = channelConfig[userstate.channelName] || {};
  const prefix = channelSettings.prefix || config.twitch.bot.prefix;

  if (!userstate.messageText.startsWith(prefix)) {
    return;
  }

  if (ignoredUsers.has(userstate.senderUsername)) {
    client.say(userstate.channelName, `FeelsDankMan 👉 Du bist auf der Ignoreliste`, userstate.messageID);
    return;
  }

  const msg = userstate.messageText.slice(prefix.length).trim().split(/ +/);
  const cmd = msg.shift().toLowerCase();

  if (!cmd) {
    return;
  }

  handleCommand(userstate, cmd, msg);
});

fs.watchFile(ignoreFilePath, (curr, prev) => {
  ignoredUsers = loadIgnoredUsers();
});

loadCommands();

module.exports = { commands, aliases };
