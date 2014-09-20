<?php
/**
 * Spigot Timings Parser
 *
 * Written by Aikar <aikar@aikar.co>
 *
 * @license MIT
 */

abstract class StorageService {
	public abstract function get($id);

	protected function requestUrl($url) {
		// TODO: Set UA etc
		return file_get_contents($url);
	}
}
