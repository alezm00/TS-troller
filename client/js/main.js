
let currentSelectedUser = 0
let currentSelectedServer = 1




function saveApikeyHost() {
	let key = $('#apikeyinput').val()
	let host = $('#hostinput').val()
	if (host == '') return $('#hostinput').addClass('border-danger')
	if (key == '') return $('#apikeyinput').addClass('border-danger')
	localStorage.setItem('apikey',window.btoa(key))
	localStorage.setItem('host',host)
	$('#apihostmodal').modal('hide')
	loadServers()
}
function resetapi() {
	localStorage.removeItem('apikey')
	localStorage.removeItem('host')
	setupApiHost()
}
let oldsection = "home";
function sectionChange(section) {
	if (oldsection == section) return
	$('#'+oldsection).toggleClass('d-none')
	$('#'+section).toggleClass('d-none')
	oldsection = section;
}


function loadServers() {
	
	socket.emit('serverlist',{
		apikey:window.atob(localStorage.getItem('apikey')),
		serverhost:localStorage.getItem('host'),
	})
	socket.on('serverlist',(data) => {
		if (checkerrors(data)) return
		$('#serverlist').html('')
		$('#serverlist').append(new Option("Select Server","np",true))
		data.body.forEach(element => {
			$('#serverlist').append(new Option(`${element.virtualserver_name} | ${element.virtualserver_port}`,element.virtualserver_id))
		});
	})
	$('#serverlist').change(() => {	
		let value = $('#serverlist').val()
		if (value != "np") {
			currentSelectedServer = value
		}
		loadClients()
	})
};


function loadClients() {
	socket.emit('clientlist',{
		apikey:window.atob(localStorage.getItem('apikey')),
		serverhost:localStorage.getItem('host'),
		serverid:currentSelectedServer,
	})
	socket.on('clientlist',(data) => {
		if (checkerrors(data)) return
		$('.clientlist-fill').each((i,el) => {$(el).html('')})
		$('.clientlist-fill').each((i,el) => {
			data.body.forEach(element => {
				if (element.client_nickname != "serveradmin") {
					$(el).append(new Option(`${element.client_nickname} | ${element.clid}`,element.clid))
				}
			});
		})
	})
	$('.clientlist-fill').each((i,el) => {$(el).change(() => {	
			currentSelectedUser = $(el).val()
		})
	})
}

function renamemyself() {
	$('#renamemyself').modal()
}


function renamemyselfConfirm() {
	let newname = $('#renamemyselfinput').val()
	if (newname == '') return $('#renamemyselfinput').addClass('border-danger')
	socket.emit('renamemyself',{
		apikey:window.atob(localStorage.getItem('apikey')),
		serverhost:localStorage.getItem('host'),
		serverid:currentSelectedServer,
		newname:newname
	})
	socket.on('renamemyself',(data) => {
		if (checkerrors(data)) return
		$('#renamemyself').modal("hide")
		message('Name changed succefully')
	})
}



function setupApiHost() {
	const apikey = localStorage.getItem('apikey')
	const host = localStorage.getItem('host')
	if (!apikey || !host) {
		$('#apihostmodal').modal({
			keyboard: false,
			backdrop: 'static'
		})
		return
	}
	loadServers()
}
setupApiHost()

