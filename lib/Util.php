<?php
/**
 * Spigot Timings Parser
 *
 * Written by Aikar <aikar@aikar.co>
 *
 * @license MIT
 */

class Util {
	public static function sanitize($inp) {
		return htmlentities(strip_tags($inp));
	}

	public static function sanitizeMD5($id) {
		return preg_replace('/[^a-zA-Z0-9]/ms', '', $id);
	}
}
