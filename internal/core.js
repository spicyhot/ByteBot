Bot.on('guildCreate',(guild)=>{
	if((guild.members.filter(u => u.user.bot).size / guild.members.size * 100)>30 || guild.members.size < 5){guild.leave()}else{

	if(Saves.get(guild.id)){
		guild.owner.sendMessage(`
			Welcome back!
			**Bot was in server previously, saved data was recovered**
			**Prefix: ** ${Saves.get(guild.id).Prefix}
		`)
	}else{
		Saves.set(guild.id,DefaultSave);
	}
	}
});
Bot.on('messageUpdate',(_,m)=>{
	if(!m || !m.guild || m.author.bot || _.content == m.content){return};
	ParseBlacklist(m)
	Log(m.guild,GetEmbed(``,`**${m.author.username}#${m.author.discriminator}**'s message was edited in ${m.channel}:\n**Before:** ${_.content}\n**After: **${m.content}`,{name:'Message edited',icon:Info},true))
})
Bot.on('messageDelete',(m)=>{
	if(!m || !m.guild || m.author.bot){return}
	Log(m.guild,GetEmbed(``,`**${m.author.username}#${m.author.discriminator}**'s message was deleted in ${m.channel}: ${m.content}`,{name:'Message deleted',icon:Info},true))
})
Bot.on('guildMemberAdd',(m)=>{
	if(!m.guild){return};
	if((m.guild.members.filter(u => u.user.bot).size / m.guild.members.size * 100)>30 || m.guild.members.size < 5){m.guild.leave()}
	var GS = Saves.get(m.guild.id);
	var Mutes = GS.Mutes
	for(var i = 0;i<GS.Mutes.length;i++){
		if(Mutes[i][0] == m.id){
			var server = m.guild;
			if(server.channels.array().length < 20){
				server.channels.map((chan)=>{
					chan.overwritePermissions(m,{SEND_MESSAGES:false});
				})
			}
		}
	}
	Log(m.guild,GetEmbed(``,`**User joined: **${m.user.username}#${m.user.discriminator}`,{name:'User joined',icon:Info},true))
})
Bot.on('guildMemberRemove',(m)=>{
	Log(m.guild,GetEmbed(``,`**User left: **${m.user.username}#${m.user.discriminator}`,{name:'User left',icon:Info},true))
})
Bot.on('guildBanAdd',(g,m)=>{
	Log(g,GetEmbed(``,`**User banned: **${m.username}#${m.discriminator}`,{name:'User banned',icon:Info},true))
})
Bot.on('guildBanRemove',(g,m)=>{
	Log(g,GetEmbed(``,`**User unbanned: **${m.username}#${m.discriminator}`,{name:'User unbanned',icon:Info},true))
})
Bot.on('roleCreate',(m)=>{
	Log(m.guild,GetEmbed(``,`**Role added: **#${m.name}`,{name:'Role created',icon:Info},true))
})
Bot.on('roleDelete',(m)=>{
	Log(m.guild,GetEmbed(``,`**Role removed: **#${m.name}`,{name:'Role removed',icon:Info},true))
})
Bot.on('guildMemberUpdate',(o,n)=>{
	var rB = o.roles.array().length;
	var rA = n.roles.array().length;
	if(rB != rA){
		Log(o.guild,GetEmbed(``,`**${o.user.username}#${o.user.discriminator}'s roles have changed! **
		**Before:** ${o.roles.array().join(', ')}

		**After: ** ${n.roles.array().join(', ')}`,{name:'Roles updated',icon:Info},true))
	}
})



Bot.on('ready', ()=>{
	console.log("Logged in as "+Bot.user.username);
	Bot.user.setPresence({ game: { name: 'Say -help for cmds [In '+Bot.guilds.size+' servers]', type: 0 } });
	setInterval(()=>{
		Bot.user.setPresence({ game: { name: 'Say -help for cmds [In '+Bot.guilds.size+' servers]', type: 0 } });
	},60000*10);
});



setInterval(function(){
	Bot.guilds.map((guild)=>{
		verifySave(guild);
		var Warns = Saves.get(guild.id).Warns;
		var Mutes = Saves.get(guild.id).Mutes;
		for(var i = 0;i<Warns.length;i++){
			var Profile = Warns[i];
			Profile[4] -= 1
			if(Profile[4] <= 0){
				Warns.splice(Warns.indexOf(Profile),1);
				Log(guild,GetEmbed('','**'+Profile[1]+'** was removed from warns',{name:'Warn log',icon:Info}));
				i--; //Spliced from array- move back down to prevent skipping
			}
		}
		for(var i = 0;i<Mutes.length;i++){
			var Profile = Mutes[i];
			Profile[2] -= 1
			if(Profile[2] <= 0){
				Mutes.splice(Mutes.indexOf(Profile),1);
				Mute(guild,Profile[0],undefined,false);
				Log(guild,GetEmbed('','**'+Profile[1]+'** was unmuted',{name:'Mute log',icon:Info}));
				i--; //Spliced from array- move back down to prevent skipping
			}
		}
		var S = Saves.get(guild.id);
		S.Warns = Warns;
		S.Mutes = Mutes;
		Saves.set(guild.id,S);
	})
},60000);

Bot.on('message', (m)=>{ParseCommand(m)});
