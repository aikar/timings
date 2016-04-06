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
 *  @license MIT
 *
 */
use Starlis\Timings\Json\TimingsMaster;
use utilphp\util;

$timings = TimingsMaster::getInstance();
foreach ($timings->config as $type => $config) {
	echo "<h2>$type Config</h2><br /><br />";
	util::var_dump($config);
}

