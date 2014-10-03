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
		global $timings;
		$timings = new SpigotTimings();
		$GLOBALS['timings'] = $timings;
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
			$id = '8cac6deaab1245a893ba5353a87b8d3d'; // DEV test
		}
		$id = Util::sanitizeHex($id);
		$this->id = $id;

		if ($id) {
			$this->data = trim($storage->get($id));
		}
	}
	public function isLegacy() {
		if (!$this->checkedType) {
			$start = substr($this->data, 0, 2);
			$this->isLegacy = $start != '{"';
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
			header("Content-Type: text/plain");
			echo json_encode(json_decode($this->data), JSON_PRETTY_PRINT);
			die;
		}
		$this->data = TimingsMaster::createObject(json_decode($this->data));
		require "template/index.php";
	}

	public function getReport() {

	}
} 
