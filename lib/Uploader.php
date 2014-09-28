<?php
/**
 * Spigot Timings Parser
 *
 * Written by Aikar <aikar@aikar.co>
 *
 * @license MIT
 */

class Uploader {

	public static function process() {
		$security = new Security();
		$security->verifyPre();

		$data = stream_get_contents(fopen('php://input', 'r'));

		$compressedSize = strlen($data);
		$security->verifyCompressedData($data, $compressedSize);

		$data = @gzdecode($data);

		$uncompressedSize = strlen($data);
		$security->validateData($data, $uncompressedSize);

		$key = Util::uuid(false);
		Cache::put($key, $data, true);
		header("Location: " . BASE_URL_VIEW . "/?id=$key");
		self::error("Compressed Size: $compressedSize\nUncompressed Size: $uncompressedSize\nRaw Upload: " . BASE_URL_VIEW . "/?id=$key&raw=1");
	}

	public static function error($str) {
		echo $str;
		exit;
	}
}
