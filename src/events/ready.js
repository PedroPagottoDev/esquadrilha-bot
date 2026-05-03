const { Events, ActivityType } = require('discord.js');

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    console.log(`✅ Online como ${client.user.tag}`);
    client.user.setPresence({
      activities: [{ name: 'Esquadrilha da Fumaça ✈️', type: ActivityType.Watching }],
      status: 'online',
    });
  },
};
