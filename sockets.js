//fetch
const get = require('./js/get');

//dictionaries
const randomWords = require('random-words');
const listIta60000 = require('./lists/60000_parole');


// Function to check the formattin of the hostname
function checkHost(serverhost) {
	if (!serverhost.endsWith('/')) {
        serverhost = `${serverhost}/`
	}
	if (!serverhost.startsWith('http://') || !serverhost.startsWith('https://')) {
		serverhost = `http://${serverhost}`
	}
	return serverhost;
}



// sockets
module.exports = (io) => {
	//Setup socket connection
	let commands = io.of('/c')
	commands.on('connection',(from) => {
		console.log('User connected')


		//rename bot
		from.on('renamemyself',(data) => {
			let {apikey,serverhost,serverid,newname} = data
			console.log(`Rename request nename: ${newname}`)
			serverhost = checkHost(serverhost);
			get(apikey,serverhost,`clientupdate?client_nickname=${newname}`,serverid).then(data => {
				from.emit('renamemyself',data)
			})
		})
		//get servers list
		from.on('serverlist',(data) => {
			let {apikey,serverhost} = data
			console.log('Server list request')
			serverhost = checkHost(serverhost);
			get(apikey,serverhost,"serverlist").then(data => {
				from.emit('serverlist',data)
			})
		})
		//get client list
		from.on('clientlist',(data) => {
			let {apikey,serverhost,serverid} = data
			console.log('Client list request')
			serverhost = checkHost(serverhost);
			get(apikey,serverhost,"clientlist",serverid).then(data => {
				from.emit('clientlist',data)
			})
		})
		from.on('spampoker',async (data) => {
			let {apikey,serverhost,serverid,pokermode,pokercount,pokertext,pokerclient} = data
			console.log(`Pokerspammer started: who:${pokerclient} | ${pokermode} | count: ${pokercount} | text: ${pokertext}`)
			serverhost = await checkHost(serverhost);
			if (pokercount > 500) {
				from.emit('spampoker',{body:[],status:{code:1,message:"Too much pokes"}})
				return
			}
			
			for (let i = 0; i < pokercount; i++) {
				switch (pokermode) {
					case "randomwordsEN":
							pokertext = randomWords()
						break;
					case "randomwordsIT":
							pokertext = listIta60000[Math.floor(Math.random() * listIta60000.length)]
						break;
					case "randomNumbers":
							pokertext = Math.floor(Math.random() * 9999999)
							pokertext = `${pokertext}${pokertext}${pokertext}${pokertext}${pokertext}${pokertext}${pokertext}`
						break;
					case "randomchars":
							pokertext = ""
							for (let i = 0; i < 100; i++) {
								pokertext += String.fromCharCode((Math.floor(Math.random() * 25)) +65)
							}
						break;
					default:
						break;
				}
				let a = await get(apikey,serverhost,`clientpoke?clid=${pokerclient}&msg=${pokertext}`,serverid).then(data => {
					if (data.status.code != 0) {
						from.emit('spampoker',data)
						return true
					}
					return false
				})
				if (a) return
			}
			from.emit('spampoker',{body:[],status:{code:0,message:""}})
		})
		from.on('mover',async (data) => {
			let {apikey,serverhost,serverid,moveruser,movermode,movercount} = data
			console.log('mover request')
			serverhost = await checkHost(serverhost);
			if (movercount > 500) {
				from.emit('mover',{body:[],status:{code:1,message:"Too much moves"}})
				return
			}
			let channellist = await get(apikey,serverhost,"channellist",serverid).then((data) => {return data})
			let channelid = 0
			if (movermode == "carousel") {
				for (let i = 0; i < channellist.body.length; i++) {
					channelid = channellist.body[i].cid;
					let a = await get(apikey,serverhost,`clientmove?clid=${moveruser}&cid=${channelid}`,serverid).then(data => {
						if (data.status.code != 0) {
							if (data.status.code == 770) return false
							from.emit('mover',data)
							return true
						}
						return false
					})
					if (a) return
					await new Promise(r => setTimeout(r, 200));	
				}
				for (let i = channellist.body.length - 1; i >= 0; i--) {
					channelid = channellist.body[i].cid;
					let a = await get(apikey,serverhost,`clientmove?clid=${moveruser}&cid=${channelid}`,serverid).then(data => {
						if (data.status.code != 0) {
							if (data.status.code == 770) return false
							from.emit('mover',data)
							return true
						}
						return false
					})
					if (a) return
					await new Promise(r => setTimeout(r, 200));	
				}
			} else {
				for (let i = 0; i < movercount; i++) {
					switch (movermode) {
						case "random":
								channelid = channellist.body[Math.floor((Math.random() * channellist.body.length))].cid
							break;
					
						default:
							break;
					}
					if (channelid == 0 ) {
						from.emit('mover',{body:[],status:{code:1,message:"Channel not found"}})
						return
					}
					let a = await get(apikey,serverhost,`clientmove?clid=${moveruser}&cid=${channelid}`,serverid).then(data => {
						if (data.status.code != 0) {
							if (data.status.code == 770) return false
							from.emit('mover',data)
							return true
						}
						return false
					})
					if (a) return
					await new Promise(r => setTimeout(r, 200));
				}
			}
			from.emit('mover',{body:[],status:{code:0,message:""}})
		})
	})
	
};
