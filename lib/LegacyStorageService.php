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

class LegacyStorageService extends StorageService {
	public function get($id) {
		$data = Cache::get($id);
		if (!$data) {
			$data = $this->requestUrl('http://paste.ubuntu.com/' . intval($id));
			if (preg_match_all('/<pre>(.*?)<\/pre>/msi', $data, $m)) {
				$data = $m[1][1];
			}
		} else {
		}

		return Util::sanitize($data);
	}
}
