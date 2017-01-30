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
use Starlis\Timings\util;

class Region {
	use FromJson;

	/**
	 * @index Region::calculateRegionId
	 * @var string
	 */
	public $regionId;

	public $chunkCount;
	public $areaLocX;
	public $areaLocZ;

	/**
	 * @keymapper TimingsMap::getTileEntityType
	 * @index     3
	 * @var int[]
	 */
	public $tileEntities;

	/**
	 * @keymapper TimingsMap::getEntityType
	 * @index     2
	 * @var int[]
	 */
	public $entities;


	/**
	 * @param Region $obj
	 * @param array $rootData From json data
	 * @return string
	 *
	 */
	public static function calculateRegionId(Region $obj, $rootData) {
		$obj->areaLocX = floor($rootData[0] >> 5) << 5 << 4;
		$obj->areaLocZ = floor($rootData[1] >> 5) << 5 << 4;
		return $obj->areaLocX . ":" . $obj->areaLocZ;
	}
}
