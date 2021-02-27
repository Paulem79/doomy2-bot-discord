// shard.js
const Discord = require("discord.js");
const client = new Discord.Client();
const prefix = 'da/';

client.on('message', message => {

	if (message.content.startsWith(bot.prefix + ("stats"))) {
		const promises = [
	    client.shard.fetchClientValues('guilds.cache.size'),
	    client.shard.broadcastEval('this.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)'),
    ];

    Promise.all(promises)
	  .then(results => {
		  const totalGuilds = results[0].reduce((acc, guildCount) => acc + guildCount, 0);
		  const totalMembers = results[1].reduce((acc, memberCount) => acc + memberCount, 0);
		  return message.channel.send(`Server count: ${totalGuilds}\nMember count: ${totalMembers}`);
	  })
	  .catch(console.error);
	}
});

client.shard.fetchClientValues('guilds.cache.size')
	.then(results => {
		console.log(`${results.reduce((acc, guildCount) => acc + guildCount, 0)} total guilds`);
	})
	.catch(console.error);
client.shard.broadcastEval('this.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)').then(console.log);