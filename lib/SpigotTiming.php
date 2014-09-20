<?php
/**
 * Spigot Timings Parser
 *
 * Written by Aikar <aikar@aikar.co>
 *
 * @license MIT
 */

class SpigotTimings {
	private $data;

	function __construct() {
		$this->collectData();
	}

	function collectData() {
		/*
		 * The PasteLoader will parse for POSTed data and then
		 */
		PasteLoader::check();

		$cache = new CacheStorage();
		$storage = null;
		$id = null;
		if (!empty($_GET['url'])) {
			$id = $_GET['url'];
			$storage = new UBPasteService();
		} else if (!empty($_GET['id'])) {
			$id = $_GET['id'];
			$storage = new GistService();
		} else if (!empty($_GET['cache'])) {
			$id = $_GET['cache'];
		}
		$id = Util::sanitizeHex($id);
		if ($id) {
			$this->data = $cache->get($id);
			if (!$this->data && $storage) {
				$this->data = $storage->get($id);
			}
		}

	}

} 
