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

export default class ThemeChooser extends React.PureComponent {

	constructor(props) {
		super(props);
		this.themes = process.env.TIMINGS_THEMES;
	}

	render() {
		return (<div className="section themes">
			<div className="section-head">
				<span className="section-title">Choose a style</span>
			</div>
			{this.themes.map((theme) => (
				<div key={theme} title={theme}
					className={"theme-icon theme-" + theme}
					onClick={() => {
						setCookie('timings-theme', theme, 999);
						window.location.reload();
					}}
				>

					<div className="theme-bg"></div>
					<div className="theme-accent"></div>
					<div className="theme-base"></div>
				</div>
			))}
		</div>);
	}
}


function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	var expires = "expires="+ d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
