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

class Template {
	use Singleton;
	public $history;
	public $js = array();
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
		$timings->loadData();

		$data = TimingsMaster::getInstance();

		$tpl = self::getInstance();

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

		$last = count($ranges) - 1;

		$tpl->js['ranges'] = $ranges;
		$defStart = (int) ($timings->id === $ini['dev_id'] && !empty($ini['dev_def_start']) ? $ini['dev_def_start'] : $ranges[0]);
		$defEnd = (int) ($timings->id === $ini['dev_id'] && !empty($ini['dev_def_end']) ? $ini['dev_def_end'] : $ranges[$last]);

		$tpl->js['start'] = $start = (int) (!empty($_GET['start']) ?  $_GET['start'] : $defStart);
		$tpl->js['end'] = $end = (int) (!empty($_GET['end']) ? $_GET['end'] : $defEnd);


		/**
		 * @var TimingHandler[] $handlerData
		 */
		$handlerData = [];
		$lagData = [];
		$tpsData = [];
		$tentData = [];
		$entData = [];
		$aentData = [];
		$chunkData = [];
		$playerData = [];
		$timestamps = [];
		$masterHandler = null;

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

			if ($history->start >= $start && $history->end <= $end) {
				foreach ($history->handlers as $handler) {
					$id = $handler->id->id;
					if (!array_key_exists($id, $handlerData)) {
						$handlerData[$id] = clone $handler;
						$handlerData[$id]->mergedCount = 1;
						$handlerData[$id]->mergedLagCount = $handler->lagCount ? 1 : 0;
					} else {
						$handlerData[$id]->addDataFromHandler($handler);
					}
					if ($handler->id->name === "Full Server Tick" && $masterHandler === null) {
						$masterHandler = $handlerData[$id];
					}
				}
			}
		}
		$selfId = new TimingIdentity();
		$selfRecord = new TimingData();
		foreach ($handlerData as $id => $handler) {
			$record = clone $selfRecord;
			$thisSelfId = clone $selfId;
			$thisSelfId->name = "(SELF) " . $handler->id->name;
			$thisSelfId->group = $handler->id->group;
			$record->id = $thisSelfId;
			foreach ($handler->children as $child) {
				$handler->childrenCount += $child->mergedCount;
				$handler->childrenLagCount += $child->mergedLagCount;
				$handler->childrenTotal += $child->total ?: 0;
				$handler->childrenLagTotal += $child->lagTotal ?: 0;
			}

			$record->total = $handler->total - $handler->childrenTotal;
			$record->lagTotal = $handler->lagTotal - $handler->childrenLagTotal;
			$record->count = $handler->count - $handler->childrenCount;
			$record->lagCount = $handler->lagCount - $handler->childrenLagCount;
			$handler->children[$id] = $record;
		}

		if (DEBUGGING && util::array_get($_GET['showmaster'])) util::var_dump($masterHandler);

		$tpl->handlerData = $handlerData;
		$tpl->areaMap = $areaMap;
		$tpl->js['stamps'] = $timestamps;
		$tpl->js['maxTime'] = $max;
		$tpl->js['chunkData'] = $chunkData;
		$tpl->js['entData'] = $entData;
		$tpl->js['aentData'] = $aentData;
		$tpl->js['tentData'] = $tentData;
		$tpl->js['plaData'] = $playerData;
		$tpl->js['lagData'] = $lagData;
		$tpl->js['tpsData'] = $tpsData;
		$tpl->js['id'] = $timings->id;
		$tpl->lagData = $lagData;
		$tpl->tpsData = $tpsData;
		$tpl->masterHandler = $masterHandler;
	}

	public function getData() {
		return json_encode($this->js);
	}
} 
