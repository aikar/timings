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

class TimingIdentity {
	use FromJson;

	/**
	 * @index 1
	 * @var string
	 */
	public $name;
	/**
	 * @index  0
	 * @var string
	 */
	public $group;

	public function __toString() {
		return $this->group . "::" . $this->name;
	}
}
