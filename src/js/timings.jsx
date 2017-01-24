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
import ContentWrapper from "./ui/ContentWrapper";
import es7shim from "es7-shim";
es7shim.shim();

(function() {
	ReactDOM.render(<ContentWrapper />, document.getElementById("wrapper"));
	ui.initializeUI();
	data.loadData();
	data.onReady(() => $(window).on('hashchange', hash.checkHashLoc));
	initializeAds();
})();

