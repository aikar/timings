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

require_once __DIR__ . "/init.php";
Timings::bootstrap();

$assets = "dist/webpack-assets.json";
$stamp = filemtime($assets);
$assets = json_decode(file_get_contents($assets), true);
foreach ($assets as $k => $asset) {
	foreach ($asset as $id => $f) {
		$assets[$k][$id] = "$f?$stamp";
	}
}

?>
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
	<title>Aikar's Timings Viewer</title>
	<meta name="description" content="Aikar's Timings Viewer - View Timings v2 reports from Paper and Sponge"/>
	<link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet"
	      crossorigin="anonymous">
	<?php
	$theme = 'blue1-dark';
	if (!empty($_COOKIE['timings-theme'])) {
		$cookie = basename($_COOKIE['timings-theme']);
		if (file_exists(ROOT_DIR . "/src/css/themes/$cookie.scss")) $theme = $cookie;
	}
	?>
	<script type="text/javascript">TIMINGS_THEME =<?=json_encode($theme);?>;</script>
	<link href="<?= htmlentities($assets["timings"]['css']) ?>" rel="stylesheet"/>
	<link href="<?= htmlentities($assets["timings-theme-{$theme}"]['css']) ?>" rel="stylesheet"/>
	<meta name="robots" content="noindex,nofollow">
</head>
<body>
<div id="wrapper"></div>
<script src="<?= htmlentities($assets['vendor']['js']) ?>"></script>
<script src="<?= htmlentities($assets['timings']['js']) ?>"></script>
</body>
</html>
