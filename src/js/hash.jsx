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
import UI from "./UI";
window.keepScroll = false;
export default function checkHash() {
	if (true) {
		return; // TODO: new logic
	}
	let hash = location.hash;
	if (!hash || hash.length < 2) {
		return;
	}

	let el = $(hash);
	if (!el || !el.length) {
		return;
	}
	UI.toggleTimings(el);

	do {
		for (let i = 0; i < 3; i++) {
			if (el) {
				el = el.parent();
			}
		}
		if (el && el.find('> .row-wrap > .expand-control').length) {
			UI.toggleTimings(el);
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
