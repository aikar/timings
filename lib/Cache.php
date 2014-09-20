<?php
/**
 * Spigot Timings Parser
 *
 * Written by Aikar <aikar@aikar.co>
 *
 * @license MIT
 */

class Cache {
	private static $base = '/tmp/timings_';

	public static function get($key) {
		$file = self::getFile($key);
		return file_exists($file) ? trim(file_get_contents($file)) : null;
	}
	public static function put($key, $data) {
		if (strlen($data) < MAX_CACHE_BYTES) {
			file_put_contents(self::getFile($key), $data);
		}
	}
	private static function getFile($key) {
		return self::$base . md5($key);
	}
}
