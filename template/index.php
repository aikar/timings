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
	<?php
	$theme = 'blue1-dark';
	if (!empty($_COOKIE['timings-theme'])) {
		$cookie = basename($_COOKIE['timings-theme']);
		if (file_exists(ROOT_DIR . "/src/css/themes/$cookie.scss")) $theme = $cookie;
	}
	?>
	<script>TIMINGS_THEME=<?=json_encode($theme)?></script>
	<link href="<?=htmlentities($assets["timings-theme-{$theme}"]['css'])?>" rel="stylesheet" />
	<meta name="robots" content="noindex,nofollow">
</head>
<body>
<header id="header"></header>
<div id="wrapper"></div>
<footer id="footer"></footer>

<script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.11.1/jquery-ui.min.js"></script>
<script src="<?=htmlentities($assets['vendor']['js'])?>"></script>
<script src="<?=htmlentities($assets['timings']['js'])?>"></script>
</body>
</html>
