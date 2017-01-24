<?php
/**
 * Copyright (c) (2017) - Aikar's Minecraft Timings Parser
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
namespace Starlis\Timings;

require_once __DIR__ . "/init.php";
header("Content-Type: application/json");

$timings = Timings::getInstance();
$template = Template::getInstance();
$timings->prepareData(false);
/** @noinspection NotOptimalIfConditionsInspection */
if (!Template::loadData() || empty($template->data)) {
	header($_SERVER['SERVER_PROTOCOL'] . " 404 Not Found", true, 404);
	echo json_encode(null);
	exit;
}

echo json_encode($template->data);
