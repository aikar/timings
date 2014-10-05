<?php


class TimingIdentity {
    use FromJson;

    /**
     * @index @key
     * @var int
     */
    public $id;
    /**
     * @index n
     * @var string
     */
    public $name;
    /**
     * @mapper TimingsMap::getGroupName
     * @index g
     * @var string
     */
    public $group;

    public function __toString() {
        return $this->group . "::" . $this->name;
    }
} 
