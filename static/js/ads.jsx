
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

export function initializeAds() {
	setTimeout(() => {
		const adCount = $('.adsbygoogle').length;
		if (adCount) {
			let ad = <script async="async" src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>;
			document.body.append(ad);

			for (let i = 0; i < adCount; i++) {
				(window.adsbygoogle = window.adsbygoogle || []).push({});
			}
		}
	}, 1000);
}
