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

		$json = json_decode($data, true);
		$security->validateJson($json);

		if (isset($json['icon'])) {
			$img = self::getServerIcon($json['icon']);
			$json['icon'] = $img;
			Log::info("Valid Image: $img");
			$data = json_encode($json);
			$uncompressedSize = strlen($data);
		} else {

		}
		$key = util::uuid(false);

		$cacheFile = Cache::getFile($key);
		Log::info("Uploaded $uncompressedSize bytes as $key to $cacheFile");
		Cache::put($key, $data);
		header("Location: " . BASE_URL_VIEW . "/?id=$key");
		//self::output("Compressed Size: $compressedSize\nUncompressed Size: $uncompressedSize\nRaw Upload: " . BASE_URL_VIEW . "/?id=$key&raw=1");
	}

	public static function getServerIcon($base64) {
		$base64 = substr($base64, strlen("data:image/png;base64,"));
		$img = imagecreatefromstring(base64_decode($base64));
		if (!$img) {
			Log::info("Bad Image");

			return null;
		}
		$hash = sha1($base64);
		$tmp = "/tmp/timingsimg_$hash";
		@imagepng($img, $tmp);
		$info = @getimagesize($tmp);

		if (!empty($info) && $info[0] === 64 && $info[1] === 64 && $info['mime'] === 'image/png') {
			return $hash;
		}
		Log::info("Bad Image Meta: " . print_r($info, true));
		unlink($tmp);

		return null;
	}

	public static function output($str) {
		echo $str;
		exit;
	}

	public static function error($str) {
		if ($str === "Unauthorized") {
			header("HTTP/1.1 401 Unauthorized", 401);
		} else {
			header("HTTP/1.1 400 $str", 400);
		}
		echo $str;
		exit;
	}
}
