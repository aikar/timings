<?php

/**
 * Spigot Timings Parser
 *
 * Written by Aikar <aikar@aikar.co>
 *
 * @license MIT
 */
class Chunk {
    use FromJson;

    /**
     * @index x
     * @var int
     */
    public $chunkX;

    /**
     * @index z
     * @var int
     */
    public $chunkZ;

    /**
     * @mapper chunkToBlock
     * @index x
     * @var int
     */
    public $blockX;

    /**
     * @mapper chunkToBlock
     * @index z
     * @var int
     */
    public $blockZ;

    /**
     * @mapper getTileEntityName
     * @index te
     * @var int[]
     */
    public $tileEntities;

    /**
     * @mapper getEntityName
     * @index e
     * @var int[]
     */
    public $entities;

    public static function chunkToBlock($i) {
        return $i << 4;
    }

    public static function getTileEntityName($count, FromJsonParent $parent) {
        $parent->name = TimingsMap::getTileEntityType($parent->name);
        return $count;
    }
    public static function getEntityName($count, FromJsonParent $parent) {
        $parent->name = TimingsMap::getEntityType($parent->name);
        return $count;
    }
}
