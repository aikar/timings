<?php
/**
 * Spigot Timings Parser
 *
 * Written by Aikar <aikar@aikar.co>
 *
 * @license MIT
 */

class TimingsSystemdata {
	use FromJson;
	public $timingcost;
	public $name;
	public $version;
	public $arch;
	public $totalmem;
	public $usedmem;
	public $maxmem;
	public $cpu;
	public $runtime;
}
