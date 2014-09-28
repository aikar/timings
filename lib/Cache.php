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
			unlink($file);
		}
		return null;
	}
	public static function put($key, $data) {
		$file = self::getFile($key).".gz";
		$data = gzencode($data);
		file_put_contents($file, $data);
	}
	private static function getFile($key) {
		return self::$base . md5($key);
	}
}
