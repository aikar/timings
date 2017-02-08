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

import React from "react";
const adMap = {
	bottom: 2697476978,
	top: 8082511770,
	link: 2035978176
};
export default function Advertisement(props) {
	const attr = {
		"data-ad-client": "ca-pub-9196273905174409",
		"data-ad-slot": adMap[props.adId]
	};
	(window.adsbygoogle = window.adsbygoogle || []).push({});
	setTimeout(() => {
		const adEl = document.createElement('script');
		adEl.setAttribute('async', "async");
		adEl.setAttribute('type', 'text/javascript');
		adEl.setAttribute('src', "//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js");
		document.body.appendChild(adEl);
	}, 500);
	const adClass = (props.adId === "link" ? "ad_links" : "responsive-ad");
	return (<ins className={"adsbygoogle " + adClass} style={{display:"inline-block"}} {...attr} />);
}
