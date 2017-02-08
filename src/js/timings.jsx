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

import React from "react";
import ReactDOM from "react-dom";
import ContentWrapper from "./ui/ContentWrapper";
import "./globals";

(function() {
	ReactDOM.render(<ContentWrapper />, document.getElementById("wrapper"));
	return data.loadData();
})();

