<?php

/**
 * Spigot Timings Parser
 *
 * Written by Aikar <aikar@aikar.co>
 *
 * @license MIT
 */
class TimingHandler extends TimingData {
    use FromJson;

    /**
     * @index 5
     * @var TimingData[]
     */
    public $children;

}
