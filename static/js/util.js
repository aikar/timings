
function chart(id) {
	return new Chart($(id).get(0).getContext("2d"));
}

function getMin(array) {
	return Math.min.apply(Math, array);
}

function getMax(array) {
	return Math.max.apply(Math, array);
}

function htorgba(hex, alpha) {
	if (alpha == undefined) alpha = 1;
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? "rgba(" +
	parseInt(result[1], 16) + "," +
	parseInt(result[2], 16) + "," +
	parseInt(result[3], 16) + "," + alpha + ")"
		: hex;
}

function initializeAds() {
	var adCount = $('.adsbygoogle').length;
	if (adCount) {
		$('<script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js">').appendTo("body");

		for (var i = 0; i < adCount; i++) {
			(window.adsbygoogle = window.adsbygoogle || []).push({});
		}
	}
}
