<?php
/*
 * Aikar's Minecraft Timings Parser
 *
 * Written by Aikar <aikar@aikar.co>
 * http://aikar.co
 * http://starlis.com
 *
 * @license MIT
 */
namespace Starlis\Timings;

require_once __DIR__ . "/ads.php";
$assets = json_decode(file_get_contents("dist/webpack-assets.json"), true);

?>
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Aikar's Timings Viewer</title>
	<meta name="description" content="Aikar's Timings Viewer - View Timings v2 reports from Paper and Sponge" />
	<link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-T8Gy5hrqNKT+hzMclPo118YTQO6cYprQmhrYwIiQ/3axmI1hQomh7Ud2hPOy8SP1" crossorigin="anonymous">
	<meta name="robots" content="noindex,nofollow">
</head>
<?php
flush();
Template::getInstance()->loadData();
?>
<body>
<div id="wrapper">
	<div id="header">
		<div class="site-title">
			Timings <small>v</small>2
			<div class="subtitle">Written by <a href='http://ref.emc.gs/?gas=timingsphp' rel="nofollow">Aikar</a></div>
		</div>
		
		<div id="header-left" class="section">
			<div class="section-head">
				<span class="section-title">Contribute or Donate?</span>
				<span class="section-controls">
					<a class="normal" href="http://github.com/aikar/timings"><i class="fa fa-github"></i> Source</a>
					<a class="normal" href="https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=payments%40starlis%2ecom&lc=US&item_name=Aikar%20Timings&no_note=0&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donate_SM%2egif%3aNonHostedGuest"><i class="fa fa-paypal"></i> Donate</a>
				</span>
			</div>
			&copy; <a href='http://ref.emc.gs/?gas=timingsphp' rel="nofollow">Aikar</a>
			<span>This system has taken years to develop. If it has helped you, consider donating :)</span>
			<br>
			Requires <a href="http://paper.emc.gs" title="Paper Minecraft Server">Paper</a>
			or <a href="https://www.spongepowered.org" title="Sponge Minecraft Server">Sponge</a>
			[<a href="https://www.youtube.com/watch?v=T4J0A9l7bfQ" title="Timings v2 Tutorial">Video Tutorial</a>]
		</div>
	</div>
	<div id="body-wrap">
		<div class="dev-warning"><strong>Hey!</strong> This site is still under heavy development.</div>
		
		<div class="row-double">
			<?php require_once __DIR__ . "/time_selector.php"; ?>
			<?php require_once __DIR__ . "/server-info.php"; ?>
		</div>
		
		<?php require_once __DIR__ . "/content.php"; ?>
		<div id="bottom-ad">
			<?php ad_banner_bottom(); ?>
		</div>
		<?php require_once __DIR__ . "/info_popups.php"; ?>
	</div>
	<div class="push"></div>
</div>

<div id="footer">
    <span id="footer-left">&copy; 2013-<?=date('Y')?> Starlis LLC <a href="http://github.com/aikar/timings" title="Source">[source]</a> &mdash; <a
		    href="http://aikar.co/spigot/" title="About / Donate">[about / donate]</a></span>
	<span id="footer-right">Theme by Thomas Edwards</span>
</div>
<script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
<script src="<?=htmlentities($assets['vendor']['js'])?>"></script>
<?php flush(); ?>
<script type="text/javascript">
	window.timingsData =<?=Template::getInstance()->getData();?>;
</script>
<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.11.1/jquery-ui.min.js"></script>
<script src="<?=htmlentities($assets['timings']['js'])?>"></script>
</body>
</html>
