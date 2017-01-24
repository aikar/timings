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

import data from './data';
import {initializeAds} from "./ui/Advertisement";
import * as ui from "./ui";
import * as hash from "./hash";
import "./jquery.query";
import React from "react";
import ReactDOM from "react-dom";
import Header from "./ui/Header";
import Footer from "./ui/Footer";
import ContentWrapper from "./ui/ContentWrapper";
import entries from "object.entries";
entries.shim();

(function() {
	ReactDOM.render(<Header />, document.getElementById("header"));
	ReactDOM.render(<ContentWrapper />, document.getElementById("wrapper"));
	ReactDOM.render(<Footer />, document.getElementById("footer"));
	ui.initializeUI();
	data.loadData();
	data.onReady(() => $(window).on('hashchange', hash.checkHashLoc));
	initializeAds();
})();

