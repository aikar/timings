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
if ($_SERVER['HTTP_ACCEPT'] === 'application/json') {
	header("Content-Type: application/json");
}

$timings = Timings::getInstance();
$template = DataLoader::getInstance();
$timings->prepareData(false);
/** @noinspection NotOptimalIfConditionsInspection */
if (!DataLoader::loadData() || empty($template->data)) {
	header($_SERVER['SERVER_PROTOCOL'] . " 404 Not Found", true, 404);
	echo json_encode(null);
	exit;
}


//util::var_dump($template->data['timingsMaster']);
$options = JSON_UNESCAPED_SLASHES;
if (DEBUGGING && $_SERVER['HTTP_ACCEPT'] !== 'application/json') {
	$options |= JSON_PRETTY_PRINT;
}
echo json_encode($template->data, $options);
