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

export default class query {
	// source: https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
	static get(name, url = window.location.href) {
		name = name.replace(/[\[\]]/g, "\\$&");
		const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, " "));
	}

	// source: https://stackoverflow.com/questions/5999118/add-or-update-query-string-parameter
	static update(key, value, url = window.location.href) {
		const re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
		const separator = url.indexOf('?') !== -1 ? "&" : "?";
		if (url.match(re)) {
			return url.replace(re, '$1' + key + "=" + value + '$2');
		}
		else {
			return url + separator + key + "=" + value;
		}
	}

}
