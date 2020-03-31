function startMover() { //clientpoke clid={clientID} msg={text}
	if (!$('#moverclientlist').val()) return
	$('#moverspinner').removeClass('d-none')
	$('#moverstartbutton').prop('disabled', true);
	socket.emit('mover',{
		apikey:window.atob(localStorage.getItem('apikey')),
		serverhost:localStorage.getItem('host'),
		serverid:currentSelectedServer,
		moveruser:$('#moverclientlist').val(),
		movermode:$('#movermode').val(),
		movercount:$('#count-mover').val()
	})
	socket.on('mover',(data) => {
		checkerrors(data)
		$('#moverspinner').addClass('d-none')
		$('#moverstartbutton').prop('disabled', false);
	})
}



$('#movermode').change(() => {
	if ($('#movermode').val() == "carousel") {
		$('#count-mover').prop('disabled',true);
	} else {
		$('#count-mover').prop('disabled',false);
	}
})