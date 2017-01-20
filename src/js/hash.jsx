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
import {toggleTimings} from "./ui";
window.keepScroll = false;
export function checkHashLoc() {
	let hash = location.hash;
	if (!hash || hash.length < 2) {
		return;
	}

	let el = $(hash);
	if (!el || !el.length) {
		return;
	}
	toggleTimings(el);

	do {
		for (let i = 0; i < 3; i++) {
			if (el) {
				el = el.parent();
			}
		}
		if (el && el.find('> .row-wrap > .expand-control').length) {
			toggleTimings(el);
		} else {
			break;
		}
	} while (el);
	if (window.keepScroll !== false) {
		document.body.scrollTop = window.keepScroll;
		console.log("reset scroll", window.keepScroll)
		window.keepScroll = false;
	} else {
		$('html, body').animate({
			scrollTop: $(hash).offset().top - 45
		}, 500);
	}
}
