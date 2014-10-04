<?php

/**
 * Spigot Timings Parser
 *
 * Written by Aikar <aikar@aikar.co>
 *
 * @license MIT
 */
class MinuteReport {
    use FromJson;
    /**
     * @index t
     * @var int
     */
    public $time;

    /**
     * @var float
     */
    public $tps;
    /**
     * @index tick
     * @var TicksRecord
     */
    public $ticks;
    /**
     * @var PingRecord
     */
    public $ping;

} 
