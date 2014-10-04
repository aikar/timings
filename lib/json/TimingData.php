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
     * @mapper TimingsMap::getId
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
} 
