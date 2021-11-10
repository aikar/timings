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

import Header from "./Header";
import Footer from "./Footer";
import Advertisement from "./Advertisement";
import Content from "./Content";
import ContentTop from "./ContentTop";
import ErrorDisplay from "./ErrorDisplay";

export default class ContentWrapper extends React.Component {
  render() {
    return <div>
      <Header />
      <div id="body-wrap">
        <div className="dev-warning"><strong>Please do not ask for help with timings on the SpigotMC forums or in the Spigot Discord</strong></div>


        <ContentTop/>

        <div id="top-ad">
          <Advertisement adId="top"/>
        </div>

        <ErrorDisplay />
        <Content/>

        <div id="bottom-ad">
          <Advertisement adId="bottom"/>
        </div>
      </div>
      <div className="push" style={{clear: "left"}}></div>
      <Footer/>
    </div>;
  }
}
