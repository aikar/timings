<?php


class TimingIdentity {
    use FromJson;

    /**
     * @index @key
     * @var int
     */
    public $id;
    /**
     * @index @value
     * @var string
     */
    public $name;
    /**
     * @mapper getGroupName
     * @index @key
     * @var string
     */
    public $group;

    public static function getGroupName($id, FromJsonParent $parent) {
        return $parent->parent->parent->obj->name;
    }
} 
