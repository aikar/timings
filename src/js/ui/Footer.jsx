/*
 * Copyright (c) (2021) - PebbleHost Timings Theme
 *
 *  Written by PebbleHost Team <support@pebblehost.com>
 *    + Contributors (See AUTHORS)
 *
 *  https://pebblehost.com
 *  
 *  See full license at /src/css/themes/LICENSE
 *
 */

import React from "react";
import FA from "./FA";


export default function Footer() {
    return (
        <div id="footer">
            <span id="footer-left">&copy; 2013-{new Date().getFullYear()}
                &nbsp;Starlis LLC&nbsp;&nbsp;&nbsp;&mdash;
                &nbsp;&nbsp;&nbsp;Timings by <a className="attribution-link" target="_blank" href="http://ref.emc.gs/?gas=timingsphp">Aikar</a>&nbsp;&nbsp;&nbsp;&mdash;
                &nbsp;&nbsp;&nbsp;Theme by <a className="attribution-link" target="_blank" href="https://pebblehost.com/?ref=timings">PebbleHost</a>
            </span>
            <div id="footer-contribute">
                <div className="footer-wrapper">
                    <b>Contribute or Donate?</b>
                    <span>
                        <a 
                            className="normal"
                            href="http://github.com/aikar/timings"
                        >
                            <FA type="fab" icon="github" /> Source
                        </a>
                        &nbsp;
                        <a 
                            className="normal"
                            href="https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=payments%40starlis%2ecom&lc=US&item_name=Aikar%20Timings&no_note=0&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donate_SM%2egif%3aNonHostedGuest"
                        >
                            <FA type="fab" icon="paypal" /> Donate
                        </a>
                    </span>
                </div>
            </div>
        </div>
    );
}
