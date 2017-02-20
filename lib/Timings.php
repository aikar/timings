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
	}

	public function prepareData() {
		/**
		 * @var StorageService $storage
		 */
		$storage = new CacheStorage();
		$id = null;

		if (!empty($_GET['url'])) { ?>
			🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮<br/>
			🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮<br/>
			Timings v1 is no longer supported here, as Spigot forcefully moved it away from my server, so almost
			no one is even hitting this URL anymore, so it doesn't make sense for me to keep supporting it.
			<br/>
			I strongly recommend you to not use Spigot, as Timings v1 contains many bugs and lacking lots of info.
			Timings v2 is a huge upgrade and contains exponentially more information.
			<br/><br/>
			You may switch to a faster and better server by downloading <a href='https://paper.emc.gs'>Paper</a>.
			It is a drop in replacement for Spigot, and all of your plugins should still work.<br/><br/>

			Plus, we have Tacos.<br/>
			🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮<br/>
			🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮<br/>
			<?php
			exit;
		} else if (!empty($_REQUEST['id'])) {
			$id = $_REQUEST['id'];
		} else {
			global $ini;
			$id = $ini["dev_id"]; // DEV test
		}
		$id = util::sanitizeHex($id);
		$this->id = $id;
		$this->storage = $storage;

	}

	public function loadData() {
		$id = $this->id;
		if ($id) {
			$data = Cache::getObject($id);
			if (!$data || ((int)util::array_get($_GET['nocache']) === 1 && DEBUGGING)) {
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
