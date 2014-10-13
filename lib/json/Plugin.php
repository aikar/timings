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

class Plugin {
    use FromJson;

    /**
     * @index @key
     */
    public $name;

    public $version;
    public $description;
    public $website;
    public $authors;
} 
