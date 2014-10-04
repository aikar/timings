<?php

/**
 * Provides method to translate JSON Data into an object using PHP Doc comments.
 *
 * @see https://gist.github.com/aikar/52d2ef0870483696f059 for usage
 */
trait FromJson {
    /**
     * @param                $rootData
     * @param FromJsonParent $parentObj
     *
     * @return $this
     */
    public static function createObject($rootData, $parentObj = null) {
        $class = __CLASS__;
        $ref = new ReflectionClass($class);
        $props = $ref->getProperties(ReflectionProperty::IS_PUBLIC);
        $obj = new self();
        if (in_array('FromJsonSingleton', class_uses($class))) {
            /** @noinspection PhpUndefinedMethodInspection */
            self::getInstance($obj);
        }


        foreach ($props as $prop) {
            $name = $prop->getName();
            $comment = $prop->getDocComment();
            $parent = new FromJsonParent($name, $comment, $obj, $parentObj, null);

            $isExpectingArray = false;
            if (preg_match('/@var .+?\[.*?\]/', $comment, $matches)) {
                $isExpectingArray = true;
            }

            $index = $name;
            if (preg_match('/@index\s+([@\w\-]+)/', $comment, $matches)) {
                $index = $matches[1];

            }
            $vars = is_object($rootData) ? get_object_vars($rootData) : $rootData;

            if ($index == '@key') {
                $data = $parentObj->name;
            } else if ($index == '@value') {
                $data = $rootData;
            } else if (isset($vars[$index])) {
                $data = $vars[$index];
            } else {
                $data = null;
            }

            if ($data) {

                if ($isExpectingArray && !is_scalar($data)) {

                    $data = is_object($data) ? get_object_vars($data) : $data;

                    $result = [];
                    foreach ($data as $key => $entry) {
                        $arrParent = new FromJsonParent($key, $comment, $result, $parent);
                        $thisData = self::getData($entry, $arrParent);
                        $result[$arrParent->name] = $thisData;
                    }
                    $data = $result;
                } else {
                    $data = self::getData($data, $parent);
                }
            }
            $prop->setValue($obj, $data);
        }
        $obj->init();

        return $obj;
    }

    public function init() {

    }

    /**
     * @param                $data
     * @param FromJsonParent $parent
     * @return mixed
     */
    private static function getData($data, FromJsonParent $parent) {
        $className = null;
        if (preg_match('/@var\s+([\w_]+)(\[.*?\])?/', $parent->comment, $matches)) {
            $className = $matches[1];
        }

        if (preg_match('/@mapper\s+(.+?)\s/', $parent->comment, $matches)) {
            $data = call_user_func($matches[1], $data, $parent);
        } else if (class_exists($className) && in_array(__TRAIT__, class_uses($className))) {
            $data = call_user_func("$className::createObject", $data, $parent);
        } else if (!is_scalar($data)) {
            $data = Util::flattenObject($data);
        }

        return $data;
    }
}
trait FromJsonSingleton {
    public static $instance = null;

    /**
     * @param null $set
     *
     * @return $this
     */
    public static function getInstance($set = null) {
        static $instance = null;
        if ($set != null) {
            $instance = $set;
        }
        return $instance;
    }
}
class FromJsonParent {
    /**
     * @var FromJsonParent
     */
    public $parent;
    public $comment, $obj, $name, $root;

    function __construct($name, $comment, $obj, $parent) {
        $this->name = $name;
        $this->comment = $comment;
        $this->obj = $obj;
        $this->parent = $parent;
        $this->root = $parent == null || $parent->root == null ? $obj : $parent->root;
    }
}
