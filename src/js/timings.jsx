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
import "./jquery.query";
import React from "react";
import ReactDOM from "react-dom";
import Header from "./ui/Header";
import Footer from "./ui/Footer";
import ContentTop from "./ui/ContentTop";


(function() {
	data.initializeData();
	ads.initializeAds();
	if (!timingsData || (Array.isArray(timingsData) && !timingsData.length)) {
		window.timingsData = null;
		return;
	}
	ui.initializeUI();
	hash.checkHashLoc();
	$(window).on('hashchange', hash.checkHashLoc);
})();

ReactDOM.render(<Header />, document.getElementById("header"));
ReactDOM.render(<ContentTop />, document.getElementById("content-top"));
ReactDOM.render(<Footer />, document.getElementById("footer"));
