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
		} else if (TIMINGS_ENV == 'dev') {
			$id = 'c871022ab1c14e068293d8431dadfd43'; // DEV test
		}
		$id = Util::sanitizeHex($id);
		$this->id = $id;

		if ($id) {
			$this->data = trim($storage->get($id));
		}
	}
	public function isLegacy() {
		if (!$this->checkedType) {
			$start = substr($this->data, 0, 5);
			$this->isLegacy = $start != '<?xml';
			$this->checkedType = true;
		}
		return $this->isLegacy;
	}

	public function loadData() {
		if ($this->isLegacy() || TIMINGS_ENV != 'dev') {
			LegacyHandler::load($this->data);
			die;
		}
		if (!empty($_GET['raw'])) {
			header("Content-Type: text/xml");
			echo $this->data;
			die;
		}
		require "template/index.php";
	}

	public function getReport() {

	}
} 
