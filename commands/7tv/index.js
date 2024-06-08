const config = require('../../config.json');

const fetch = require('node-fetch');

const linkRegEx = /https:\/\/7tv\.app\/emotes\/([0-9a-z]{24})/;

const getError = (errorCode, errorMessage) => {
  switch (Number(errorCode)) {
    case 704620:
      return '[ (7TV) ] Dein Emote-set ist leider voll. FeelsDankMan';
    case 704610:
      return '[ (7TV) ] Der Emote ist Disabled. FeelsDankMan';
    case 704611:
      return '[ (7TV) ] Der Emote ist schon Drinne. FeelsDankMan';
    case 704612:
      return '[ (7TV) ] Der Emote name exisistiert schon. FeelsDankMan';
    case 70429:
      return "[ (7TV) ] Derzeit Probleme mit der API. NotLikeThis";
    case 70403:
      return '[ (7TV) ] Bitte gib mir 7TV Editor Rechte. FeelsDankMan';
    case 70433:
      return "[ (7TV) ] Du bist gebannt auf 7TV. HUH";
    case 70441:
      return '[ (7TV) ] Emote-set nicht gefunden. FeelsDankMan ';
    default:
      return "[ (7TV) ] 7TV's GQL Gibt error züruck. FeelsDankMan ";
  }
};

module.exports = {
  Name: '7tv',
  Aliases: [],
  Description: 'Manage your 7TV Emotes.',
  Enabled: true,

  Access: {
    Global: 0,
    Channel: 2,
  },

  Cooldown: {
    Gloabl: 0,
    Channel: 2.5,
    User: 5,
  },

  Response: 1,
  execute: async (client, userstate, utils, msg) => {
    if (!msg[0]) {
      return {
        text: 'FeelsOkayMan 👉 So verwendest du den Command: -7tv <add/remove/rename> <emote-(name/link)>',
      };
    }

    if (['add'].includes(msg[0].toLowerCase())) {
      if (!msg[1]) {
        return {
          text: 'FeelsOkayMan 👉 So verwendest du den Command: -7tv add <emote-name/emote-link>',
        };
      }

      const message = msg
        .slice(1)
        .join(' ')
        .split(/\s|,\s?/g);

      const emotes = message.map(async (value) => {
        const emote = await utils.getEmote(
          linkRegEx.test(value.trim())
            ? value.trim().match(linkRegEx)[1]
            : value.trim(),
          linkRegEx.test(value.trim()) ? 'id' : 'name'
        );

        const emoteSet = await utils.getEmoteSet(userstate.channelID);

        const response = await fetch(`https://7tv.io/v3/gql`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${config.sevenTV.oauth}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            operationName: 'ChangeEmoteInSet',
            query: `mutation ChangeEmoteInSet(
              $id: ObjectID!
              $action: ListItemAction!
              $emote_id: ObjectID!
              $name: String
            ) {
              emoteSet(id: $id) {
                id
                emotes(id: $emote_id, action: $action, name: $name) {
                  id
                  name
                }
              }
            }`,
            variables: {
              action: 'ADD',
              emote_id: emote.id,
              id: emoteSet.id,
              name: null,
            },
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(`[ (7TV) ] 7TV's GQL Gibt error züruck. FeelsDankMan `);
        }

        if (data.errors) {
          return data.errors.map((data_) => {
            const errorCode = data_.message.split(' ')[0];
            const errorMessage = data_.message.split(' ').slice(1).join(' ');

            return getError(errorCode, errorMessage);
          });
        }

        return `[ (7TV) ] Erfolgreich ${emote.name} hinzugefügt im Emote-set ${emoteSet.name}. FeelsOkayMan `;
      });

      const results = await Promise.all(emotes);

      return {
        text: results.length
          ? results.flat()
          : `[ (7TV) ] Emote ${results.length > 1 ? '(s)' : ''} nicht Gefunden. FeelsDankMan`,
      };
    }

    if (['rename'].includes(msg[0].toLowerCase())) {
      if (!msg[2]) {
        return {
          text: 'FeelsOkayMan 👉 So verwendest du den Command: -7tv rename <emote-name/emote-link> (emote-name)',
        };
      }

      const emoteSet = await utils.getEmoteSet(userstate.channelID);

      const emote = await utils.getEmote(
        linkRegEx.test(msg[1]) ? msg[1].match(linkRegEx)[1] : msg[1],
        linkRegEx.test(msg[1]) ? 'id' : 'name',
        emoteSet.id
      );

      const response = await fetch(`https://7tv.io/v3/gql`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${config.sevenTV.oauth}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          operationName: 'ChangeEmoteInSet',
          query: `mutation ChangeEmoteInSet($id: ObjectID!, $action: ListItemAction!, $emote_id: ObjectID!, $name: String) {
                        emoteSet(id: $id) {
                            id
                            emotes(id: $emote_id, action: $action, name: $name) {
                                id
                                name
                            }
                        }
                    }`,
          variables: {
            action: 'UPDATE',
            emote_id: emote.id,
            id: emoteSet.id,
            name: msg[2],
          },
        }),
      });

      const data = await response.json();

      if (!response.ok)
        throw new Error(`[ (7TV) ] 7TV's GQL Gibt error züruck. FeelsDankMan `);

      if (data.errors) {
        return data.errors.map((data_) => {
          const errorCode = data_.message.split(' ')[0];
          const errorMessage = data_.message.split(' ').slice(1).join(' ');

          return getError(errorCode, errorMessage);
        });
      }

      return {
        text: `[ (7TV) ] Erfolgreich ${emote.name} unbenannt zu ${msg[2]} im Emote-set ${emoteSet.name}. FeelsOkayMan `,
      };
    }

    if (['remove'].includes(msg[0].toLowerCase())) {
      if (!msg[1]) {
        return {
          text: 'Usage: +7tv remove <emotes>',
        };
      }

      const message = msg
        .slice(1)
        .join(' ')
        .split(/\s|,\s?/g);

      const emotes = message.map(async (value) => {
        const emoteSet = await utils.getEmoteSet(userstate.channelID);

        const emote = await utils.getEmote(
          linkRegEx.test(value.trim())
            ? value.trim().match(linkRegEx)[1]
            : value.trim(),
          linkRegEx.test(value.trim()) ? 'id' : 'name',
          emoteSet.id
        );

        const response = await fetch(`https://7tv.io/v3/gql`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${config.sevenTV.oauth}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            operationName: 'ChangeEmoteInSet',
            query: `mutation ChangeEmoteInSet(
              $id: ObjectID!
              $action: ListItemAction!
              $emote_id: ObjectID!
              $name: String
            ) {
              emoteSet(id: $id) {
                id
                emotes(id: $emote_id, action: $action, name: $name) {
                  id
                  name
                }
              }
            }`,
            variables: {
              action: 'REMOVE',
              emote_id: emote.id,
              id: emoteSet.id,
              name: null,
            },
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(`[ (7TV) ] 7TV's GQL Gibt error züruck. FeelsDankMan`);
        }

        if (data.errors) {
          return data.errors.map((data_) => {
            const errorCode = data_.message.split(' ')[0];
            const errorMessage = data_.message.split(' ').slice(1).join(' ');

            return getError(errorCode, errorMessage);
          });
        }

        return `[ (7TV) ] Erfolgreich ${emote.name} entfernt im Emote-set ${emoteSet.name}. FeelsOkayMan `;
      });

      const results = await Promise.all(emotes);

      return {
        text: results.length
          ? results.flat()
          : `[ (7TV) ] Emote ${results.length > 1 ? '(s)' : ''} nicht Gefunden. FeelsDankMan`,
      };
    }
    if (['paint'].includes(msg[0].toLowerCase())) {
      if (!msg[1]) {
        return {
          text: 'Usage: +7tv paint ',
        };
      }

        const response = await fetch(`https://7tv.io/v3/gql`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${config.sevenTV.oauth}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            operationName: 'UpdateUserCosmetics',
            query: `mutation UpdateUserCosmetics(
              $user_id: ObjectID!,
              $update: UserCosmeticUpdate!
            ) {
                user(id: $user_id) 
                cosmetics(update: $update)    
                __typename
            }`,
            variables: {
              action: 'PAINT',
              user_id: null,
              update: null,
              kind: 'PAINT',
            },
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(`[ (7TV) ] 7TV's GQL Gibt error züruck. FeelsDankMan`);
        }

        if (data.errors) {
          return data.errors.map((data_) => {
            const errorCode = data_.message.split(' ')[0];
            const errorMessage = data_.message.split(' ').slice(1).join(' ');

            return getError(errorCode, errorMessage);
          });
        }

        return `[ (7TV) ] hurensohn `;
      };

      const results = await Promise.all(emotes);

      return {
        text: results.length
          ? results.flat()
          : `[ (7TV) ] Emote ${results.length > 1 ? '(s)' : ''} nicht Gefunden. FeelsDankMan`,
      };
    }
    
  }
