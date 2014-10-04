<?php

/**
 * Spigot Timings Parser
 *
 * Written by Aikar <aikar@aikar.co>
 *
 * @license MIT
 */
class TimingsMaster {
    use FromJson, Singleton;

    public $version;
    public $maxplayers;
    public $start;
    public $end;
    public $sampletime;

    // <privacy false>
    public $server;
    public $motd;
    /**
     * @index online-mode
     */
    public $onlinemode;
    public $icon;
    // </privacy false>

    /**
     * @var TimingsSystemData
     */
    public $system;

    /**
     * @var TimingsMap
     */
    public $idmap;

    /**
     * @var Plugin[]
     */
    public $plugins;

    /**
     * @var TimingHistory[]
     */
    public $data;
}


