const { ShardingManager } = require('discord.js');
const manager = new ShardingManager('./shard.js', {token: "NzUwMDQ2MDk5MDkxNDg4ODU5.X0003Q.shOvucW2Vz9hrRT47bNHZ6xXE30"});

manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));
manager.spawn();