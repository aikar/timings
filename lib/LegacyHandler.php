<?php
/**
 * Spigot Timings Parser
 *
 * Written by Aikar <aikar@aikar.co>
 *
 * @license MIT
 */

/**
 * Loads legacy data with the old parser
 */
class LegacyHandler {
	public static function load($data) {
		$GLOBALS['legacyData'] = $data;
		require_once "template/ads.php";
		require_once "legacy/index.php";
	}
}


















