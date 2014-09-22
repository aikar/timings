<?php
/**
 * Spigot Timings Parser
 *
 * Written by Aikar <aikar@aikar.co>
 *
 * @license MIT
 *
 * //////////////////////////////
 * STILL CONVERTING THIS CODE
 * //////////////////////////////
 *
 */

require_once "init.php";

$timings = new SpigotTimings();
$timings->collectData();
$timings->loadData();
//require_once "template/reports.php";
//require_once "template/footer.php";

