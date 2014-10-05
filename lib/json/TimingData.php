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

    public function addData(TimingData $data) {
        $this->count += $data->count;
        $this->total += $data->total;
        $this->lagCount += $data->lagCount;
        $this->lagTotal += $data->lagTotal;
    }
} 
