Discord = require('discord.js');
Bot = new Discord.Client();
Commands = [];
Saves = require('configstore');
DefaultPrefix = "-";
Version = "0.0.1";
Http = require('http');
Https = require('https');

Fs = require('fs');
fs = Fs;
Execute = require('child_process').exec;
Saves = new Saves('elysianbot_datastore');
Fail = "http://www.clipartkid.com/images/573/red-x-mark-4-icon-free-red-x-mark-icons-5br1Kr-clipart.gif";
Succ = "http://i.imgur.com/fw7e0Yv.png";
Info = "http://i.imgur.com/M0X4Kmf.png";
Backup = {};
DefaultSave = {
	Prefix: DefaultPrefix,
	LogChannel:'',
	Warns:[],
	Mutes:[],
	Blacklist:[],
	AntiBot:[],
	Whitelist:[],
	AdminRole:"Administrator",
	ModRole:"Moderator",
	WarnData:{
		TimeReset:60 * 5,SpecificPunish:{
			3:{type:'mute',time:30},
			4:{type:'mute',time:60},
			5:{type:'kick'},
			6:{type:'ban'},
		},
	},
	AntiInvite:false,
};
global.xRequire = function(a){return require(a)};

devs = ["147176715880235008","125242220738510848"];
Traffic = {};

loadSequence = [
	'./internal/function_base.js',
	'./internal/command_base.js',
	'./internal/core.js',
]

global.loadFile = function(file){
	Fs.readFile(file,(_,str)=>{
		try{
			return new Function(str)();
		}catch(e){
			console.log('[<+ FATAL +>] -> error loading '+file);
			console.log(e);
		}
	})
}

loadSequence.forEach((val)=>{
	var ind = loadSequence.indexOf(val);

	setTimeout(()=>{loadFile(val)},ind*250);
})


setTimeout(()=>{
	AddCommand('notif',undefined,'["rolename"] [text]\n(notifies all users with a role)', (msg,args,userrank,m)=>{
		if(m.guild.id == '165058090410967040'){
			var role = m.guild.roles.find('name',GetBetweenCapture(msg));
			if(role){
				var rID = role.id;
				var pm = msg.replace('"'+GetBetweenCapture(msg)+'"','');
				var tN = GetBetweenCapture(pm)
				if(tN){
					pm = pm.replace('"'+GetBetweenCapture(pm)+'"','');
				}
				m.guild.members.map((u)=>{
					if(u.roles.get(rID)){
						if(tN){
							SendEmbed(u,GetEmbed('','**'+pm+'**',{name:'Notification',icon:Info},undefined,tN,tN));
						}else{
							SendEmbed(u,GetEmbed('','**'+pm+'**',{name:'Notification',icon:Info}));
						}
					}
				})
			}else{
				SendEmbed(m.channel,GetEmbed('',undefined,{name:'Role not found',icon:Fail}));
			}
		}
	})
	setInterval(backupSaves,10800000) // 3 hours;
	//loadSaves(require);
},1000)

Discord = require('discord.js');
Bot = new Discord.Client();
Commands = [];
Saves = require('configstore');
DefaultPrefix = "-";
Version = "0.0.1";
Http = require('http');
Https = require('https');

Fs = require('fs');
fs = Fs;
Execute = require('child_process').exec;
Saves = new Saves('elysianbot_datastore');
Fail = "http://www.clipartkid.com/images/573/red-x-mark-4-icon-free-red-x-mark-icons-5br1Kr-clipart.gif";
Succ = "http://i.imgur.com/fw7e0Yv.png";
Info = "http://i.imgur.com/M0X4Kmf.png";
Backup = {};
DefaultSave = {
	Prefix: DefaultPrefix,
	LogChannel:'',
	Warns:[],
	Mutes:[],
	Blacklist:[],
	AntiBot:[],
	Whitelist:[],
	AdminRole:"Administrator",
	ModRole:"Moderator",
	WarnData:{
		TimeReset:60 * 5,SpecificPunish:{
			3:{type:'mute',time:30},
			4:{type:'mute',time:60},
			5:{type:'kick'},
			6:{type:'ban'},
		},
	},
	AntiInvite:false,
};
global.xRequire = function(a){return require(a)};

devs = ["147176715880235008","125242220738510848"];
Traffic = {};

loadSequence = [
	'./internal/function_base.js',
	'./internal/command_base.js',
	'./internal/core.js',
]

global.loadFile = function(file){
	Fs.readFile(file,(_,str)=>{
		try{
			return new Function(str)();
		}catch(e){
			console.log('[<+ FATAL +>] -> error loading '+file);
			console.log(e);
		}
	})
}

loadSequence.forEach((val)=>{
	var ind = loadSequence.indexOf(val);

	setTimeout(()=>{loadFile(val)},ind*250);
})


setTimeout(()=>{
	AddCommand('notif',undefined,'["rolename"] [text]\n(notifies all users with a role)', (msg,args,userrank,m)=>{
		if(m.guild.id == '165058090410967040'){
			var role = m.guild.roles.find('name',GetBetweenCapture(msg));
			if(role){
				var rID = role.id;
				var pm = msg.replace('"'+GetBetweenCapture(msg)+'"','');
				var tN = GetBetweenCapture(pm)
				if(tN){
					pm = pm.replace('"'+GetBetweenCapture(pm)+'"','');
				}
				m.guild.members.map((u)=>{
					if(u.roles.get(rID)){
						if(tN){
							SendEmbed(u,GetEmbed('','**'+pm+'**',{name:'Notification',icon:Info},undefined,tN,tN));
						}else{
							SendEmbed(u,GetEmbed('','**'+pm+'**',{name:'Notification',icon:Info}));
						}
					}
				})
			}else{
				SendEmbed(m.channel,GetEmbed('',undefined,{name:'Role not found',icon:Fail}));
			}
		}
	})
	setInterval(backupSaves,10800000) // 3 hours;
	//loadSaves(require);
},1000)

Discord = require('discord.js');
Bot = new Discord.Client();
Commands = [];
Saves = require('configstore');
DefaultPrefix = "-";
Version = "0.0.1";
Http = require('http');
Https = require('https');

Fs = require('fs');
fs = Fs;
Execute = require('child_process').exec;
Saves = new Saves('elysianbot_datastore');
Fail = "http://www.clipartkid.com/images/573/red-x-mark-4-icon-free-red-x-mark-icons-5br1Kr-clipart.gif";
Succ = "http://i.imgur.com/fw7e0Yv.png";
Info = "http://i.imgur.com/M0X4Kmf.png";
Backup = {};
DefaultSave = {
	Prefix: DefaultPrefix,
	LogChannel:'',
	Warns:[],
	Mutes:[],
	Blacklist:[],
	AntiBot:[],
	Whitelist:[],
	AdminRole:"Administrator",
	ModRole:"Moderator",
	WarnData:{
		TimeReset:60 * 5,SpecificPunish:{
			3:{type:'mute',time:30},
			4:{type:'mute',time:60},
			5:{type:'kick'},
			6:{type:'ban'},
		},
	},
	AntiInvite:false,
};
global.xRequire = function(a){return require(a)};

devs = ["147176715880235008","125242220738510848"];
Traffic = {};

loadSequence = [
	'./internal/function_base.js',
	'./internal/command_base.js',
	'./internal/core.js',
]

global.loadFile = function(file){
	Fs.readFile(file,(_,str)=>{
		try{
			return new Function(str)();
		}catch(e){
			console.log('[<+ FATAL +>] -> error loading '+file);
			console.log(e);
		}
	})
}

loadSequence.forEach((val)=>{
	var ind = loadSequence.indexOf(val);

	setTimeout(()=>{loadFile(val)},ind*250);
})


setTimeout(()=>{
	AddCommand('notif',undefined,'["rolename"] [text]\n(notifies all users with a role)', (msg,args,userrank,m)=>{
		if(m.guild.id == '165058090410967040'){
			var role = m.guild.roles.find('name',GetBetweenCapture(msg));
			if(role){
				var rID = role.id;
				var pm = msg.replace('"'+GetBetweenCapture(msg)+'"','');
				var tN = GetBetweenCapture(pm)
				if(tN){
					pm = pm.replace('"'+GetBetweenCapture(pm)+'"','');
				}
				m.guild.members.map((u)=>{
					if(u.roles.get(rID)){
						if(tN){
							SendEmbed(u,GetEmbed('','**'+pm+'**',{name:'Notification',icon:Info},undefined,tN,tN));
						}else{
							SendEmbed(u,GetEmbed('','**'+pm+'**',{name:'Notification',icon:Info}));
						}
					}
				})
			}else{
				SendEmbed(m.channel,GetEmbed('',undefined,{name:'Role not found',icon:Fail}));
			}
		}
	})
	setInterval(backupSaves,10800000) // 3 hours;
	//loadSaves(require);
},1000)

Bot.login(process.env.BOT_TOKEN);
