const Discord = require('discord.js');
const Collection = require("discord.js")
const bot = new Discord.Client();
const process.env.token = require("./token.json");
const { prefix } = require("./config.json");
const bdd = require("./bdd.json");
const fs = require("fs");
const fetch = require('node-fetch');
const MessageEmbed = require("discord.js");
const embed = new Discord.MessageEmbed();

bot.prefix = prefix;
bot.commands = new Discord.Collection();

//Trouver des commandes de musique

console.log("Ne pas oubliez ! Si une variable stocké dans la bdd est utilisé dans une commande , ne pas oubliez de mettre le Savebdd() !");

bot.on("ready", () => require("./ready.js")(bot, bdd));
bot.on("message", message => require("./message.js")(bot, message, bdd, Savebdd, Discord));
bot.on("shard", message => require("./shard.js")(bot, message));

//Error
bot.on("message", message => {
  //if(message.content.includes("commande"))

  if(message.content.startsWith(prefix)){
      if(!bdd[message.guild.id]){
        const problembddsetvar = new Discord.MessageEmbed()
        .setColor("#d10000")
        .setTitle("`Error 01 : bdd not defined`")
        .setDescription("Veuillez activer la bdd pour utiliser les commandes avec : `" + prefix + "setvarserv` ! Si le problème persiste, veuillez contacter <@696076032133955635>")
        .setTimestamp(new Date())
        message.reply(problembddsetvar);
      }
  }

  if(message.content.startsWith(prefix + "setvarserv")){
    if(!bdd[message.guild.id]){
      bdd[message.guild.id] = {}
      bdd[message.guild.id]["Nom"] = message.guild.name
      Savebdd();
      message.channel.send("La commande a bien été exécuté :white_check_mark:");
    } else {
      message.reply("Déjà fait :x:");
    }
  }
});

//Commandes

bot.on("guildMemberAdd", member => {
  if(bdd[member.guild.id]["welcomechannel"]){
    if(bdd[member.guild.id]["message_bienvenue"]){
      bot.channels.cache.get(bdd[member.guild.id]["welcomechannel"]).send(bdd[member.guild.id]["message_bienvenue"]);
    } else {
      bot.channels.cache.get(bdd[member.guild.id]["welcomechannel"]).send(`Bienvenue ${member.mention} sur le serveur ${member.guild.name}`);
    }
  }
})

//Pour tous les serveurs
bot.on("guildCreate", guild => {
  console.log(`Le bot a été ajouté au serveur ${guild.name}`)
  bdd[guild.id] = {}
  bdd[guild.id]["Nom"] = guild.name
  Savebdd();
});
bot.on("guildRemove", guild => {
  console.log(`Le bot a été retiré du serveur ${guild.name}`)
  delete bdd[guild.id]
  Savebdd();
});

//Commande de ticket
bot.on("message", message => {
  if(message.content.startsWith(prefix + "ticket_create")){
    if(message.member.hasPermission('MANAGE_MESSAGES')){
      message.channel.send("**Réagis au ✅ pour créer un ticket**");
      message.react("✅");
      bot.on("messageReactionAdd", (reaction, user) => {
        if (user.bot) return
        if (reaction.emoji.name == "✅") {
          reaction.message.guild.channels.create(`ticket de ${user.username}`, {
            type: 'text',
            permissionOverwrites: [{
              id: reaction.message.guild.id,
              allow: ['SEND_MESSAGES'],
              allow: ['ADD_REACTIONS'],
            }]
          }).then(channel_ticket => {
            channel_ticket.send(`**:white_check_mark: Ticket créé ! ${user}**`);
            channel_ticket.send("Ce membre a besoin d'aide !");
            channel_ticket.send("Supprimer le ticket : " + prefix + "channel_close [Nom du salon]");
          })
        }
      })
    }else {
      message.channel.send(":x: Tu n'as pas les permissions nécessaires !");
    }
  }

  if (message.content.startsWith(prefix + "channel_close")){
    if(message.member.hasPermission('MANAGE_CHANNELS')){
      if(message.mentions.channels.first()){
        message.mentions.channels.first().delete()
        message.reply("Le salon <#" + message.mentions.channels.first().id + "> a bien été supprimé :white_check_mark:")
      } else {
	message.channel.send("Veuillez mentionner un salon !");
      }
    } else {
      message.reply("Vous n'avez pas les permissions nécessaires !");
    }
  }
});

//****************Commande de help****************\\
bot.on("message", message => {
  if(message.content.startsWith(prefix + "help")){
    const helpembed = new Discord.MessageEmbed()
    .setColor('#ff9900')
    .setTitle("**Doomy** Toutes les commandes")
      .setAuthor('Paulem79', 'https://media.discordapp.net/attachments/730120047607152690/743468752099737650/PicsArt_08-13-02.58.28.png?width=674&height=651')
    .setFooter("® Doomy Créer par Paulem79 Reproduction interdite | 🧪 = en développement 🔑 = admin seulement")
    .setThumbnail('https://cdn.discordapp.com/attachments/736163626934861845/742671714386968576/help_animated_x4_1.gif')
    .setTimestamp(new Date())
    .addFields(
		        { name: '`d/help`', value: "permet d'afficher ce message", inline: false },
                { name: '🔑 Modération :', value: "`d/ban` | `d/warn` | `d/kick` | `d/clear` | `d/statsbot` | `d/userinfo` | `d/avatar`", inline: false },
                { name: '🧪 Expérimental :', value: "`d/sugg` | `d/calend`", inline: false },
                { name: 'IMPORTANT :', value: "`d/setvarserv`", inline: false },
                { name: '➕ Divers :', value: "`d/say` | `d/ticket_create` | `d/channel_close`", inline: false },
                { name: 'Bienvenue :', value: "`d/welcomemessageon` | `d/welcomemessageoff` | `d/mb`", inline: false },
	    	{ name: 'Communauté :', value: "Support : https://discord.gg/unJJFQspHd | Serveur de PauLem79 : https://discord.gg/By3u4j7GQT", inline: false }
	        )
    message.channel.send(helpembed)
  }
});

//****************Commande de fonction****************\\
function Savebdd() {
    fs.writeFile("./bdd.json", JSON.stringify(bdd, null, 4), (err) => {
        if (err) message.channel.send("Une erreur est survenue.");
    });
}

bot.login(process.env.token.token);
