<?php
/**
 * Spigot Timings Parser
 *
 * Written by Aikar <aikar@aikar.co>
 *
 * @license MIT
 */

/**
 * Class GistService
 *
 * Processes uploads to Gist (GitHub Paste, Timings v2)
 */
class GistService extends StorageService {

	public function get($id) {
		$url = "https://gist.githubusercontent.com/anonymous/$id/raw/timings.xml";
		return $this->requestUrl($url);
	}
}
