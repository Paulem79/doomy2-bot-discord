module.exports = (bot, bdd) => {
  console.log("Bot prêt")
  bot.user.setStatus("online");
  let statuts = bdd.stats
  setInterval(function() {
      let stats = statuts[Math.floor(Math.random()*statuts.length)];
      bot.user.setActivity(stats, {type: "PLAYING"})
  }, 6000)
}
