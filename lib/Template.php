<?php

class Template {
    use Singleton;
    public $history;
    public $js = array();
    public static function render() {
        require "template/index.php";
    }

    public static function loadData() {
        SpigotTimings::getInstance()->loadData();
        $data = TimingsMaster::getInstance();
        $tpl = self::getInstance();
        $tpl->js['history'] = array();
        $start = -1;
        $end = -1;
        foreach ($data->data as $history) {
            if ($start == -1) $start = $history->start;
            $end = $history->end;
            $tpl->js['history'][] = $history->start;
            $tpl->js['history'][] = $history->end;
        }
        $tpl->js['start'] = $start;
        $tpl->js['end'] = $end;
    }

    public function getData() {
        return json_encode($this->js);
    }
} 
