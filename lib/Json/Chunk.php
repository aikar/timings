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

class Chunk {
	use FromJson;

	/**
	 * @index 0
	 * @var int
	 */
	public $chunkX;

	/**
	 * @index 1
	 * @var int
	 */
	public $chunkZ;

	/**
	 * @mapper chunkToBlock
	 * @index  0
	 * @var int
	 */
	public $blockX;

	/**
	 * @mapper chunkToBlock
	 * @index  1
	 * @var int
	 */
	public $blockZ;

	/**
	 * @keymapper TimingsMap::getTileEntityType
	 * @index     2
	 * @var int[]
	 */
	public $tileEntities;

	/**
	 * @keymapper TimingsMap::getEntityType
	 * @index     3
	 * @var int[]
	 */
	public $entities;

	public static function chunkToBlock($i) {
		return $i << 4;
	}
}
