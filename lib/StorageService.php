<?php
/*
 * Aikar's Minecraft Timings Parser
 *
 * Written by Aikar <aikar@aikar.co>
 * http://aikar.co
 * http://starlis.com
 *
 * @license MIT
 */
namespace Starlis\Timings;

abstract class StorageService {
	public abstract function get($id);

	protected function requestUrl($url) {
		// TODO: Set UA etc
		return file_get_contents($url);
	}
}
