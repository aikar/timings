<?php
/**
 * Copyright (c) (2017) - Aikar's Minecraft Timings Parser
 *
 *  Written by Aikar <aikar@aikar.co>
 *    + Contributors (See AUTHORS)
 *
 *  http://aikar.co
 *  http://starlis.com
 *
 *  @license MIT
 *
 */

namespace Starlis\Timings;


use Stiphle\Storage\Apcu;
use Stiphle\Throttle\LeakyBucket;

class TimingsThrottle extends LeakyBucket {


	/**
	 * Throttle constructor.
	 */
	public function __construct() {
		parent::__construct();
		$this->storage = new Apcu();
	}

	public function throttle($key, $limit, $milliseconds) {

		$key = $this->getStorageKey($key, $limit, $milliseconds);
		$wait     = 0;
		$newRatio = $this->getNewRatio($key, $limit, $milliseconds);
		if ($newRatio > $milliseconds) {
			$wait = ceil($newRatio - $milliseconds);
		}
		if ($wait) {
			return $wait;
		}

		/**
		 * Lock, record and release
		 */
		$this->storage->lock($key);
		$newRatio = $this->getNewRatio($key, $limit, $milliseconds);
		$this->setLastRatio($key, $newRatio);
		$this->setLastRequest($key, microtime(1));
		$this->storage->unlock($key);
		return false;
	}
}
