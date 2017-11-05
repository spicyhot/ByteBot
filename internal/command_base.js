Commands = [];



AddCommand('eval', undefined, '[code] (for debugging purposes)',(msg,args,userrank,m)=>{
	var x;
	try{x = eval(msg);}catch(e){x = e;}
	var l = new Discord.RichEmbed();
	l.setTitle('Evaluated code');
	l.setDescription(x);
	l.setColor(0xbc1007);
	m.channel.sendEmbed(l);
});
AddCommand('set', 'admin', '[prefix/logs/mod/admin] [value/channel]\n(configures options for the bot)\nex: -set prefix : | -set mod "rolename" | -set logs #channel', (msg,args,userrank,m)=>{
	if(args[0].toLowerCase() == 'prefix'){
		var prefix = args[1] || '-';
		var saves = Saves.get(m.guild.id);
		saves.Prefix = prefix;
		Saves.set(m.guild.id,saves);
		SendEmbed(m.channel, GetEmbed("Updated prefix", " \n**new prefix is: ** "+prefix));
	}else if(args[0].toLowerCase() == 'logs'){
		if(m.mentions.channels.array()[0]){
			var l = m.mentions.channels.array()[0];
			var saves = Saves.get(m.guild.id);
			saves.LogChannel = l.id;
			Saves.set(m.guild.id,saves);
			SendEmbed(m.channel, GetEmbed("Updated log channel", " \n**new log channel is: ** #"+l.name));
		}else{
			SendEmbed(m.author,GetEmbed('Invalid set usage, ex: -set logs #channel'))
		}
	}else if(args[0].toLowerCase() == 'mod'){
		var role = GetBetweenCapture(msg);
		if(role){
			var saves = Saves.get(m.guild.id);
			saves.ModRole = role;
			Saves.set(m.guild.id,saves);
			SendEmbed(m.channel, GetEmbed("Updated moderator role", " \n**new role is: ** "+role));
		}else{
			SendEmbed(m.author,GetEmbed('Invalid set usage, ex: -set mod "RoleName" | [make sure to keep quotations around the role name]'))
		}
	}else if(args[0].toLowerCase() == 'admin'){
		var role = GetBetweenCapture(msg);
		if(role){
			var saves = Saves.get(m.guild.id);
			saves.AdminRole = role;
			Saves.set(m.guild.id,saves);
			SendEmbed(m.channel, GetEmbed("Updated administrator role", " \n**new role is: ** "+role));
		}else{
			SendEmbed(m.author,GetEmbed('Invalid set usage, ex: -set admin "RoleName" | [make sure to keep quotations around the role name]'))
		}
	}
})

AddCommand('add','admin','[admin/mod] [member]\n(gives the selected member the admin/mod role',(msg,args,userrank,m)=>{
	var user = m.mentions.users.array()[0]
	if(!user){
		SendEmbed(m.author,GetEmbed('Invalid add usage, ex: -add admin @User#1111'))
	}
	if(args[0].toLowerCase() == 'admin' && userrank >= 3){
		if(user){
			if(getAdminRole(m.guild)){
				m.guild.member(user).addRole(getAdminRole(m.guild));
				SendEmbed(m.channel,
					GetEmbed(``,
						`**${user.username.toString()}#${user.discriminator.toString()}** is now an admin!`,
						{name:'New administrator',icon:'http://i.imgur.com/fw7e0Yv.png'}
					)
				);
				Log(m.guild,GetEmbed(``,`**${user.username.toString()}#${user.discriminator.toString()}** is now an admin!`,{name:'New administrator',icon:'http://i.imgur.com/fw7e0Yv.png'},true))

			}else{
				SendEmbed(m.author,GetEmbed('Server has no admin role (view in -config and set with -set admin "RoleName")'));
			}
		}
	}else if(args[0].toLowerCase() == 'mod'){
		if(user){
			if(getModRole(m.guild)){
				m.guild.member(user).addRole(getModRole(m.guild));
				SendEmbed(m.channel,
					GetEmbed(``,
						`**${user.username}#${user.discriminator}** is now a moderator!`,
						{name:'New moderator',icon:'http://i.imgur.com/fw7e0Yv.png'}
					)
				);
				Log(m.guild,GetEmbed(``,`**${user.username}#${user.discriminator}** is now a moderator!`,{name:'New moderator',icon:'http://i.imgur.com/fw7e0Yv.png'},true));
			}else{
				SendEmbed(m.author,GetEmbed('Server has no moderator role (view in -config and set with -set mod "RoleName")'));
			}
		}
	}else{
		SendEmbed(m.author,GetEmbed('Invalid add usage, ex: -add admin/mod @User#1111'))
	}
})
AddCommand('remove','admin','[admin/mod] [member]\n(tries to remove the member\'s admin/mod role', (msg,args,userrank,m)=>{
	var user = m.mentions.users.array()[0]
	if(!user){
		SendEmbed(m.author,GetEmbed('Invalid remove usage, ex: -remove admin @User#1111'))
		return;
	}
	if(args[0].toLowerCase() == 'admin' && userrank >= 3){
		if(user){
			if(getAdminRole(m.guild)){
				m.guild.member(user).removeRole(getAdminRole(m.guild));
				SendEmbed(m.channel,
					GetEmbed(``,
						`**${user.username.toString()}#${user.discriminator.toString()}** is no longer an admin!`,
						{name:'Removed administrator',icon:'http://i.imgur.com/fw7e0Yv.png'}
					)
				);
				Log(m.guild,GetEmbed(``,`**${user.username.toString()}#${user.discriminator.toString()}** is no longer an admin!`,{name:'Removed administrator',icon:'http://i.imgur.com/fw7e0Yv.png'},true))

			}else{
				SendEmbed(m.author,GetEmbed('Server has no administrator role (view in -config and set with -set admin "RoleName")'));
			}
		}
	}else if(args[0].toLowerCase() == 'mod'){
		if(user){
			if(getModRole(m.guild)){
				m.guild.member(user).removeRole(getModRole(m.guild));
				SendEmbed(m.channel,
					GetEmbed(``,
						`**${user.username}#${user.discriminator}** is no longer a moderator!`,
						{name:'Removed moderator',icon:'http://i.imgur.com/fw7e0Yv.png'}
					)
				);
				Log(m.guild,GetEmbed(``,`**${user.username}#${user.discriminator}** is no longer a moderator!`,{name:'Removed moderator',icon:'http://i.imgur.com/fw7e0Yv.png'},true));
			}else{
				SendEmbed(m.author,GetEmbed('Server has no moderator role (view in -config and set with -set mod "RoleName")'));
			}
		}
	}else{
		SendEmbed(m.author,GetEmbed('Invalid remove usage, ex: -remove admin @User#1111'))
	}
})
AddCommand('config', 'mod', '\n(views the server configuration', (msg,args,userrank,m)=>{
	var config = new Discord.RichEmbed();
	var save = Saves.get(m.guild.id);
	var wD = save.WarnData.SpecificPunish
	var warnDataSend = "";
	warnDataSend += "Warn time: "+save.WarnData.TimeReset+' minutes\n'
	pairs(wD,(i,v)=>{
		if(v.type == 'mute'){
			warnDataSend+="\nWarn #"+i+" mute for "+v.time+' minutes';
		}else{
			warnDataSend+="\nWarn #"+i+" "+v.type;
		}
	})
	var log;
	if(save.LogChannel == '' || !m.guild.channels.get(save.LogChannel)){
		log = "None";
	}else{
		log = '#'+m.guild.channels.get(save.LogChannel).name
	}
	config.setColor(0xbc1007);
	config.addField('Prefix','```'+save.Prefix+'```',true);
	config.addField('Staff roles','```Administrator: '+save.AdminRole+'\nModerator: '+save.ModRole+'```',true);
	config.addField('Log channel','```'+log+'```',true);
	config.addField('Num blacklisted words','```'+save.Blacklist.length+'```',true);
	config.addField('Warns','```'+warnDataSend+'```',true);
	SendEmbed(m.author,config);
})

AddCommand('help','user','\n(lists the bots commands)',(msg,args,userrank,m)=>{

	var server_prefix = Saves.get(m.guild.id).Prefix

	var l = new Discord.RichEmbed();
	for(var i = 0;i<Commands.length;i++){

		var Command = Commands[i];
		var Name = Command[0];
		var Rank = Command[1];
		var Uses = Command[3];
		Rank = Rank == 'sowner' && 'server owner' || Rank;
		if(Rank != undefined){
			l.addField('**'+server_prefix+Name+'** [rank: '+Rank+']', '```'+server_prefix+Name+" "+Uses+'```',true);
		}
	}
	l.setColor(0xbc1007);
	SendEmbed(m.author,l);

});

AddCommand('invite','user','\n(invite for the bot server & bot)',(msg,args,userrank,m)=>{
	SendEmbed(m.author,GetEmbed('Invites','**Bot discord: **[Here](https://discord.gg/jcshnP3)\n**Bot invite: **[Here](https://discordapp.com/oauth2/authorize?client_id=304413844615462913&scope=bot&permissions=2146958591)'))
})

AddCommand('antiinvite','mod','\n(prevents invites from being said)', (msg,args,userrank,m)=>{
	var gSave = Saves.get(m.guild.id)
	gSave.AntiInvite = !gSave.AntiInvite;
	SendEmbed(m.channel, GetEmbed("AntiInvite", " \n**AntiInvite is now: ** "+(gSave.AntiInvite && 'enabled' || 'disabled')));
	Saves.set(m.guild.id,gSave);
})
AddCommand('warnconfig','admin','[warning_number/time] [punishment/number(minutes)]\n(configures warnings) ex:\n-warnconfig 3 mute 30 | mute a user for 30 minutes on warn #3\n-warnconfig 5 kick | kicks a user on warn #5\n-warnconfig 3 none | sets warning 3 to no action\n-warnconfig 7 ban | bans a user on warn#7\n-warnconfig time 720 | add 12 hours every warning until reset', (msg,args,userrank,m)=>{
	var gSave = Saves.get(m.guild.id)
	var warnData = gSave.WarnData.SpecificPunish;
	if(args[0].toLowerCase() == 'time'){
		if(args[1] && !Number.isNaN(Number(args[1]))){
			var nTime = Number(args[1]);
			warnData.TimeReset = nTime;
			gSave.WarnData.TimeReset = warnData.TimeReset;
			Saves.set(m.guild.id,gSave)
			SendEmbed(m.channel, GetEmbed("Updated warn timer", " \nwarn time amount is now: **"+nTime+"** minutes/warn"));
		}else{
			SendEmbed(m.author,GetEmbed('Invalid warnconfig usage, ex: -warnconfig time 720'))
		}
	}
	if(!Number.isNaN(Number(args[0]))){
		if(args[1]){
			var warnNum = Number(args[0]);
			if(args[1].toLowerCase() == 'mute' && !Number.isNaN(Number(args[2]))){
				var warnTime = Number(args[2]);
				warnData[warnNum] = {type:'mute',time:warnTime};
				SendEmbed(m.channel, GetEmbed("Updated warn punishment", " \nWarning #"+warnNum+" punishment amount is now: **mute** for **"+warnTime+"** minutes"));
			}
			if(args[1].toLowerCase() == 'kick'){
				warnData[warnNum] = {type:'kick'};
				SendEmbed(m.channel, GetEmbed("Updated warn punishment", " \nWarning #"+warnNum+" punishment amount is now: **kick**"))
			}
			if(args[1].toLowerCase() == 'ban'){
				warnData[warnNum] = {type:'ban'};
				SendEmbed(m.channel, GetEmbed("Updated warn punishment", " \nWarning #"+warnNum+" punishment amount is now: **ban**"))
			}
			if(args[1].toLowerCase() == 'none'){
				warnData[warnNum] = undefined;
				SendEmbed(m.channel, GetEmbed("Updated warn punishment", " \nWarning #"+warnNum+" punishment was **removed**"))
			}
			gSave.WarnData.SpecificPunish = warnData;
			Saves.set(m.guild.id,gSave)
		}else{
			SendEmbed(m.author,GetEmbed('Invalid warnconfig usage, ex: -warnconfig 4 mute time'))
		}
	}
})


AddCommand('rank','user','\n(tells you your rank)', (msg,args,userrank,m)=>{
	var conversion = getStrRank(m.guild,m.member);
	SendEmbed(m.author, GetEmbed('','Your rank is:\n **'+conversion+'**\n\nIn server **'+m.guild.name+'**',{name: m.author.username, icon: m.author.avatarURL}));
})
/*

Warn syntax
{[
	"123123123123123", //id                                        0
	"name#0000",                                                   1
	['reason1','reason2',reason3'], // reasons                     2
	['name#discrim','name#discrim','name#discrim'] // warnees      3
	Time: 34982,                                                   4
]}

Mute syntax
{[
	"2130498250983512", //id 0
	"name#0000",             1
	5239,                    2
]}

*/
AddCommand('warn','mod','[@User#0000] [Reason]\n(warns a user)',(msg,args,userrank,m)=>{
	var rS = Saves.get(m.guild.id)
	var SavedData = rS.Warns;
	var warnData = rS.WarnData;
	var User = m.mentions.users.array()[0];
	if(!SavedData){
		Saved = Saves.get(m.guild.id)
		if(Saved){
			Saved.Warns = [];
			Saves.set(m.guild.id,Saved);
			SavedData = Saves.get(m.guild.id).Warns;
		}
	}
	if(User){
		var User = m.guild.member(User);
		var GRank = getIntRank(m.guild,User);
		if(GRank < userrank){
			var Raw = args.join(' ');
			var Reason = Raw.replace('<@'+User.id+'>','');
			var Warnee = m.author.username+'#'+m.author.discriminator;
			var Found = false;
			var WarnNum;
			for(var i = 0; i < SavedData.length; i++){
				var Profile = SavedData[i];
				if(Profile[0] == User.id){
					Found = true;
					Profile[2].push(Reason);
					Profile[3].push(Warnee);
					Profile[4] += warnData.TimeReset; //                 Mute(server,user,time,m)
					WarnNum = Profile[2].length;
					if(warnData.SpecificPunish.hasOwnProperty(WarnNum)){
						var punishData = warnData.SpecificPunish[WarnNum];
						if(punishData.type == 'mute'){
							Mute(m.guild,User.user,punishData.time,true);
						}
						if(punishData.type == 'kick'){
							User.kick('Warn #'+WarnNum+' kick');
						}
						if(punishData.type == 'ban'){
							User.ban({days:7,reason:'Warn #'+WarnNum+' ban'});
						}
					}


					// oh my fucking god what was i thinking when i made this
					// bro i wanna die
				}
			}
			if(!Found){
				SavedData.push([
					User.id,
					User.user.username + '#' + User.user.discriminator,
					[Reason],
					[Warnee],
					warnData.TimeReset,
				])
				WarnNum = 1;
			}
			rS.Warns = SavedData;
			Saves.set(m.guild.id,rS);
			SendEmbed(m.author,GetEmbed('','Warned **'+User.user.username+'#'+User.user.discriminator+'** for **'+Reason+'** \n('+WarnNum+'/5)',undefined,undefined,Succ));
			Log(m.guild,GetEmbed('Warn log',Warnee+' warned **'+User.user.username+'#'+User.user.discriminator+'** for **'+Reason+'**\n('+WarnNum+'/5)',undefined,true))
		}
	}else{
		SendEmbed(m.author,GetEmbed('Invalid warn usage, ex: -warn @User reason'));
	}
})
AddCommand('mute','mod','[@User#0000] [minutes(default = forever)]\n(mutes a user for the specified time)',(msg,args,userrank,m)=>{
	var User = m.mentions.users.array()[0];
	var GuildSave = Saves.get(m.guild.id);
	if(User){
		User = m.guild.member(User);
		var Raw = args.join(' ');
		var A = User.nickname || User.user.username;
		var cutMsg = m.cleanContent.replace(A,'');
		var Time = Number(cutMsg.match(/\d+/));
		var MuteeRank = getIntRank(m.guild,User);
		if(!Time){

		}
		if(MuteeRank < userrank){
			Mute(m.guild,User.user,Time,true)
			SendEmbed(m.author,GetEmbed('','Muted **'+User.user.username+'#'+User.user.discriminator+'** for **'+Time+'** minutes',undefined,undefined,Succ));
			Log(m.guild,GetEmbed('','**'+m.author.username+'#'+m.author.discriminator+'** muted **'+User.user.username+'#'+User.user.discriminator+'** for **'+Time+'** minutes',{name:'Mute log',icon:Info},true))
		}else{
			SendEmbed(m.author,GetEmbed('','Your rank is too low to mute **'+User.user.username+'#'+User.user.discriminator+'**!',{name:'Cannot mute user',icon:Fail}))
		}
	}else{
		SendEmbed(m.author,GetEmbed('Invalid mute usage, ex: -mute @User#1111 [time]'))
	}
})
AddCommand('unmute','mod','[@User#0000]\n(unmutes a user)',(msg,args,userrank,m)=>{
	var User = m.mentions.users.array()[0];
	if(User){
		User = m.guild.member(User);
		Mute(m.guild,User,undefined,false)
		SendEmbed(m.author,GetEmbed('','Unmuted **'+User.user.username+'#'+User.user.discriminator+"**",undefined,undefined,Succ));
		Log(m.guild,GetEmbed('','**'+m.author.username+'#'+m.author.discriminator+'** unmuted **'+User.user.username+'#'+User.user.discriminator+'**',{name:'Mute log',icon:Info},true))
	}
})
AddCommand('warns','user','\n(Views all warned players)',(msg,args,userrank,m)=>{
	var GuildSave = Saves.get(m.guild.id);
	var Warns = GuildSave.Warns;
	function formatProfile(profile){
		var name = profile[1];
		var reasons = profile[2].join(', ');
		var warnees = profile[3].join(', ');
		var time = profile[4];
		return `
**==> **${name}
	**Warned by: **${warnees}
	**Reasons: **${reasons}
	**Time left: **${time} minutes
		`
	}
	var send = "";
	for(var i = 0; i < Warns.length;i++){
		var prof = Warns[i];
		var t = formatProfile(prof);
		send += t+'\n'
	}
	SendEmbed(m.author,GetEmbed('',send,{name:'Warns',icon:Info}));
})
AddCommand('blacklist','admin','[word]\n(blacklists a word)',(msg,args,userrank,m)=>{
	var GuildSave = Saves.get(m.guild.id)
	if(!GuildSave.Blacklist){
		GuildSave.Blacklist = [];
		Saves.set(m.guild.id,GuildSave);
		console.log('Blacklsit data recovery for '+m.guild.id+' ('+m.guild.name+')');
	}
	var Word = args.join(' ').toLowerCase();
	if(GuildSave.Blacklist.includes(Word)){
		SendEmbed(m.author,GetEmbed('','**'+Word+'** is already blacklisted!',{name:'Already blacklisted',icon:Fail}))
	}else{
		GuildSave.Blacklist.push(Word);
		Log(m.guild,GetEmbed('','**'+Word+'** was blacklisted by **'+m.author.username+'#'+m.author.discriminator+'**',{name:'Blacklist log',icon:Info},true));
		Saves.set(m.guild.id,GuildSave);
	}
})
AddCommand('unblacklist','admin','[word]\n(unblacklists a word)',(msg,args,userrank,m)=>{
	var GuildSave = Saves.get(m.guild.id)
	if(!GuildSave.Blacklist){
		GuildSave.Blacklist = [];
		Saves.set(m.guild.id,GuildSave);
		console.log('Blacklsit data recovery for '+m.guild.id+' ('+m.guild.name+')');
	}
	var Word = args.join(' ').toLowerCase();
	if(GuildSave.Blacklist.includes(Word)){
		GuildSave.Blacklist.splice(GuildSave.Blacklist.indexOf(Word),1);
		Log(m.guild,GetEmbed('','**'+Word+'** was unblacklisted by **'+m.author.username+'#'+m.author.discriminator+'**',{name:'Blacklist log',icon:Info},true));
		Saves.set(m.guild.id,GuildSave);
	}else{
		SendEmbed(m.author,GetEmbed('','**'+Word+'** is not blacklisted!',{name:'Not blacklisted',icon:Fail}))
	}
})
AddCommand('viewblacklist','user','\n(lists the blacklisted words',(msg,args,userrank,m)=>{
	var GuildSave = Saves.get(m.guild.id)
	var pm = "";
	for(var i = 0;i<GuildSave.Blacklist.length;i++){
		pm += (i+1)+". **"+GuildSave.Blacklist[i]+"**\n"
	}
	SendEmbed(m.author,GetEmbed('',pm,{name:'Blacklisted words',icon:Info}));
})
AddCommand('delwarn','mod','[User#0000]\n(deletes the previous warning for a user)',(msg,args,userrank,m)=>{
	var rS = Saves.get(m.guild.id)
	var SavedData = rS.Warns;
	var User = m.mentions.users.array()[0];
	if(!SavedData){
		Saved = Saves.get(m.guild.id)
		if(Saved){
			Saved.Warns = [];
			Saves.set(m.guild.id,Saved);
			SavedData = Saves.get(m.guild.id).Warns;
		}
	}
	var Found;
	if(User){
		var User = m.guild.member(User);
		for(var i = 0;i<SavedData.length;i++){
			var Profile = SavedData[i];
			if(Profile[0] == User.id){
				Found = true;
				var A = Profile;
				A[2].splice(A[2].length-1,1);
				A[3].splice(A[3].length-1,1);
				A[4] -= rS.WarnData.TimeReset;
				if(A[4] <= 0){
					SavedData.splice(i,1)
				}else{
					SavedData[i] = A;
				}
				rS.Warns = SavedData;
				Saves.set(m.guild.id,rS);
				SendEmbed(m.author,GetEmbed('','Removed a warning for **'+User.user.username+'#'+User.user.discriminator+"**",undefined,undefined,Succ));
				Log(m.guild,GetEmbed('Warn log',m.author.username+'#'+m.author.discriminator+' removed a warning for **'+User.user.username+'#'+User.user.discriminator+"**",undefined,true))
			}
		}
	}
})
AddCommand('antibot','admin','[#Channel]\n(toggles anti bot for the selected channel)',(msg,args,userrank,m)=>{
	var GS = Saves.get(m.guild.id)
	if(!GS.AntiBot){
		GS.AntiBot = [];
		Saves.set(m.guild.id,GS);
		console.log('AntiBot data recovery for '+m.guild.id+' ('+m.guild.name+')');
	}
	var chan = m.mentions.channels.array()[0]
	if(chan){
		if(GS.AntiBot.includes(chan.id)){
			GS.AntiBot.splice(GS.AntiBot.indexOf(chan.id),1)
			SendEmbed(m.channel,GetEmbed('','Bots can now chat in #'+chan.name+'!',{name:'Antibot',icon:Succ}));
			Saves.set(m.guild.id,GS)
		}else{
			GS.AntiBot.push(chan.id)
			SendEmbed(m.channel,GetEmbed('','Bots can no longer chat in #'+chan.name+'!',{name:'Antibot',icon:Succ}));
			Saves.set(m.guild.id,GS)
		}
	}
})

AddCommand('kick','mod','[User#0000] [reason]\n(kicks a user from the server)', (msg,args,userrank,m)=>{
	var User = m.mentions.users.array()[0];
	var GuildSave = Saves.get(m.guild.id);
	if(User){
		User = m.guild.member(User);
		var Raw = args.join(' ');
		var Reason = Raw.replace('<@'+User.id+'>','');
		var KickeRank = getIntRank(m.guild,User);
		if(KickeRank < userrank){
			User.kick(m.author.username+'#'+m.author.discriminator+' kicked for '+Reason || '[no reason given]');
			SendEmbed(m.author,GetEmbed('','You have kicked **'+User.user.username+'#'+User.user.discriminator+'**!',{name:'Kicked user',icon:Succ}))
			Log(m.guild,GetEmbed('',m.author.username+'#'+m.author.discriminator+' kicked **'+User.user.username+'#'+User.user.discriminator+'**!',{name:'Kicked user',icon:Succ},true))
		}else{
			SendEmbed(m.author,GetEmbed('','Your rank is too low to kick **'+User.user.username+'#'+User.user.discriminator+'**!',{name:'Cannot kick user',icon:Fail}))
		}
	}
})

AddCommand('ban','admin','[User#0000] [reason]\n(bans a user from the server)', (msg,args,userrank,m)=>{
	var User = m.mentions.users.array()[0];
	var GuildSave = Saves.get(m.guild.id);
	if(User){
		User = m.guild.member(User);
		var Raw = args.join(' ');
		var Reason = Raw.replace('<@'+User.id+'>','');
		var KickeRank = getIntRank(m.guild,User);
		if(KickeRank < userrank){
			User.ban({days:7,reason:m.author.username+'#'+m.author.discriminator+' banned for '+Reason || '[no reason given]'});
			SendEmbed(m.author,GetEmbed('','You have banned **'+User.user.username+'#'+User.user.discriminator+'**!',{name:'Banned user',icon:Succ}))
			Log(m.guild,GetEmbed('',m.author.username+'#'+m.author.discriminator+' banned **'+User.user.username+'#'+User.user.discriminator+'**!',{name:'Banned user',icon:Succ},true))
		}else{
			SendEmbed(m.author,GetEmbed('','Your rank is too low to kick **'+User.user.username+'#'+User.user.discriminator+'**!',{name:'Cannot ban user',icon:Fail}))
		}
	}
})
AddCommand('prune','mod','optional: {User#0000} [amt]\n(prunes a specific ammount of messages [default 100 msgs])', (msg,args,userrank,m)=>{
	var User = m.mentions.users.array()[0];
	if(User){
		User = m.guild.member(User);
		var A = User.nickname || User.user.username;
		var cutMsg = m.cleanContent.replace(A,'');
		var Amt = Number(cutMsg.match(/\d+/));
		if(!Amt){Amt = 100}
		m.channel.fetchMessages({limit:Amt}).then((msgs)=>{
			msgs.map((M)=>{
				if(M.author.id == User.user.id && M.id != m.id){
					M.delete();
				}
			})
		})
	}else{
		var Amt = Number(m.cleanContent.match(/\d+/));
		if(!Amt){Amt = 100}
		m.channel.fetchMessages({limit:Amt}).then((msgs)=>{
			msgs.map((M)=>{
				if(M.id != m.id){
					M.delete();
				}
			})
		})
	}
})

AddCommand('changelog','user','\n(views changes and updates)',(msg,args,userrank,m)=>{
	var cl = Saves.get('changelog');
	SendEmbed(m.author,GetEmbed('',cl,{name:'Changelog',icon:Info}));
})

AddCommand('wipe',undefined,'\n(wipes saves for the server)',(msg,args,userrank,m)=>{
	Log(m.guild,GetEmbed('','Saves have been reset',{name:'!!!!',icon:Info}));
	Saves.set(m.guild.id,{Prefix: DefaultPrefix,Moderators:[],Admins:[], LogChannel:'',Warns:[],Mutes:[]});
})

AddCommand('update',undefined,'\n(updates the changelog)',(msg,args,userrank,m)=>{
	var changelog = Saves.get('changelog');
	if(!changelog){
		Saves.set('changelog','');
		changelog = '';
	}
	var raw = args.join(' ');
	var version = GetBetweenCapture(raw);
	var updt = raw.replace('"'+version+'"','');
	if(version){
		var str = `
		**==> **${version}
			${updt}


		`
		changelog += str;
		Saves.set('changelog',changelog);
	}
})
AddCommand('restart',undefined,'\n(restarts the bot)',(msg,args,userrank,m)=>{
	Execute('node '+__dirname+'\\bot.js',()=>{
		console.log('Restarting');
		m.author.sendMessage('Restarting');
		setTimeout(process.exit,150);
	}).unref();
})
