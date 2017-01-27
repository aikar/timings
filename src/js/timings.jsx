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

import UI from "./UI";
import checkHash from "./hash";
import "./jquery.query";
import React from "react";
import ReactDOM from "react-dom";
import {initializeAds} from "./ui/Advertisement";
import ContentWrapper from "./ui/ContentWrapper";
import * as phpjs from "phpjs";
import TimingRow from "./ui/TimingRow"

phpjs.registerGlobals();
window.phpjs = phpjs;
window.reportType = 'lag';

(function() {
	ReactDOM.render(<ContentWrapper />, document.getElementById("wrapper"));
	UI.initializeUI();
	data.loadData();
	data.onReady(() => $(window).on('hashchange', checkHash));
	initializeAds();
})();

