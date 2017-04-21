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

class TimingsSystemData {
	use FromJson;

	public $timingcost;
	public $name;
	public $version;
	public $jvmversion;
	public $arch;
	public $maxmem;
	public $cpu;
	public $runtime;
	public $flags;
	public $gc;
}
