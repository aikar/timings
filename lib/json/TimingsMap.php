<?php

/**
 * Spigot Timings Parser
 *
 * Written by Aikar <aikar@aikar.co>
 *
 * @license MIT
 */
class TimingsMap {
    use FromJson, FromJsonSingleton;

    /**
     * @index handlers
     * @var HandlerGroupMap[]
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
     * @var TimingIdentity[]
     */
    private $idMap = array();
    public function init() {
        foreach ($this->handlerMap as $group) {
            foreach ($group->handlers as $id => $handlerId) {
                $this->idMap[$id] = $handlerId;
            }
        }
    }

    /**
     * @param $id
     *
     * @return TimingIdentity
     */
    public static function getHandlerIdentity($id) {
        return self::getInstance()->idMap[$id];
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
