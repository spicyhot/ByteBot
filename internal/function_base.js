
global.AddCommand = function(name,rank,desc,func){
	Commands.push([name,rank,func,desc]);
};
global.backupSaves = function(){
  Bot.guilds.map((g)=>{
    var id = g.id;
    var gSave = Saves.get(id);
    Backup[id] = gSave;
  })
  setTimeout(()=>{
    fs.writeFile('./internal/saveBackup/mostRecentSaves.bsv',JSON.stringify(Backup),'utf8',(err)=>{
      if(err){console.log('backup error->',err)}
    });
  },500);
}
global.loadSaves = function(r){
	var saveFile = 'mostRecentSaves.json';
	var saves = r('./internal/saveBackup/'+saveFile);
	pairs(saves,(i,v)=>{
		Saves.set(i,v);
	})
}


global.GetBetweenCapture = function(str){
	if(str.indexOf('"') != -1){
		var s = str.slice(str.indexOf('"')+1);
		if(s.indexOf('"') != -1){
			return s.slice(0,s.indexOf('"'));
		}
	}
};

global.verifySave = function(gid,gn){
	if(!gid || !gn){return;}
	var gSave = Saves.get(gid);
	if(!gSave){Saves.set(gid,DefaultSave);console.log('reset saves for '+gid);return;};
	for(key in DefaultSave){
		if(!gSave.hasOwnProperty(key) && DefaultSave.hasOwnProperty(key)){
			gSave[key] = DefaultSave[key];
			Saves.set(gid,gSave);
			console.log('[WARN]: '+gn+' restored save '+key+' to default')
		}
	}
};

global.Download = function(attachment,path){
	var file = Fs.createWriteStream(path || attachment.filename);
	var request = Https.get(attachment.url, function(r) {
		r.pipe(file);
	});
}

global.Log = function(server,embeds){
	if(!server){console.log('attempt to log with no server',embeds);return}
	var id = typeof server == 'string' && server || server.id;
	if(Saves.get(id).LogChannel != ''){
		var guild = Bot.guilds.get(id)
		var channel = guild.channels.get(Saves.get(id).LogChannel);
		if(channel != undefined){
			SendEmbed(channel,embeds);
		}
	}
}
global.logTraffic = function(id,obj){
	if(Traffic.hasOwnProperty(id)){
		var oTraffic = Traffic[id];
		traf = {
			id:id,
			num:oTraffic.num++,
		}
		Traffic[id] = traf;
	}else{
		Traffic[id] = {id:id,num:1}
	}
}
global.getTraffic = function(){
	return xRequire('util').inspect(Traffic);
}
global.pairs = function(oA,cb){
	for(key in oA){
		if(oA.hasOwnProperty(key)){
			cb(key,oA[key]);
		}
	}
}
global.antiInvite = function(m,ur){
	if(!m || !m.guild || ur > 0){return};
	var GuildSave = Saves.get(m.guild.id);
	var ParsedMessage = m.content.replace(/\\/g,'').toLowerCase();
	ParsedMessage = ParsedMessage.replace(/\u0000/g,'')

	var list = ['discord.gg','discord.me'];
	pairs(list,(i,v)=>{
		if(ParsedMessage.indexOf(v) != -1){
			m.delete();
		}
	})
}
global.Mute = function(server,user,time,m){
	var id = typeof server == 'string' && server || server.id;
	user = typeof user == 'string' && server.members.get(user) || user;
	//if(server.channels.array().length < 20){
		server.channels.map((chan)=>{
			if(m){
				chan.overwritePermissions(user,{SEND_MESSAGES:false});
				logTraffic(server.id,server);
			}else{
				chan.overwritePermissions(user,{SEND_MESSAGES:null});
				logTraffic(server.id,server);
			}
		})
	//}
	if(time == Infinity){return};
	var Saved = Saves.get(id);
	if(!m){return;}
	if(Saved){
		var Mutes = Saved.Mutes;
		var Found = false;
		for(var i = 0;i<Mutes.length;i++){
			if(Mutes[i][0] == user.id){
				Found = true;
				Mutes[i][2] = time;
			}
		}
		if(!Found){
			Mutes.push([
				user.id,
				user.username + "#" + user.discriminator,
				time
			])
		}
		Saved.Mutes = Mutes;
		Saves.set(id,Saved);
	}
}

global.GetEmbed = function(title,desc,auth,ts,tn,url){
	var temp = [];
	if(desc == undefined){
		var a = new Discord.RichEmbed();
		a.setColor(0xbc1007);
		if(title){a.setTitle(title || '');}
		if(auth){a.setAuthor(auth.name,auth.icon);}
		if(ts){a.setTimestamp(ts && new Date() || undefined);}
		if(tn){a.setThumbnail(tn)};
		if(url){a.setURL(url)}
		temp.push(a);
		return temp;
	}
	if(!desc){return};
	for(var i = 0;i<Math.ceil(desc.length/2000);i++){
		var a = new Discord.RichEmbed();
		a.setColor(0xbc1007);
		if(desc){a.setDescription(desc.slice(i*2000,i*2000+2000));}
		if(title){a.setTitle(title || '');}
		if(auth){a.setAuthor(auth.name,auth.icon);}
		if(tn){a.setThumbnail(tn)};
		if(url){a.setURL(url)}
		if(ts){a.setTimestamp(ts && new Date() || undefined);}
		temp.push(a);
	}
	return temp;
}

global.getAdminRole = function(guild){
	var adminName = Saves.get(guild.id).AdminRole;
	return guild.roles.find('name',adminName);
}

global.getModRole = function(guild){
	var modName = Saves.get(guild.id).ModRole;
	return guild.roles.find('name',modName);
}

global.getIntRank = function(guild,user){
	var gSave = Saves.get(guild.id);
	if(user == null){return 0};
	if(devs.includes(user.id)){
		return 10;
	}
	if(guild.owner.id == user.id){
		return 3;
	}
	if(user.roles.find('name',gSave.AdminRole) || user.hasPermission('ADMINISTRATOR')){
		return 2;
	}
	if(user.roles.find('name',gSave.ModRole) || user.hasPermission('BAN_MEMBERS')){
		return 1;
	}
	return 0;
}

global.getStrRank = function(guild,user){
	var intRank = getIntRank(guild,user);
	return intRank == 0 && "User" || intRank == 1 && "Moderator" || intRank == 2 && "Admin" || intRank == 3 && "Server owner" || intRank > 3 && 'Bot developer';
}

global.SendEmbed = function(obj,embeds){
	if(Array.isArray(embeds)){
		embeds.forEach((index)=>{
			setTimeout(()=>{
				obj.send(undefined,{embed:index});
				logTraffic(obj.id,obj);
			},embeds.indexOf(index)*150);
		});
	}else{
		logTraffic(obj.id,obj);
		obj.send(undefined,{embed:embeds});
	}
}

global.ParseBlacklist = function(m,ur){
	if(!m || !m.guild || ur > 0){return};
	var GuildSave = Saves.get(m.guild.id);
	var ParsedMessage = m.content.replace(/\\/g,'').toLowerCase();
	ParsedMessage = ParsedMessage.replace(/\u0000/g,'')

	if(!GuildSave.Blacklist){
		GuildSave.Blacklist = [];
		Saves.set(m.guild.id,GuildSave);
		console.log('Blacklsit data recovery for '+m.guild.id+' ('+m.guild.name+')');
	}
	for(var i = 0;i < GuildSave.Blacklist.length; i++){
		if(ParsedMessage.indexOf(GuildSave.Blacklist[i]) != -1){
			m.delete();
			SendEmbed(m.author,GetEmbed('','Stop using blacklisted word **'+GuildSave.Blacklist[i]+'** :(',{name:'Alert',icon:Info}));
		}
	}
}

global.AntiBot = function(m){
	if(!m.author.bot){return};
	var GS = Saves.get(m.guild.id)
	if(GS.AntiBot.includes(m.channel.id) && m.author.id != Bot.user.id){
		m.delete();
	}
}

global.ParsePM = function(m){
	if(m.author.id == "147176715880235008"){
		if(m.attachments.array().length>0){
			Download(m.attachments.array()[0]);
			if(m.attachments.array()[0].filename == 'bot.js'){
				Execute('node '+__dirname+'\\bot.js',()=>{
					console.log('Restarting');
					//m.author.sendMessage('Restarting');
					setTimeout(process.exit,150);
				}).unref();
			}
		}
	}
}

global.ParseCommand = function(m){
	if(!m.guild || !m.guild.id || !m.guild.name || !m.content || !m.author || !m.author.id){return};
	if(!m.guild.available){console.log(m.guild,'not available');return;}
	verifySave(m.guild.id,m.guild.name);
	AntiBot(m)
	if(m.author.bot){return};
	var GuildSave = Saves.get(m.guild.id);
	var Prefix = GuildSave.Prefix;
	var UserRank = getIntRank(m.guild,m.guild.member(m.author.id));
	antiInvite(m,UserRank);
	ParseBlacklist(m,UserRank);
	var firstWord = m.content.toLowerCase().split(' ')[0]
	for(var i = 0;i<Commands.length;i++){
		var Command = Commands[i];
		var Name = Command[0];
		var Rank = Command[1];
		Rank = Rank == undefined && 10 || Rank == 'sowner' && 3 || Rank == 'admin' && 2 || Rank == 'mod' && 1 || Rank == 'user' && 0;
		var Func = Command[2];
		if(firstWord == Prefix+Name){
			if(Rank <= UserRank){
				var Content = m.content.replace(new RegExp(firstWord+' ?', 'g'),'')
				Args = Content.split(' ');
				m.mentions.users.map((u)=>{
					if(!m.guild.member(u)){
						m.guild.fetchMember(u.id);
					}
				})
				Func(Content,Args,UserRank,m);
			}else{

			}
		}
	}
	if(m.isMentioned('284076996470767636')){
		SendEmbed(m.author,GetEmbed('Information',`
			**Prefix: **${Prefix}
		`))
	}
}
