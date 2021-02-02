module.exports = () => {
  bot.on("ready", async () =>{
    console.log(`Connecté en tant que ${bot.user.tag} | ${bot.guilds.cache.size} serveurs`);
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
  })
}
