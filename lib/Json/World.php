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
use utilphp\util;

class World {
	use FromJson;

	/**
	 * @mapper TimingsMap::getWorldName
	 * @index @key
	 * @var string
	 */
	public $worldName;

	/**
	 * @keymapper World::mergeRegion
	 * @index @value
	 * @var Region[]
	 */
	public $regions;


	public static function mergeRegion($ignored, Region $region, FromJsonParent $parent) {
		/**
		 * @var World $world
		 * @var Region $prevChunk
		 * @var Region[] $regions
		 */

		$regionId = $region->regionId;
		$world = $parent->obj;
		$regions = &$world->regions;
		$prevChunk = $regions[$regionId];
		if ($prevChunk) {
			if (!empty($prevChunk->tileEntities)) {
				foreach ($prevChunk->tileEntities as $type => $count) {
					$region->tileEntities[$type] += $count;
				}
			}
			if (!empty($prevChunk->entities)) {
				foreach ($prevChunk->entities as $type => $count) {
					$region->entities[$type] += $count;
				}
			}
			$region->chunkCount = $prevChunk->chunkCount + 1;
		} else {
			$region->chunkCount = 1;
		}
		$regions[$regionId] = $region;
		$region->world = $world;

		return $regionId;
	}
}
