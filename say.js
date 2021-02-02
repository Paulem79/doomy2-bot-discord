modules.exports = (bot, message) => {
  if(message.content.startsWith(bot.prefix + "say")){
    message.delete();
    let args = message.content.trim().split(" ").slice(1);
    if(args.join(" ")){
      message.channel.send(args.join(" "));
    } else {
      message.reply(":x: Veuillez dire un message à envoyer !");
    }
  }
}
