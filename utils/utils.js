const fetch = require('node-fetch');
const humanizeDuration = require('humanize-duration');
const config = require('../config.json');
const got = require('got');

exports.ParseUser = (user) => {
	const parsed = user.replace(/[@#,]/g, ''); // Remove @, #, and ,
	return parsed.toLowerCase();
};

class Utils {

  static async getEmote(emote, type, emoteSet) {
    if (!emote) return;
    if (!emoteSet) {
      switch (type) {
        case 'name': {
          const options = {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${config.sevenTV.oauth}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              variables: {
                query: emote,
                limit: 1,
                page: 1,
                sort: {
                  value: 'popularity',
                  order: 'DESCENDING',
                },
                filter: {
                  category: 'TOP',
                  exact_match: true,
                  case_sensitive: true,
                  ignore_tags: false,
                  zero_width: false,
                  animated: false,
                  aspect_ratio: '',
                },
              },
              operationName: 'SearchEmotes',
              query: `query SearchEmotes($query: String!, $page: Int, $limit: Int, $filter: EmoteSearchFilter) {
                emotes(query: $query, page: $page, limit: $limit, filter: $filter) {
                  items {
                    id
                    name
                  }
                }
              }`,
            }),
          };

          const response = await fetch(`https://7tv.io/v3/gql`, options);

          if (!response.ok) {
            throw new Error(`[ (7TV) ] 7TV's GQL Gibt error züruck. FeelsDankMan `);
          }

          const data = await response.json();

          if (!data?.data?.emotes?.items[0]) {
            throw new Error(`[ (7TV) ] Emote '${emote}' nicht Gefunden. FeelsDankMan`);
          }

          return {
            name: data.data.emotes.items[0].name,
            id: data.data.emotes.items[0].id,
          };
        }
        case 'id': {
          const response = await fetch(`https://7tv.io/v3/emotes/${emote}`, {
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (response.status === 400) {
            throw new Error(`[ (7TV) ]  Emote '${emote}' nicht Gefunden. FeelsDankMan`);
          }

          if (!response.ok) {
            throw new Error(`[ (7TV) ] 7TV's API Gibt error züruck. FeelsDankMan `);
          }

          const data = await response.json();

          if (data.id === '000000000000000000000000') {
            throw new Error(`[ (7TV) ]  Emote '${emote}' nicht Gefunden. FeelsDankMan`);
          }

          return {
            name: data.name,
            id: data.id,
          };
        }
      }
    }

    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.sevenTV.oauth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        variables: {
          id: emoteSet,
        },
        operationName: 'GetEmoteSetMin',
        query: `query GetEmoteSetMin($id: ObjectID!) {
          emoteSet(id: $id) {
            emotes {
              id
              name
              data {
                name
              }
            }
          }
        }`,
      }),
    };

    const response = await fetch(`https://7tv.io/v3/gql`, options);

    if (!response.ok) {
      throw new Error(`[ (7TV) ] 7TV's GQL Gibt error züruck. FeelsDankMan `);
    }

    const data = await response.json();

    if (!data.data.emoteSet.emotes) {
      throw new Error(`[ (7TV) ] Dieser Channel hat keine Emotes. FeelsDankMan `);
    }

    switch (type) {
      case 'name': {
        const find =
          data.data.emoteSet.emotes.find((x) => x.name === emote.trim()) ||
          data.data.emoteSet.emotes.find((x) => x.data.name === emote.trim());

        if (!find) {
          throw new Error(`[ (7TV) ] ${emote.trim()} wurde nicht gefunden. FeelsDankMan`);
        }

        return {
          name: find.name,
          id: find.id,
          setName: data.data.name,
        };
      }
      case 'id': {
        const find = data.data.emoteSet.emotes.find(
          (x) => x.id === emote.trim()
        );

        if (!find) {
          throw new Error(`[ (7TV) ] ${emote.trim()} wurde nicht gefunden. FeelsDankMan`);
        }

        return {
          name: find.name,
          id: find.id,
          setName: data.data.name,
        };
      }
      default: {
        return;
      }
    }
  }

  static async getEmoteSet(id) {
    try {
      const response = await fetch(`https://7tv.io/v3/users/twitch/${id}`, {
        responseType: 'json',
        throwHttpErrors: false,
      });

      if (!response.ok) {
        switch (response.status) {
          case 404:
            throw new Error(`[ (7TV) ] 7TV Channel nicht gefunden. FeelsDankMan`);

          default:
            throw new Error(`[ (7TV) ] 7TV's API Gibt error züruck. FeelsDankMan `);
        }
      }

      const data = await response.json();

      if (!data.emote_set) {
        throw new Error(
          `[ (7TV) ] Bitte Aktiviere ein Aktiven Emote-set um den 7TV Command zu Benutzen. FeelsDankMan`
        );
      }

      return {
        id: data.emote_set.id,
        name: data.emote_set.name,
      };
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  static getUptime() {
    return humanizeDuration(process.uptime() * 1000, {
      largest: 3,
      round: true,
      spacer: ' ',
      conjunction: ' and ',
      serialComma: false,
    });
  }
}

module.exports = Utils;
