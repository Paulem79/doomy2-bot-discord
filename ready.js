module.exports = (bdd, bot) => {
  console.log("Bot prêt")
    
   let statuts = bdd.stats
   setInterval(function() {
       let stats = statuts[Math.floor(Math.random()*statuts.length)];
       bot.user.setActivity(stats, {type: "STREAMING"})
   }, 10000)
   bot.user.setStatus("dnd");
}
