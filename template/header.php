<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Spigot Timings Viewer</title>
	<link rel="stylesheet" href="timings.css"/>
	<script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
	<link rel="stylesheet" href="//ajax.googleapis.com/ajax/libs/jqueryui/1.11.1/themes/smoothness/jquery-ui.css" />
	<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.11.1/jquery-ui.min.js"></script>
	<script src="timings.js"></script>
	<meta name="robots" content="noindex">

</head>
<body>
<div id="wrapper">
	<div id="header">
		<div id="header-left">
			<br />
			&copy; Aikar of <a href='http://ref.emc.gs/?gas=timingsphp' rel="nofollow">Empire Minecraft</a><br />
			<a href="http://github.com/aikar/timings" title="Source Code">[source]</a> <a href="https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=payments%40starlis%2ecom&lc=US&item_name=Aikar%20Timings&no_note=0&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donate_SM%2egif%3aNonHostedGuest">[donate]</a>
			<br />
			<p>For the advanced timings data, you need to use Spigot:
				<a href="http://spigotmc.org" title="Spigot">spigotmc.org</a>.<br />
			</p>
			<?php require "time_selector.php"; ?>
		</div>
		<div id="header-right">
			<?php ad_banner_top_right(); ?>
		</div>
	</div>
	<div id="body-wrap">
