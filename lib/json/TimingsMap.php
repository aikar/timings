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
namespace Starlis\Timings;

class TimingsMap {
    use FromJson, Singleton;

    /**
     * @index groups
     * @var string[]
     */
    public $groupMap;
    /**
     * @index handlers
     * @var TimingIdentity[]
     */
    public $handlerMap;

    /**
     * @index worlds
     * @var string[]
     */
    public $worldMap;

    /**
     * @index tileentity
     * @var string[]
     */
    public $tileEntityTypeMap;

    /**
     * @index entity
     * @var string[]
     */
    public $entityTypeMap;

    /**
     * @param $id
     *
     * @return string
     */
    public static function getGroupName($id) {
        return self::getInstance()->groupMap[$id];
    }

    /**
     * @param $id
     *
     * @return TimingIdentity
     */
    public static function getHandlerIdentity($id) {
        return self::getInstance()->handlerMap[$id];
    }

    /**
     * @param $id
     *
     * @return string
     */
    public static function getWorldName($id) {
        return self::getInstance()->worldMap[$id];
    }

    /**
     * @param $id
     *
     * @return string
     */
    public static function getEntityType($id) {
        return self::getInstance()->entityTypeMap[$id];
    }


    /**
     * @param $id
     *
     * @return string
     */
    public static function getTileEntityType($id) {
        return self::getInstance()->tileEntityTypeMap[$id];
    }
} 
