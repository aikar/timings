<?php
header("Content-Type: text/html");
define('TIMINGS_ENV', basename(__DIR__));
define('MAX_CACHE_BYTES', 1024 * 512);

chdir(__DIR__);
if (TIMINGS_ENV == 'dev') {
	error_reporting(E_ALL & ~E_NOTICE);
	ini_set('display_errors', true);
}

spl_autoload_register(function($cls) {
	if (file_exists("lib/$cls.php")) {
		require_once "lib/$cls.php";
	}
});
