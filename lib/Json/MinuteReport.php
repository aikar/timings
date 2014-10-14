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

class MinuteReport {
    use FromJson;
    /**
     * @index 0
     * @var int
     */
    public $time;

    /**
     * @index 1
     * @var float
     */
    public $tps;

    /**
     * @index 2
     * @var float
     */
    public $avgPing;

    /**
     * @index 3
     * @var TimingData
     */
    public $fullServerTick;
    /**
     * @index 4
     * @var TicksRecord
     */
    public $ticks;
} 
