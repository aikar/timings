<?php
require_once "ads.php";
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Spigot Timings Viewer</title>
    <link rel="stylesheet" href="//ajax.googleapis.com/ajax/libs/jqueryui/1.11.1/themes/smoothness/jquery-ui.css"/>
    <link rel="stylesheet" href="static/timings.css"/>
    <meta name="robots" content="noindex">
</head>
<?php
flush();
Template::getInstance()->loadData();
?>
<body>
<div id="wrapper">
    <div id="header">
        <div id="header-left">
            <br/>
            &copy; <a href='http://ref.emc.gs/?gas=timingsphp' rel="nofollow">Aikar</a>
            <a href="http://github.com/aikar/timings" title="Source Code">[source]</a> <a
                href="https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=payments%40starlis%2ecom&lc=US&item_name=Aikar%20Timings&no_note=0&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donate_SM%2egif%3aNonHostedGuest">[donate]</a><br />
            <span>This system has taken weeks to develop. If it has helped you, consider donating :)</span>
            <br/>

            <p>Requires Spigot:
                <a href="http://spigotmc.org" title="Spigot">spigotmc.org</a>.<br/>
            </p>
        </div>
        <div id="header-right">
            <?php ad_banner_top_right(); ?>
        </div>
    </div>

    <div id="body-wrap">
        <?php require "time_selector.php"; ?>
        <?php require_once "content.php"; ?>
        <div id="bottom-ad">
            <?php ad_banner_bottom(); ?>
        </div>
        <?php require_once "info_popups.php"; ?>
    </div>
    <div class="push"></div>
</div>

<div id="footer">
    <span id="footer-left">&copy; 2014 Starlis LLC <a href="http://github.com/aikar/timings"
                                                      title="Source">[source]</a> &mdash; <a
            href="http://aikar.co/spigot/" title="About / Donate">[about / donate]</a></span>
    <span id="footer-right"></span>
</div>
<script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.11.1/jquery-ui.min.js"></script>
<script type="text/javascript">
    window.timingsData =<?=Template::getInstance()->getData();?>;
</script>
<script src="static/timings.min.js"></script>
</body>
</html>
