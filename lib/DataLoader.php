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

use Starlis\Timings\Json\Region;
use Starlis\Timings\Json\TimingData;
use Starlis\Timings\Json\TimingHandler;
use Starlis\Timings\Json\TimingIdentity;
use Starlis\Timings\Json\TimingsMaster;

class DataLoader {
	use Singleton;
	public $data = array();

	public static function render() {
		require __DIR__ ."/../template/index.php";
	}

	public static function loadData() {
		$timings = Timings::getInstance();
		if (!$timings->loadData()) {
			return false;
		}

		$data = TimingsMaster::getInstance();
		if (DEBUGGING && isset($_GET['test'])) {
			echo json_encode($data, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
			exit;
		}

		$self = self::getInstance();

		if (isset($_GET['history'])) {
			$needFrames = explode(",", $_GET['history']);
			$self->data['history'] = new \stdClass();
			foreach ($data->data as $id => $history) {
				$id = $id ?: 0;
				if (!in_array($id, $needFrames, false)) {
					continue;
				}
				$self->data['history']->{$id} = $history->handlers;
			}
			return true;
		}

		$self->data['id'] = $timings->id;
		foreach ($data->data as $th) {
			unset($th->handlers);
		}
		$self->data['timingsMaster'] = $data;
		return $self;
	}

	public function getData() {
		return json_encode($this->data);
	}
} 
