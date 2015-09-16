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

chdir(__DIR__);

// Get configuration first
global $ini;
$file = "config.ini";
if (file_exists("config.dev.ini")) {
	$ini = "confg.dev.ini";
}
$ini = parse_ini_file($ini, true);

header("Content-Type: text/html");
define('TIMINGS_ENV', $ini["environment"]);
define('MAX_CACHE_BYTES', 1024 * 512);

if (gethostbyname("aikarip") == $_SERVER['REMOTE_ADDR']) {
	error_reporting(E_ALL & ~E_NOTICE);
	ini_set('display_errors', true);
}

if (TIMINGS_ENV == 'dev') {
	define('BASE_URL', $ini["base_url_dev"]);
	define('BASE_URL_VIEW', $ini["base_url_view_dev"]);
} else {
	define('BASE_URL', $ini["base_url_prod"]);
	define('BASE_URL_VIEW', $ini["base_url_view_prod"]);
}
require_once 'vendor/autoload.php';
require_once "lib/Util.php";
// To make it a little harder to try to exploit the uploader, implement a closed source version
// of the security class if it exists, else fall back to the simple rules.
if (file_exists('../security/security.php')) {
	require_once "../security/security.php";
}
libxml_disable_entity_loader(true);
