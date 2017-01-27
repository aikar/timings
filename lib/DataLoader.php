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
	public $history;
	public $data = array();
	public $tpsData;
	public $lagData;
	public $areaMap;

	/**
	 * @var TimingHandler
	 */
	public $masterHandler;

	/**
	 * @var TimingHandler[]
	 */
	public $handlerData;

	public static function render() {
		require __DIR__ ."/../template/index.php";
	}

	public static function loadData() {
		global $ini;
		$timings = Timings::getInstance();
		if (!$timings->loadData()) {
			return false;
		}

		$data = TimingsMaster::getInstance();

		$self = self::getInstance();

		$ranges = [];

		$first = -1;
		foreach ($data->data as $history) {
			$ranges[] = $history->start;
			$ranges[] = $history->end;
			if ($first === -1 || $first > $history->start) {
				$first = $history->start;
			}
		}
		$ranges = array_values(array_unique($ranges));
		//$ranges = array_unique($ranges);
		//sort($ranges);


		//$last = count($ranges) - 1;
		//$start = (int) $ranges[0];
		//$end = (int) $ranges[$last];

		//$defStart = (int) ($timings->id === $ini['dev_id'] && !empty($ini['dev_def_start']) ? $ini['dev_def_start'] : $ranges[0]);
		//$defEnd = (int) ($timings->id === $ini['dev_id'] && !empty($ini['dev_def_end']) ? $ini['dev_def_end'] : $ranges[$last]);

		//$start = (int) (!empty($_GET['start']) ?  $_GET['start'] : $defStart);
		//$end = (int) (!empty($_GET['end']) ? $_GET['end'] : $defEnd);

		if (!empty($_POST['history'])) {
			$needFrames = explode(",", $_POST['history']);
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


		$lagData = [];
		$tpsData = [];
		$tentData = [];
		$entData = [];
		$aentData = [];
		$chunkData = [];
		$playerData = [];
		$timestamps = [];

		$max = 0;
		$areaMap = [];
		foreach ($data->data as $history) {
			$chunks = 0;
			foreach ($history->worldData as $world) {
				foreach ($world->regions as $region) {
					/**
					 * @var Region $region
					 */
					if (@$_GET['section'] === 'chunks') {
						$worldName = $world->worldName;
						$areaId = $region->regionId;
						if (!isset($areaMap[$worldName])) {
							$areaMap[$worldName] = [];
						}

						if (!array_key_exists($areaId, $areaMap[$worldName])) {
							$areaMap[$worldName][$areaId] = [
								"count" => 0,
								"world" => $world->worldName,
								"x" => $region->areaLocX,
								"z" => $region->areaLocZ,
								"e" => [],
								"ec" => 0,
								"te" => [],
								"tec" => 0,
							];
						}
						$areaMap[$worldName][$areaId]['count'] += $region->chunkCount;
						foreach ($region->tileEntities as $id => $count) {
							$areaMap[$worldName][$areaId]['te'][$id] += $count;
							$areaMap[$worldName][$areaId]['tec'] += $count;
						}
						foreach ($region->entities as $id => $count) {
							$areaMap[$worldName][$areaId]['e'][$id] += $count;
							$areaMap[$worldName][$areaId]['ec'] += $count;
						}
					}
					$chunks += $region->chunkCount;
				}
			}
			$firstMP = $history->minuteReports[0];

			for ($i = $firstMP->time; $i - $first < 65; $i += 60) {
				$clone = clone $firstMP;
				$clone->time = $first;
				array_unshift($history->minuteReports, $clone);
			}

			foreach ($history->minuteReports as $mp) {
				$total = $mp->fullServerTick->total;
				$lag = $mp->fullServerTick->lagTotal;
				$max = max($total, $max);
				if (!$mp->ticks->timedTicks) {
					continue;
				}
				$timestamps[] = $mp->time;
				$tpsData[] = $mp->tps > 19.85 ? 20 : $mp->tps;
				$lagData[] = $lag;
				$chunkData[] = $chunks;
				$entData[] = $mp->ticks->entityTicks / $mp->ticks->timedTicks;
				$playerData[] = $mp->ticks->playerTicks / $mp->ticks->timedTicks;
				$aentData[] = $mp->ticks->activatedEntityTicks / $mp->ticks->timedTicks;
				$tentData[] = $mp->ticks->tileEntityTicks / $mp->ticks->timedTicks;
			}
		}

		$system = $data->system;
		$motd = $data->motd;
		if (is_array($motd)) {
			$motd = implode("\n", $motd);
		}
		$version = $data->version;
		// Support a bug in Sponge that serialized an optional
		if (!empty($version['value'])) {
			$version = $version['value'];
		}
		if ($version === '$version') {
			$version = "Sponge IDE Dev";
		}

		$serverInfo = [];
		$serverInfo['icon'] = $data->icon;
		$serverInfo['name'] = $data->server;
		$serverInfo['version'] = $version;
		$serverInfo['maxplayers'] = $data->maxplayers;
		$serverInfo['onlinemode'] = $data->onlinemode === true;
		$serverInfo['system'] = $system;
		$serverInfo['motd'] = util::mccolor($motd);

		$self->data['start'] = $start;
		$self->data['end'] = $end;

		$self->data['ranges'] = $ranges;
		$self->data['areaMap'] = $areaMap;
		$self->data['serverInfo'] = $serverInfo;
		$self->data['stamps'] = $timestamps;
		$self->data['maxTime'] = $max;
		$self->data['chunkData'] = $chunkData;
		$self->data['entData'] = $entData;
		$self->data['aentData'] = $aentData;
		$self->data['tentData'] = $tentData;
		$self->data['plaData'] = $playerData;
		$self->data['lagData'] = $lagData;
		$self->data['tpsData'] = $tpsData;
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
