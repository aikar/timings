<?php
/**
 * Spigot Timings Parser
 *
 * Written by Aikar <aikar@aikar.co>
 *
 * @license MIT
 */

class PasteLoader {

	public static function check() {
		$data = (!empty($_POST['timings']) ? Util::sanitize($_POST['timings']) : null);
		if ($data && strlen($data) < MAX_CACHE_BYTES) {
			$key = md5($data);
			Cache::put($key, $data);
			header("Location: timings.php?cache=$key");
			exit;
		}
	}
}
