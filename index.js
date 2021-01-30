const Discord = require('discord.js');
const bot = new Discord.Client();
const token = require("./token.json");
const bdd = require("./bdd.json");
const fs = require("fs");
const fetch = require('node-fetch');
const MessageEmbed = require("discord.js");
const embed = new Discord.MessageEmbed();
const prefix = "d/";

//Trouver des commandes de musique

console.log("Ne pas oubliez ! Si une variable stocké dans la bdd est utilisé dans une commande , ne pas oubliez de mettre le Savebdd() !");

bot.on("ready", async () =>{
  console.log(`Connecté en tant que ${bot.user.tag}`);
  bot.user.setStatus("online")//invisible dnd online idle
  setTimeout(() => {
    bot.user.setActivity(`${bot.guilds.cache.size} serveurs`, {type: "WATCHING"})
    setTimeout(() => {
      let statuts = bdd.stats
      setInterval(function() {
        let stats = statuts[Math.floor(Math.random()*statuts.length)];
        bot.user.setActivity(stats, {type: "WATCHING"})
      }, 7000)
    }, 100)
  }, 10000)
});

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

bot.on("message", async message => {

  if(message.content.startsWith(prefix + "premiumdoomy2private")){
    message.delete()
    if(!bdd[message.guild.id]["premium"]){
      bdd[message.guild.id]["premium"] = "on"
      Savebdd()
      message.reply("Le premium a bien été activé sur se serveur :white_check_mark:");
    } else {
      message.reply("C'est déjà fait :x:");
    }
  }

  if(message.content.startsWith(prefix + "userinfo")){
    if(message.mentions.users.first()){
      if(!bdd[message.guild.id]["warn"]){
        bdd[message.guild.id]["warn"] = {}
        Savebdd()
        if(!bdd[message.guild.id]["warn"][message.mentions.users.first().id]){
          bdd[message.guild.id]["warn"][message.mentions.users.first().id] = 0
          Savebdd()
        }
      }
      const userinfoembed = new Discord.MessageEmbed()
      .setTitle("Info de membre :")
      .addFields(
        { name: 'ID : ', value: message.mentions.users.first().id, inline: true },
        { name: 'NOM : ', value: message.mentions.users.first(), inline: true },
        { name: 'WARN : ', value: bdd[message.guild.id]["warn"][message.mentions.users.first().id], inline: true }
      )
    message.channel.send(userinfoembed)
    } else {
      message.reply(":x: Veuillez mentionner un utilisateur !");
    }
  }

  if(message.content.startsWith(prefix + "say")){
    message.delete();
    let args = message.content.trim().split(" ").slice(1);
    if(args.join(" ")){
      message.channel.send(args.join(" "));
    } else {
      message.reply(":x: Veuillez dire un message à envoyer !");
    }
  }
  
  if(message.content.startsWith(prefix + "wtf")){
    message.delete()
    message.channel.send("https://tenor.com/view/minecraft-herobrine-touchmybutt-gif-9738422");
    console.log(`Un membre avec l'id ${message.member.id} a trouvé l'easter egg !`);
  }

  if(message.content.startsWith("D/wtf")){
    message.delete()
    message.channel.send("https://tenor.com/view/minecraft-herobrine-touchmybutt-gif-9738422");
    console.log(`Un membre avec l'id ${message.member.id} a trouvé l'easter egg !`);
  }

  if (message.content.startsWith(prefix + 'avatar')) {
  let user = message.mentions.users.first();
  if(!user) user = message.author;
  const avatarembed = new Discord.MessageEmbed()
    .setTitle("Voici l'avatar de cette personne !")
    .setImage(user.avatarURL())
    .setColor('#ff9900')
    .setThumbnail(user.avatarURL())
  message.channel.send(avatarembed)
 }

  if(message.content.startsWith(prefix + "mb")){
    if(message.member.hasPermission('ADMINISTRATOR')){
        message_bienvenue = message.content.slice(5)
        bdd[message.guild.id]["message_bienvenue"] = message_bienvenue
        Savebdd();
        message.channel.send("**Le message de bienvenue a bien été réglé sur " + bdd[message.guild.id]["message_bienvenue"] + " :white_check_mark:**")
    }
  }

  if(message.content.startsWith(prefix + "clear")){
        if(message.member.hasPermission('MANAGE_MESSAGES')){
          let args = message.content.trim().split(/ +/g)
           if(args[1]){
               if(!isNaN(args[1]) && args[1] >= 1 && args[1] <= 99){
                   //on effectue le clear

                  message.channel.bulkDelete(args[1])
                    message.channel.send(`**Vous avez supprimé ${args[1]} message(s)** :white_check_mark:`)
                    setTimeout(() => {
                      message.delete()
                    }, 3000)
                }
                else {
                    message.channel.send(`Vous devez indiquer une valeur entre 1 et 99 !`)
                }
            }
            else{
                message.channel.send(`Vous devez indiquer un nombre de messages à supprimer !`)
            }
        }
        else{
            message.channel.send("Vous devez avoir la permission `MANAGE_MESSAGES` pour exécuter cette commande !")
        }
  }

  if(message.content.startsWith(prefix + "statsbot")){
        let totalservers = bot.guilds.cache.size;
	let name = bot.user.tag

        const statsbot = new Discord.MessageEmbed()
        //On créé un Embed contenant toutes les infos du serveur
	        .setColor('#ff9900')
	        .setTitle('Stats du bot')
            .setAuthor('Paulem79', 'https://media.discordapp.net/attachments/730120047607152690/743468752099737650/PicsArt_08-13-02.58.28.png?width=484&height=468')
            .setURL('https://www.youtube.com/channel/UC_6kI0gHuyWZxrJ0fBj_kiQ?view_as=subscriber')
	        .setDescription('Voici les statistiques du bot')
	        .setThumbnail('https://media.discordapp.net/attachments/730120047607152690/743468752099737650/PicsArt_08-13-02.58.28.png?width=484&height=468')
	        .addFields(
           		{ name: 'Nombre de serveur où est le bot : ', value: totalservers, inline: true },
			{ name: 'Nom : ', value: name, inline: true }
	        )
	        .setImage('https://media.discordapp.net/attachments/730120047607152690/743468752099737650/PicsArt_08-13-02.58.28.png?width=484&height=468')
	        .setTimestamp()
	        .setFooter('Par Paulem79', 'https://media.discordapp.net/attachments/730120047607152690/743468752099737650/PicsArt_08-13-02.58.28.png?width=484&height=468');

        message.channel.send(statsbot)
        console.log("Serveurs totaux : " + totalservers + " Nom : " + name);
  }

  if(message.content.startsWith("plop")){
    message.channel.send("Plop");
  }

  if(message.content.startsWith("ping")){
    message.channel.send("Pong");
  }

  if(message.content.startsWith("pong")){
    message.channel.send("Ping");
  }

  if(message.content.startsWith("<@750046099091488859>")){
      message.channel.send("**Mon prefix sur le serveur est `prefix`**");
  }

  if(message.content.startsWith(prefix + "sugg")){
	message.react("<a:valid_white:805098382187954247>");
    	message.react("❌");
  }

  if(message.content.startsWith(prefix + "warn")){
    if(!bdd[message.guild.id]["warn"]){
      bdd[message.guild.id]["warn"] = {}
      Savebdd()
    }
    if(message.member.hasPermission('BAN_MEMBERS')){
      if(!message.mentions.users.first()) return message.channel.send("**:x: Il faut indiquer une personne à warn !**")
      utilisateur = message.mentions.users.first().id
      if(bdd[message.guild.id]["warn"][utilisateur] == 2){
        delete bdd[message.guild.id]["warn"][utilisateur]
        const warnEmbed = new Discord.MessageEmbed()
        .setTitle("Ban")
        .setDescription(`Tu as été ban du serveur **${message.guild.name}** !`)
        .setColor('#ff9900')

        message.mentions.users.first().send(warnEmbed)
        message.guild.members.ban(utilisateur)
        message.channel.send("**L'utilisateur a bien été ban :white_check_mark:**")
      }
      else{
        if(!bdd[message.guild.id]["warn"][utilisateur]){
          bdd[message.guild.id]["warn"][utilisateur] = 1
          Savebdd();
          message.channel.send("**L'utilisateur a bien été averti :white_check_mark: , il a à présent " + bdd[message.guild.id]["warn"][utilisateur] + " avertissement**")
        }
        else{
          bdd[message.guild.id]["warn"][utilisateur]++
          Savebdd();
          message.channel.send("**L'utilisateur a bien été averti :white_check_mark: , il a à présent " + bdd[message.guild.id]["warn"][utilisateur] + " avertissement**")
        }
      }
    }
  }
  if (message.content.startsWith(prefix + 'kick')) {
    if(message.member.hasPermission('KICK_MEMBERS')){
    const user = message.mentions.users.first();
    if (user) {
      const member = message.guild.member(user);
      if (member) {
        member
          .kick(`Kické par ${message.member.author}`)
          .then(() => {
            message.reply(`**:white_check_mark: L'utilisateur ${user} a bien été kick**`)
          })
          .catch(err => {
            message.reply("**:x: Je n'ai pas pu kicker le membre**")
            console.error(err);
          });
      } else {
        message.reply("**:x: Cet utilisateur n'est pas dans cette guilde !**")
      }
    } else {
      message.reply("**:x: Vous devez mentionner un membre à kick !**")
    }
    }
  }

  if (message.content.startsWith(prefix + 'ban')) {
    if(message.member.hasPermission('BAN_MEMBERS')){
    const user = message.mentions.users.first();
    if (user) {
      const member = message.guild.member(user);
      let reason = `Banni par ${message.author}`
      if (member) {
        member
          .ban({
            reason: reason
          })
          .then(() => {
            message.reply(`**:white_check_mark: L'utilisateur ${user} a bien été banni**`)
          })
          .catch(err => {
            message.reply("**:x: Je n'ai pas pu bannir le membre**")
            console.error(err);
            message.channel.send("Raison : " + err)
          });
      } else {
        message.reply("**:x: Cet utilisateur n'est pas dans cette guilde !**")
      }
    } else {
      message.reply("**:x: Vous devez mentionner un utilisateur à bannir !**")
    }
    }
  }

  if(message.content.startsWith(prefix + "calend")){
    const dateembed = new Discord.MessageEmbed()
    .setColor('#ff9900')
    .setTitle("Voici la date :")
      .setAuthor('Paulem79')
    .setFooter("© Doomy Créer par Paulem79 Reproduction interdite")
    .setThumbnail('https://vectorified.com/images/discord-bot-icon-2.png')
    .setTimestamp(new Date())
    .setDescription("**" + new Date() + "**")
    message.channel.send(dateembed)
  }

  if(message.content.startsWith(prefix + "ping")){
    message.channel.send("Pinging...").then(m =>{
      var ping = m.createdTimestamp - message.createdTimestamp;
      var embed = new Discord.MessageEmbed()
      .setAuthor(`Pong ! le ping est de ${ping}`)
      .setColor('#ff9900')
      m.edit(embed)
    })
  }

  if(message.content.startsWith(prefix + "statsuser")){
    if(message.mentions.users.first()){
      const statsuser = new Discord.MessageEmbed()
      .setColor("#ff9900")
      .setTitle("Statistiques du membre :")
      .setAuthor("Paulem79")
      .setFooter("© Doomy Créer par Paulem79 Reproduction interdite")
      .setThumbnail('https://vectorified.com/images/discord-bot-icon-2.png')
      .setTimestamp(new Date())
      .addFields(
        { name: 'ID', value: "permet d'afficher ce message", inline: false },
      )
      message.channel.send(statsuser)
    }
  }

  if(message.content.startsWith(prefix + "invite")) {
    message.channel.send("**:link:Voici le lien pour m'inviter** : https://discord.com/oauth2/authorize?client_id=750046099091488859&scope=bot&permissions=8")
  }

  if(message.content.startsWith(prefix + "yt")){
    message.channel.send("**:link: Voici mon __Youtube__** : https://www.youtube.com/channel/UC_6kI0gHuyWZxrJ0fBj_kiQ")
  }

  if(message.content.startsWith(prefix + "welcomemessageon")){
    if(message.member.hasPermission("MANAGE_MESSAGES")){
      if(message.mentions.channels.first()){
        bdd[message.guild.id]["welcomechannel"] = message.mentions.channels.first().id
        Savebdd()
        message.reply(":white_check_mark: Le channel de bienvenue a bien été réglé sur <#" + message.mentions.channels.first() + "> ! Veuillez aussi activer le message de bienvenue avec d/mb !")
      } else {
        message.reply(":x: Vous devez mentionner un salon !")
      }
    } else {
      message.reply(":x: Vous avez besoin d'avoir la permission Gérer les messages pour exécuter cette commande !");
    }
  } else if(message.content.startsWith(prefix + "welcomemessageoff")){
    if(message.member.hasPermission("MANAGE_MESSAGES")){
      if(bdd[message.guild.id]["welcomechannel"]){
        delete bdd[message.guild.id]["welcomechannel"]
        Savebdd()
        message.reply("Le message de bienvenue a bien été désactivé :white_check_mark:");
      }
    }
  }
});

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
            channel_ticket.send("Ce membre a besoin d'aide @everyone");
            channel_ticket.send("Supprimer le ticket : " + prefix + "channel_close");
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
        message.channel.delete();
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
                { name: '🔑 Modération :', value: "`d/ban` | `d/warn` | `d/kick` | `d/clear` | `d/statsbot` | `d/userinfo`", inline: false },
                { name: '🧪 Expérimental :', value: "`d/sugg` | `d/calend`", inline: false },
                { name: 'IMPORTANT :', value: "`d/setvarserv`", inline: false },
                { name: '➕ Divers :', value: "`d/say` | `d/ticket_create` | `d/channel_close`", inline: false },
                { name: 'Bienvenue :', value: "`d/welcomemessageon` | `d/welcomemessageoff` | `d/mb`", inline: false }
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

bot.login(token.token);
