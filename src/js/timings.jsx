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
"use strict";

import * as data from './data';
import * as ads from "./ads";
import * as ui from "./ui";
import * as hash from "./hash";

$(document).ready(function () {
	data.initializeData();
	ui.initializeUI();
	ads.initializeAds();
	hash.checkHashLoc();
	$(window).on('hashchange', hash.checkHashLoc);
	$('.themes .theme-icon').click(function() {
		const theme = $(this).data('theme');
		setCookie('timings-theme', theme, 999);
		window.location.reload();
	})
});

function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	var expires = "expires="+ d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
