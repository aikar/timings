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

use Starlis\Timings\Json\TimingsMaster;

class Timings {
	use Singleton;
	public $id;

	private $data;
	/**
	 * @var StorageService
	 */
	private $storage;

	public static function bootstrap() {
		$timings = self::getInstance();
		$timings->prepareData();
		if (!empty($_GET['raw'])) {
			$timings->showRaw();
		}
		Template::render();
	}

	public function prepareData() {
		/**
		 * @var StorageService $storage
		 */
		$storage = new CacheStorage();
		$id = null;

		if (!empty($_GET['url'])) {
			$id = $_GET['url'];
			$storage = new LegacyStorageService();
		} else if (!empty($_GET['id'])) {
			$id = $_GET['id'];
		} else {
			global $ini;
			$id = $ini["dev_id"]; // DEV test
		}
		$id = util::sanitizeHex($id);
		$this->id = $id;
		$this->storage = $storage;

		if ($storage instanceof LegacyStorageService) {
			LegacyHandler::load(trim($storage->get($id)));
			exit;
		}
	}

	public function loadData() {
		$id = $this->id;
		if ($id) {
			$data = Cache::getObject($id);
			if (!$data || ((int) util::array_get($_GET['nocache']) === 1 && DEBUGGING)) {
				$data = $this->storage->get($id);
				if (!$data) {
					return null;
				}
				$data = json_decode($data);
				if (!$data) {
					return null;
				}
				$data = TimingsMaster::createObject($data);
				Cache::putObject($id, $data);
			}
			if ($data && (!$data->version || !$data->start || !$data->end)) {
				return null;
			}
			$this->data = $data;
			$GLOBALS['timingsData'] = $data;
			return $data;
		}
		return null;
	}

	public function showRaw() {
		$id = $this->id;
		$data = trim($this->storage->get($id));

		header("Content-Type: text/plain");
		if (!empty($_GET['mini'])) {
			echo $data;
		} else {
			echo json_encode(json_decode($data), JSON_PRETTY_PRINT);
		}
		die;
	}
} 
