<?php
/**
 * Copyright (c) (2016) - Aikar's Minecraft Timings Parser
 *
 *  Written by Aikar <aikar@aikar.co>
 *    + Contributors (See AUTHORS)
 *
 *  http://aikar.co
 *  http://starlis.com
 *
 * @license MIT
 *
 */


use Starlis\Timings\Daemon;

require __DIR__ . "/init.php";

if (PHP_SAPI !== 'cli') {
	echo "I'm sorry Dave, I'm afraid I can't do that.";
	die;
}
Daemon::startDaemon();
