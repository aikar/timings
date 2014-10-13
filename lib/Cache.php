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

class Cache {
    /**
     * Get Cached Data
     *
     * @param        $key
     * @param string $type
     *
     * @return null|string
     */
    public static function get($key, $type='timings') {
        $file = self::getFile($key, $type);
        if (file_exists($file)) {
            touch($file);
            return trim(gzdecode(file_get_contents($file)));
        }

        return null;
    }


    /**
     * Put data into cache
     *
     * @param        $key
     * @param        $data
     * @param string $type
     */
    public static function put($key, $data, $type='timings') {
        $file = self::getFile($key, $type);
        file_put_contents($file, gzencode($data));
    }


    /**
     * Retrieves a cached object
     * @param $key
     *
     * @return mixed
     */
    public static function getObject($key) {
        return unserialize(self::get($key, "objectcache"));
    }

    /**
     * Saves serialized data for fast loading of parsed data.
     * @param $key
     * @param $data
     */
    public static function putObject($key, $data) {
        $data = serialize($data);
        if ($data) {
            self::put($key, $data, "objectcache");
        }
    }

    /**
     * Sanitizes a key name and returns a cache file name for it.
     * @param $key
     * @param $type
     *
     * @return string
     */
    public static function getFile($key, $type ='timings') {
        $key = preg_replace('/[^a-zA-Z0-9-_]/ms', '', $key);
        return "/tmp/{$type}_{$key}.gz";
    }
}
