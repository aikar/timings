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

/**
 * @mapper normalizeData
 * @mapper TimingData::normalizeData
 */
class TimingHandler extends TimingData {
	use FromJson;

	/**
	 * @index     5
	 * @var TimingData[]
	 */
	public $children;

	/**
	 * @param $data
	 * @param $parent
	 *
	 * @return array
	 */
	public static function normalizeData($data, $parent) {
		if (!isset($data[5])) {
			$data[5] = array();
			if (isset($data[3]) && !is_scalar($data[3])) {
				$data[5] = $data[3];
			}

		}
		return TimingData::normalizeData($data, $parent);
	}

	public function __clone() {
		foreach ($this->children as &$child) {
			$child = clone $child;
		}
	}

	public function addDataFromHandler(TimingHandler $handler) {
		$this->addData($handler);
		foreach ($handler->children as $child) {
			$id = $child->id;

			if (isset($this->children[$id])) {
				$this->children[$id]->addData($child);
			} else {
				$this->children[$id] = clone $child;
			}
		}
	}

	public function init() {
	}


}
