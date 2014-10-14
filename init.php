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

header("Content-Type: text/html");
define('TIMINGS_ENV', basename(__DIR__));
define('MAX_CACHE_BYTES', 1024 * 512);

chdir(__DIR__);
if (TIMINGS_ENV == 'dev') {
    error_reporting(E_ALL & ~E_NOTICE);
    ini_set('display_errors', true);
    define('BASE_URL', 'http://timings.aikar.co/dev');
    define('BASE_URL_VIEW', 'http://timings.aikar.co/dev');
} else {
    define('BASE_URL', 'http://timings.aikar.co/');
    define('BASE_URL_VIEW', 'http://spigotmc.org/go/timings');
}
require_once "lib/Util.php";
// To make it a little harder to try to exploit the uploader, implement a closed source version
// of the security class if it exists, else fall back to the simple rules.
if (file_exists('../security/security.php')) {
    require_once "../security/security.php";
}
libxml_disable_entity_loader(true);
spl_autoload_register(function ($cls) {
    $cls = str_replace("\\","/",str_replace("Starlis\\Timings\\", "", $cls));

    if (file_exists("lib/$cls.php")) {
        require_once "lib/$cls.php";
        return;
    }
});
