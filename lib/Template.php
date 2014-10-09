<?php

class Template {
    use Singleton;
    public $history;
    public $js = array();
    public $tpsData;
    public $lagData;
    /**
     * @var TimingHandler[]
     */
    public $handlerData;
    public static function render() {
        require "template/index.php";
    }

    public static function loadData() {
        $timings = SpigotTimings::getInstance();
        $timings->loadData();
        $data = TimingsMaster::getInstance();
        $tpl = self::getInstance();
        $tpl->js['ranges'] = array();
        $ranges =& $tpl->js['ranges'];

        foreach ($data->data as $history) {
            $ranges[] = $history->start;
            $ranges[] = $history->end;
        }

        $last = count($ranges)-1;
        $tpl->js['start'] = $start = (!empty($_GET['start']) ? intval($_GET['start']) : $ranges[$last-1]);
        $tpl->js['end']   = $end   = (!empty($_GET['end']) ? intval($_GET['end']) : $ranges[$last]);

        /**
         * @var TimingHandler[] $handlerData
         */
        $handlerData = array();
        $lagData = array();
        $tpsData = array();
        $timestamps = array();
        $max = 0;
        foreach ($data->data as $history) {
            foreach ($history->minuteReports as $mp) {
                $total = $mp->fullServerTick->total;
                $lag = $mp->fullServerTick->lagTotal;
                $max = max($total, $max);

                $timestamps[] = $mp->time;
                $tpsData[] = $mp->tps > 19.85 ? 20 : $mp->tps;
                $lagData[] = $lag;
            }

            if ($history->start >= $start && $history->end <= $end) {
                foreach ($history->handlers as $handler) {
                    $id = $handler->id->id;
                    if (!isset($handlerData[$id])) {
                        $handlerData[$id] = clone $handler;
                    } else {
                        $handlerData[$id]->addDataFromHandler($handler);
                    }
                }
            }
        }
        $tpl->handlerData = $handlerData;
        $tpl->js['timestamps'] = $timestamps;
        $tpl->js['maxTime'] = $max;
        $tpl->js['lagData'] = $lagData;
        $tpl->js['tpsData'] = $tpsData;
        $tpl->js['id'] = $timings->id;
        $tpl->lagData = $lagData;
        $tpl->tpsData = $tpsData;
    }

    public function getData() {
        return json_encode($this->js);
    }
} 
