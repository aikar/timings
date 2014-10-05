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
     * @keymapper TimingData::mapIdKey
     * @index 5
     * @var TimingData[]
     */
    public $children;

    public function __clone() {
        foreach ($this->children as &$child) {
            $child = clone $child;
        }
    }

    public function addDataFromHandler(TimingHandler $handler) {
        $this->addData($handler);
        foreach ($handler->children as $child) {
            $id = $child->id->id;
            if (isset($this->children[$id])) {
                $this->children[$id]->addData($child);
            } else {
                $this->children[$id] = clone $child;
            }
        }
    }
}
