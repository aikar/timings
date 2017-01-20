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
namespace Starlis\Timings\Json;

use Starlis\Timings\FromJson;
use Starlis\Timings\FromJsonParent;

/**
 * @mapper normalizeData
 */
class TimingData {
	use FromJson;
	public $mergedCount = 0;
	public $mergedLagCount = 0;
	/**
	 * @index  0
	 * @mapper TimingsMap::getHandlerIdentity
	 * @var TimingIdentity
	 */
	public $id;
	/**
	 * @index 1
	 * @var int
	 */
	public $count;
	/**
	 * @index 2
	 * @var int
	 */
	public $total;
	/**
	 * @index 3
	 * @var int
	 */
	public $lagCount;
	/**
	 * @index 4
	 * @var int
	 */
	public $lagTotal;

	/**
	 * @param                $key
	 * @param TimingData     $value
	 * @param FromJsonParent $parent
	 *
	 * @return mixed
	 */
	public static function mapIdKey($key, $value, FromJsonParent $parent) {
		return $value->id->id;
	}

	/**
	 * @param $data
	 * @param $parent
	 *
	 * @return array
	 */
	public static function normalizeData($data, $parent) {
		if (!isset($data[4])) {
			$data[4] = $data[3] = 0;
		}

		return $data;
	}

	public function addData(TimingData $data) {
		$this->mergedCount++;
		$this->count += $data->count;
		$this->total += $data->total;
		if ($data->lagCount) {
			$this->mergedLagCount++;
			$this->lagCount += $data->lagCount;
			$this->lagTotal += $data->lagTotal;
		}
	}
}
