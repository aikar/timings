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

class Chunk {
	use FromJson;


	/**
	 * @index Chunk::calculateAreaId
	 * @var string
	 */
	public $areaId;
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


	public static function chunkToBlock($i) {
		return $i << 4;
	}

	/**
	 * @param $chunk Chunk
	 *
	 * @return string
	 */
	public static function calculateAreaId($obj, $rootData) {
		$obj->areaLocX = (floor($rootData[0] / 4) * 4) >> 4;
		$obj->areaLocZ = (floor($rootData[1] / 4) * 4) >> 4;
		return $obj->areaLocX . ":" . $obj->areaLocZ;
	}
}
