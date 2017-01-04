

/*
 * Copyright (c) (2017) - Aikar's Minecraft Timings Parser
 *
 *  Written by Aikar <aikar@aikar.co>
 *    + Contributors (See AUTHORS)
 *
 *  http://aikar.co
 *  http://starlis.com
 *
 *  @license MIT
 *
 */

import $ from 'jquery';
import data from './data.jsx';

export function initializeTimeSelector() {
	let start = data.start;
	let end = data.end;
	let values = data.ranges;

	const times = [];
	for (let t of values) {
		if (times.indexOf(t) == -1) {
			times.push(t);
		}
	}

	const $timeSelector = $('#time-selector');
	$timeSelector.slider({
		min: 0,
		max: times.length - 1,
		values: [times.indexOf(start), times.indexOf(end)],
		range: true,
		slide: function (event, ui) {
			start = times[ui.values[0]];
			end = times[ui.values[1]];
			updateRanges(start, end);
		}
	});
	$timeSelector.on('slidestart', clearRedirectTimer);
	$timeSelector.on('slidechange', redirectToNewTimeRange);

	updateRanges(start, end);

	let redirectTimer = 0;

	function clearRedirectTimer() {
		if (redirectTimer) {
			clearTimeout(redirectTimer);
			redirectTimer = 0;
		}
	}

	function redirectToNewTimeRange() {
		clearRedirectTimer();
		redirectTimer = setTimeout(function () {
			window.location = $.query.set("start", start).set("end", end).toString();
		}, 1500);
	}
}

export function updateRanges(start, end) {
	var startDate = new Date(start * 1000);
	var endDate = new Date(end * 1000);

	$('#start-time').text(startDate.toLocaleString());
	$('#end-time').text(endDate.toLocaleString());
}
