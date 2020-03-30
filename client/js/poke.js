let pokermode = "text"
function startPoker() { //clientpoke clid={clientID} msg={text}
	$('#pokerspinner').removeClass('d-none')
	$('#pokerstartbutton').prop('disabled', true);
	socket.emit('spampoker',{
		apikey:window.atob(localStorage.getItem('apikey')),
		serverhost:localStorage.getItem('host'),
		serverid:currentSelectedServer,
		pokermode:$('#pokermode').val(),
		pokercount:$('#count-pokespam').val(),
		pokertext:$('#pokermodeText').val(),
		pokerclient:$('#pokerclientlist').val()
	})
	socket.on('spampoker',(data) => {
		checkerrors(data)
		$('#pokerspinner').addClass('d-none')
		$('#pokerstartbutton').prop('disabled', false);
	})
}


$('#pokermode').change(() => {	
	pokermode = $('#pokermode').val()
})