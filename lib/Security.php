<?php

/**
 * Implement super basic security rules.
 * Official parser uses a closed source version of this class.
 *
 * If you run a copy of the parser yourself, you should extend this more.
 */
class Security {
	function __construct() {
	}

	function verifyPre() {
		$ua = $_SERVER['HTTP_USER_AGENT'];
		if (empty($ua) || preg_match('/(Mozilla|curl|wget)/', $ua)) {
			Log::severe("Unauthorized Agent: $ua");
			Uploader::error("Unauthorized");
		}
	}

	public function validateData($data, $size) {
		if (empty($data)) {
			Log::severe("Sent Bad GZIP Data");
			Uploader::error("Invalid Format");
		}

		$json = json_decode($data);
		if (empty($json)) {
			Uploader::error("Invalid Format");
		}
	}

	public function verifyCompressedData($data, $size) {
		if (empty($data)) {
			Uploader::error("Missing Report");
		}

		$limit = 50 * 1024;
		if ($size > $limit) {
			Log::severe("Data too large: $size > $limit");
			Uploader::error("Data too large: $size > $limit");
		}
	}
}
