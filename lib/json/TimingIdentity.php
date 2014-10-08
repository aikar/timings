<?php


class TimingIdentity {
    use FromJson;

    /**
     * @index @key
     * @var int
     */
    public $id;
    /**
     * @index 1
     * @var string
     */
    public $name;
    /**
     * @mapper TimingsMap::getGroupName
     * @index 0
     * @var string
     */
    public $group;

    public function __toString() {
        return $this->group . "::" . $this->name;
    }
} 
