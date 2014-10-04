<?php

/**
 * Spigot Timings Parser
 *
 * Written by Aikar <aikar@aikar.co>
 *
 * @license MIT
 */
class CacheStorage extends StorageService {

    public function get($id) {
        return Cache::get($id);
    }
}
