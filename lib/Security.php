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
    }

    public function validateJson($data) {
        if (empty($data)) {
            Uploader::error("Invalid Format");
        }

        $count = count($data['data']);
        if ($count > 25) { // 24 frames + current snapshot
            Uploader::error("Too many History Entries. Please lower your history-length. Server only supports a max of 24 entries, which is calculated as length / interval.");
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
