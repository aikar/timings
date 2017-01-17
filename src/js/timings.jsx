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

import styles from "../css/timings.scss"

$(document).ready(function () {
	data.initializeData();
	ui.initializeUI();
	ads.initializeAds();
	hash.checkHashLoc();
	$(window).on('hashchange', hash.checkHashLoc);
});
