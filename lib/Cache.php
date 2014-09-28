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
		if (file_exists("$file.gz")) {
			return trim(gzdecode(file_get_contents("$file.gz")));
		} else if (file_exists($file)) {
			$data = trim(file_get_contents($file));
			self::put($key, $data);
			//unlink($file); // Disabled for now while legacy code is the primary code
		}
		return null;
	}
	public static function put($key, $data) {
		if (strlen($data) < MAX_CACHE_BYTES) {
			file_put_contents(self::getFile($key).".gz", gzencode($data));
		}
	}
	private static function getFile($key) {
		return self::$base . md5($key);
	}
}
