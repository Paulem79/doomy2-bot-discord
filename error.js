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
