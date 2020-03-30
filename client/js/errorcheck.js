function checkerrors(data) {
	if (data.status.code != 0) {
		$('#main-error').text(`${data.status.message} | (${data.status.code})`)
		$('#main-error').toggleClass("d-none")
		setTimeout(() => {
			$('#main-error').toggleClass("d-none")
		}, 5000);
		return true
	}
	return false
}

function message(text) {
	$('#main-message').text(text)
	$('#main-message').toggleClass("d-none")
	setTimeout(() => {
		$('#main-message').toggleClass("d-none")
	}, 5000);
}
