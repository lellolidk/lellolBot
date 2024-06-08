const responses = [
    "Ja, definitiv.",
    "Es ist sicher.",
    "Ohne jeden Zweifel.",
    "Ja, absolut.",
    "Auf jeden Fall.",
    "Vermutlich.",
    "Ja, ich denke schon.",
    "Die Zeichen deuten darauf hin.",
    "Frag später nochmal.",
    "Besser sag ich nicht.",
    "Ich kann es jetzt nicht vorhersagen.",
    "Konzentrier dich und frag nochmal.",
    "Sei nicht zu optimistisch.",
    "Antwort ungewiss, versuchs erneut.",
    "Frag später nochmal.",
    "Das ist zweifelhaft.",
    "Besser nicht darauf verlassen.",
    "Meine Antwort ist nein.",
    "Meine Quellen sagen nein.",
    "Sehr zweifelhaft.",
    "Auf keinen Fall."
];

module.exports = {
    Name: '8ball',
    Aliases: ['8Ball'],
    Description: 'Ask the magic 8-ball a question and receive an answer.',
    Enabled: true,

    Access: {
        Global: 0,
        Channel: 0,
    },

    Cooldown: {
        Global: 0,
        Channel: 5,
        User: 10,
    },

    Response: 1,
    execute: async (bot, userstate, utils, args) => {
        try {
            if (args.length === 0) {
                return { text: 'FeelsDankMan 👉 Du musst eine Frage angegeben', reply: true };
            }

            const randomIndex = Math.floor(Math.random() * responses.length);
            const response = responses[randomIndex];

            return { text: `🎱 ${response}`, reply: true };
        } catch (error) {
            console.error('Error:', error);
            return { text: 'FeelsBadMan 👎 Es ist leider ein Fehler aufgetreten wenn das weiterhin passiert wende dich an @lellolidk ', reply: true };
        }
    }
};
