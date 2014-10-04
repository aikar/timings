<?php
trait Singleton {
    protected static $instance;
    final public static function getInstance()
    {
        return isset(static::$instance)
            ? static::$instance
            : static::$instance = new static;
    }
}
