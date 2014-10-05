<?php

/**
 * Spigot Timings Parser
 *
 * Written by Aikar <aikar@aikar.co>
 *
 * @license MIT
 */
class SpigotTimings {
    use Singleton;
    private $data;
    private $checkedType = false;
    private $isLegacy = false;
    private $id;
    /**
     * @var StorageService
     */
    private $storage;

    public static function bootstrap() {
        $timings = self::getInstance();
        $timings->prepareData();
        Template::render();
    }

    public function prepareData() {
        /**
         * @var StorageService $storage
         */
        $storage = new CacheStorage();
        $id = null;

        if (!empty($_GET['url'])) {
            $id = $_GET['url'];
            $storage = new LegacyStorageService();
        } else if (!empty($_GET['id'])) {
            $id = $_GET['id'];
        } else if (TIMINGS_ENV == 'dev') {
            $id = 'b3b6514347a04b36971c3304fd9cbd50'; // DEV test
        }
        $id = Util::sanitizeHex($id);
        $this->id = $id;
        $this->storage = $storage;

        if ($storage instanceof LegacyStorageService || TIMINGS_ENV != 'dev') {
            LegacyHandler::load(trim($storage->get($id)));
            exit;
        }
    }

    public function isLegacy() {
        if (!$this->checkedType) {
            $start = substr($this->data, 0, 2);
            $this->isLegacy = $start != '{"';
            $this->checkedType = true;
        }

        return $this->isLegacy;
    }

    public function loadData() {
        $id = $this->id;
        if ($id) {
            $this->data = trim($this->storage->get($id));

            if (!empty($_GET['raw'])) {
                header("Content-Type: text/plain");
                echo json_encode(json_decode($this->data), JSON_PRETTY_PRINT);
                die;
            }
            $this->data = TimingsMaster::createObject(json_decode($this->data));
            $GLOBALS['timingsData'] = $this->data;
        }

    }
} 
