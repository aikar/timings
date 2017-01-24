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


import Advertisement from "./Advertisement";
import Content from "./Content";
import ContentTop from "./ContentTop";

export default function ContentWrapper() {
	return <div>
		<div id="body-wrap">
			{/*<div className="dev-warning"><strong>Hey!</strong> This site is still under heavy development.</div>*/}

			<ContentTop/>

			<div id="top-ad">
				<Advertisement adId="top" />
			</div>

			<Content/>

			<div id="bottom-ad">
				<Advertisement adId="bottom" />
			</div>
		</div>
		<div className="push"></div>
	</div>;
}
