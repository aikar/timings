<?php
/*
 * Copyright (c) (2021) - PebbleHost Timings Theme
 *
 *  Written by PebbleHost Team <support@pebblehost.com>
 *    + Contributors (See AUTHORS)
 *
 *  https://pebblehost.com
 *  
 *  See full license at /src/css/themes/LICENSE
 *
 */

namespace Starlis\Timings;

class Analyze
{
    public static function analyze($data)
    {
        // Decode and re-encode timingsMaster. Allows flexibility to parse timingsMaster from
        // foreign timings server if you wish to fetch the data from a different server
        $timingsMaster = json_decode(json_encode($data), true)['timingsMaster'];

        $spigot = $timingsMaster['config']['spigot'];
        $bukkit = $timingsMaster['config']['bukkit'];
        $paper = $timingsMaster['config']['paper'];
        // The server properties is only included in some builds eg. purpur
        $server_properties = @$timingsMaster['config']['server.properties'];

        $tips = AnalyzeTips::GetTips($timingsMaster, $bukkit, $spigot, $paper, $server_properties);

        // Sort tips alphabetically
        usort($tips, function ($a, $b) {
            return strcmp($a['title'], $b['title']);
        });

        // Respond to request as JSON
        header("Content-Type: application/json");
        echo json_encode([
            "tips" => $tips
        ]);
    }
}
