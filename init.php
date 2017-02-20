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
define('ROOT_DIR', __DIR__);
// Get configuration first
global $ini;

$ini = parse_ini_file("config.ini", true);
if (file_exists("config.dev.ini")) {
	$ini = array_merge($ini, parse_ini_file("config.dev.ini", true));
}
header("Content-Type: text/html");
$dirName = basename(__DIR__);
define('TIMINGS_ENV', $dirName === 'prod' || $dirName === 'v2' ? 'prod' : $ini["environment"]);
define('MAX_CACHE_BYTES', 1024 * 512);

if ($ini['trusted_ip'] === $_SERVER['REMOTE_ADDR'] || gethostbyname("aikarip") === $_SERVER['REMOTE_ADDR']) {
	error_reporting(E_ALL & ~E_NOTICE);
	ini_set('display_errors', true);
	define('DEBUGGING', true);
} else {
	define('DEBUGGING', false);
}

if (TIMINGS_ENV === 'dev') {
	define('BASE_URL', $ini["base_url_dev"]);
	define('BASE_URL_VIEW', $ini["base_url_view_dev"]);
} else {
	define('BASE_URL', $ini["base_url_prod"]);
	define('BASE_URL_VIEW', $ini["base_url_view_prod"]);
}
require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . "/lib/util.php";
// To make it a little harder to try to exploit the uploader, implement a closed source version
// of the security class if it exists, else fall back to the simple rules.
if (!empty($ini['custom_security'])) {
	// should error if misconfigured
	/** @noinspection PhpIncludeInspection */
	require_once $ini['custom_security'];
}
libxml_disable_entity_loader(true);
define('TMP_PATH', $ini['tmp_path']);
