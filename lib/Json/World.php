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
use util;

class World {
	use FromJson;

	/**
	 * @mapper TimingsMap::getWorldName
	 * @index @key
	 * @var string
	 */
	public $worldName;

	/**
	 * @keymapper World::mergeChunk
	 * @index @value
	 * @var Chunk[]
	 */
	public $chunks;
	public static function mergeChunk($ignored, Chunk $chunk, FromJsonParent $parent) {
		$regionId = $chunk->areaLocX . ":" . $chunk->areaLocZ;
		$world = $parent->obj->chunks;
		/**
		 * @var Chunk $prevChunk
		 */
		$prevChunk = $world[$regionId];
		if ($prevChunk) {
			if (!empty($prevChunk->tileEntities)) {
				foreach ($prevChunk->tileEntities as $type => $count) {
					$chunk->tileEntities[$type] += $count;
				}
			}
			if (!empty($prevChunk->entities)) {
				foreach ($prevChunk->entities as $type => $count) {
					$chunk->entities[$type] += $count;
				}
			}
		}
		$parent->obj->chunks[$regionId] = $chunk;

		return $regionId;
	}
}
