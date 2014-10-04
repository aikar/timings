<?php

/**
 * Spigot Timings Parser
 *
 * Written by Aikar <aikar@aikar.co>
 *
 * @license MIT
 */
class TimingData {
    use FromJson;

    /**
     * @index 0
     * @var int
     */
    public $id;

    /**
     * @index  0
     * @var string
     * @mapper TimingData::getName
     */
    public $name;

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

    public static function getName($id, FromJsonParent $parent) {
        // TODO: Figure out how to do this.
        //$root->idmap->handlerMap
    }
} 
