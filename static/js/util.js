
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

function updateRanges(start, end) {
	var startDate = new Date(start * 1000);
	var endDate = new Date(end * 1000);

	$('#start-time').text(startDate.toLocaleString());
	$('#end-time').text(endDate.toLocaleString());
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



function getQueryParam(name, def) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		results = regex.exec(location.search);
	return results === null ?
		def
		:
		decodeURIComponent(results[1].replace(/\+/g, " "));
}

function showInfo(btn) {
	$("#info-" + $(btn).attr('info')).dialog({width: "80%", modal: true});
}

function toggleTimings($parent) {
	var $c = $parent.find('> .row-wrap > .expand-control').first();
	if ($parent.data('shown')) {
		$parent.find('> .children').first().hide();
		$parent.data('shown', 0);
		$parent.addClass('show-children');
		$c.html('[+]');
	} else {
		$parent.find('> .children').first().show();
		$parent.data('shown', 1);
		$parent.removeClass('show-children');
		$c.html('[-]');
	}
}
