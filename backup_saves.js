Discord = require('discord.js');
Bot = new Discord.Client();
fs = require('fs');
Saves = require('configstore');
Saves = new Saves('elysianbot_datastore');
Backup = {};

function backupSaves(){
  Bot.guilds.map((g)=>{
    var id = g.id;
    var gSave = Saves.get(id);
    Backup[id] = gSave;
  })
  setTimeout(()=>{
    var tick = new Date();
    tick = tick.getTime();
    fs.writeFile('./internal/saveBackup/mostRecentSaves.bsv',JSON.stringify(Backup),'utf8',(err)=>{
      if(err){console.log('error->',err)}
    });
  },500);
}

Bot.on('ready',()=>{
  backupSaves();
})



Bot.login(process.env.BOT_TOKEN);
