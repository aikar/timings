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

class Log {
    public static function info($str) {
        self::out('<INFO> ' . $str);
    }

    public static function severe($str) {
        self::out('<SEVERE> ' . $str);
    }

    public static function out($str) {
        $str = explode("\n", $str);
        $f = fopen('/var/log/timings.log', 'a');
        foreach ($str as $line) {
            $log = $_SERVER['REMOTE_ADDR'] . ":" . getmypid() . "\t[" . date(DATE_W3C) . "]\t$line\n";
            fwrite($f, $log);
        }
        fclose($f);
    }

}
