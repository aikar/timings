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
namespace Starlis\Timings\Json;
use Starlis\Timings\FromJson;

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
