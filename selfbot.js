const Discord = require('discord.js');
const bot = new Discord.Client();

bot.on('ready', () => {
  console.log('Loaded!');
});
bot.on('message', message => {
    if (message.content===',killjoao') {
        message.edit('http://image.prntscr.com/image/2d4fe95944fd48e4b92b25db63dd3f4c.png');
        }
});
bot.login("MTI1MjQyMjIwNzM4NTEwODQ4.DHvLbQ.81PjnhkUmxVXUOZaM70fCt2q-s8");
