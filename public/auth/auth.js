window.onload = () => {
	const url = new URL(window.location.href);
	console.log(url.searchParams.get("token"))
	if (url.searchParams.get("token")) {
		localStorage.setItem("token", url.searchParams.get("token"));
		window.location.href = `${url.protocol}//${url.host}/auth`;
	}
}

function generateRandomString() {
	let randomString = '';
	const randomNumber = Math.floor(Math.random() * 10);

	for (let i = 0; i < 20 + randomNumber; i++) {
		randomString += String.fromCharCode(33 + Math.floor(Math.random() * 94));
	}

	return randomString;
}
