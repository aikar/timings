<?php
/**
 * Spigot Timings Parser
 *
 * Written by Aikar <aikar@aikar.co>
 *
 * @license MIT
 */

class Cache {
	public static $base = '/tmp/timings_';

	/**
	 * Get with arbitrary string key that will be hashed.
	 * @param $key
	 * @return null|string
	 */
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

	/**
	 * Get if you know the direct hash to look up.
	 * @param $key
	 * @return null|string
	 */
	public static function getHash($key) {
		$file = self::$base."$key.gz";
		if (file_exists($file)) {
			$data = trim(file_get_contents($file));
			self::put($key, $data);
			unlink($file);
		}
		return null;
	}


	/**
	 * Use with arbitrary string key that will be hashed.
	 * @param $key
	 * @param $data
	 */
	public static function put($key, $data) {
		$file = self::getFile($key).".gz";
		$data = gzencode($data);
		file_put_contents($file, $data);
	}

	/**
	 * Use if you already have a hash to store with.
	 * @param $key
	 * @param $data
	 */
	public static function putHash($key, $data) {
		$file = self::$base."$key.gz";
		$data = gzencode($data);
		file_put_contents($file, $data);
	}
	public static function getFile($key) {
		return self::$base . md5($key);
	}
}
