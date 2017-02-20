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

(function(doc,script,el,first){
  window['GoogleAnalyticsObject'] = 'ga';
  window['ga'] = window['ga'] || function () {
      (window['ga'].q = window['ga'].q || []).push(arguments)
  };
  window['ga'].l = 1 * new Date();
  el = doc.createElement(script);
  first = doc.getElementsByTagName(script)[0];
  el.async = 1;
  el.src = 'https://www.google-analytics.com/analytics.js';
  first.parentNode.insertBefore(el, first)
})(document, 'script');

ga('create', 'UA-6236119-3', 'auto');
ga('send', 'pageview');


(function() {
	ReactDOM.render(<ContentWrapper />, document.getElementById("wrapper"));
	return data.loadData();
})();
