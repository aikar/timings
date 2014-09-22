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
	private $checkedType = false;
	private $isLegacy = false;
	function __construct() {
	}

	public function collectData() {
		/*
		 * The PasteLoader will parse for POSTed data and then redirect with ?cache=
		 */
		PasteLoader::check();

		$cache = new CacheStorage();
		$storage = null;
		$id = null;
		$_GET['url'] =6870867;

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
	public function isLegacy() {
		if (!$this->checkedType) {
			$start = substr($this->data, 0, 4);
			$this->isLegacy = $start != '<?xml';
			$this->checkedType = true;
		}
		return $this->isLegacy;
	}

	public function convertFromLegacy() {
		$this->data = (new LegacyConverter($this->data))->convert();
	}

	public function loadData() {
		if ($this->isLegacy()) {
			$this->convertFromLegacy();
		}


	}

} 
