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
	private $id;

	public static function init() {
		$timings = new SpigotTimings();
		$timings->collectData();
		$timings->loadData();
	}

	/**
	 * @return mixed
	 */
	public function getId() {
		return $this->id;
	}

	private function __construct() {
	}

	public function collectData() {
		/*
		 * The PasteLoader will parse for POSTed data and then redirect with ?cache=
		 */
		PasteLoader::check();

		/**
		 * @var StorageService $storage
		 */
		$storage = new CacheStorage();
		$id = null;

		if (!empty($_GET['url'])) {
			$id = $_GET['url'];
			$storage = new UBPasteService();
		} else if (!empty($_GET['id'])) {
			$id = $_GET['id'];
		}
		$id = Util::sanitizeHex($id);
		$this->id = $id;

		if ($id) {
			$this->data = $storage->get($id);
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

	public function loadData() {
		if ($this->isLegacy()) {
			LegacyHandler::load($this->data);
			die;
		}
		header("Content-Type: text/xml");
		echo $this->data;
	}

	public function getReport() {

	}

} 
