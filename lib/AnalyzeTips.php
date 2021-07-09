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
 *  Credit to https://www.spigotmc.org/threads/283181/ for some of the values used
 */

namespace Starlis\Timings;

class AnalyzeTips
{
    public static function GetTips($timingsMaster, $bukkit, $spigot, $paper, $server_properties) {
        $tips = [];
        
        // Test each warning's expressions and make sure they are all true
        if ($timingsMaster["sampletime"] < (60 * 20)) {
            $tips[] = [
                'file' => 'generic',
                'title' => 'Short sample time',
                'type' => 'warning',
                'desc' => 'Timings benefits greatly from a larger sample time. Please try to run another report that lasts more than 20 minutes.',
            ];
        }

        if ((((int)$server_properties["network-compression-threshold"]) <= 256) && ($spigot["settings"]["bungeecord"] === "false")) {
            $tips[] = [
                'file' => 'server.properties',
                'title' => 'network-compression-threshold',
                'type' => 'increase',
                'desc' => 'A higher network compression threshold means the CPU spends less time compressing smaller packets. Increase this to 512.',
            ];
        }

        if (((int)$bukkit["chunk-gc"]["period-in-ticks"]) >= 600) {
            $tips[] = [
                'file' => 'bukkit.yml',
                'title' => 'chunk-gc.period-in-ticks',
                'type' => 'decrease',
                'desc' => 'If GC runs too infrequently this can result in noticeable spikes. Decrease the garbage collection period-in-ticks to 400.',
            ];
        }

        if (((int)$bukkit["spawn-limits"]["monsters"]) >= 70) {
            $tips[] = [
                'file' => 'bukkit.yml',
                'title' => 'spawn-limits.monsters',
                'type' => 'decrease',
                'desc' => 'It\'s recommended to decrease the spawn limit to 15 which means that less mobs will spawn which causes less load on the server.',
            ];
        }

        if (((int)$bukkit["spawn-limits"]["water-ambient"]) >= 20) {
            $tips[] = [
                'file' => 'bukkit.yml',
                'title' => 'spawn-limits.water-ambient',
                'type' => 'decrease',
                'desc' => 'It\'s recommended to decrease the water ambient limit to 5 which means that less water mobs will spawn which causes less load on the server.',
            ];
        }

        if (((int)$bukkit["spawn-limits"]["ambient"]) >= 15) {
            $tips[] = [
                'file' => 'bukkit.yml',
                'title' => 'spawn-limits.ambient',
                'type' => 'decrease',
                'desc' => 'It\'s recommended to decrease the ambient mob limit to 1 which means that less ambient mobs will spawn which causes less load on the server.',
            ];
        }

        if (((int)$bukkit["spawn-limits"]["animals"]) >= 15) {
            $tips[] = [
                'file' => 'bukkit.yml',
                'title' => 'spawn-limits.animals',
                'type' => 'decrease',
                'desc' => 'It\'s recommended to decrease the animal limit to 5 which means that less animals will spawn which causes less load on the server.',
            ];
        }

        if (((int)$bukkit["spawn-limits"]["water-animals"]) >= 15) {
            $tips[] = [
                'file' => 'bukkit.yml',
                'title' => 'spawn-limits.water-animals',
                'type' => 'decrease',
                'desc' => 'It\'s recommended to decrease the water animal limit to 5 which means that less water animals will spawn which causes less load on the server.',
            ];
        }

        if ((((int)$server_properties["view-distance"]) >= 10) && ($spigot["world-settings"]["default"]["view-distance"] == "default")) {
            $tips[] = [
                'file' => 'server.properties',
                'title' => 'view-distance',
                'type' => 'decrease',
                'desc' => 'It\'s recommended to decrease the view limit so the server has to load less chunks for each player.',
            ];
        }

        if (((int)$spigot["world-settings"]["default"]["entity-activation-range"]["animals"]) >= 32) {
            $tips[] = [
                'file' => 'spigot.yml',
                'title' => 'entity-activation-range.animals',
                'type' => 'decrease',
                'desc' => 'It\'s recommended to decrease the entity activation range to 16 meaning that animals far away from players will not be processed.',
            ];
        }

        if (((int)$spigot["world-settings"]["default"]["entity-activation-range"]["monsters"]) >= 32) {
            $tips[] = [
                'file' => 'spigot.yml',
                'title' => 'entity-activation-range.monsters',
                'type' => 'decrease',
                'desc' => 'It\'s recommended to decrease the entity activation range to 16 meaning that monsters far away from players will not be processed. Note that this can have an adverse effect on any mob farms or grinders.',
            ];
        }

        if (((int)$spigot["world-settings"]["default"]["entity-activation-range"]["misc"]) >= 16) {
            $tips[] = [
                'file' => 'spigot.yml',
                'title' => 'entity-activation-range.misc',
                'type' => 'decrease',
                'desc' => 'It\'s recommended to decrease the activation range to 12 meaning that other entities far away from players will not be processed.',
            ];
        }

        if (((int)$spigot["world-settings"]["default"]["entity-activation-range"]["water"]) >= 16) {
            $tips[] = [
                'file' => 'spigot.yml',
                'title' => 'entity-activation-range.water',
                'type' => 'decrease',
                'desc' => 'It\'s recommended to decrease the activation range to 12 meaning that water entities far away from players will not be processed.',
            ];
        }

        if (((int)$spigot["world-settings"]["default"]["entity-activation-range"]["villagers"]) >= 32) {
            $tips[] = [
                'file' => 'spigot.yml',
                'title' => 'entity-activation-range.villagers',
                'type' => 'decrease',
                'desc' => 'It\'s recommended to decrease the activation range to 16 meaning that villagers far away from players will not be processed. Note that this could cause issues with technical gameplay involving villager farms.',
            ];
        }

        if ($spigot["world-settings"]["default"]["nerf-spawner-mobs"] === "false") {
            $tips[] = [
                'file' => 'spigot.yml',
                'title' => 'nerf-spawner-mobs',
                'type' => 'enable',
                'desc' => 'It\'s recommended to enable this, which means any mobs that come from a spawner will have no AI, massively reducing the impact of mob farms if you have a number of these.',
            ];
        }

        if (((int)$spigot["world-settings"]["default"]["arrow-despawn-rate"]) >= 1200) {
            $tips[] = [
                'file' => 'spigot.yml',
                'title' => 'arrow-despawn-rate',
                'type' => 'decrease',
                'desc' => 'It\'s recommended to decrease this to 300, meaning arrow entities in your world will despawn more quickly.',
            ];
        }

        if (((float)$spigot["world-settings"]["default"]["merge-radius"]["item"]) <= 2.5) {
            $tips[] = [
                'file' => 'spigot.yml',
                'title' => 'merge-radius.item',
                'type' => 'increase',
                'desc' => 'It\'s recommended to increase this to 4, so that items near to each other are merged into a single stack.',
            ];
        }

        if (((float)$spigot["world-settings"]["default"]["merge-radius"]["exp"]) <= 3.0) {
            $tips[] = [
                'file' => 'spigot.yml',
                'title' => 'merge-radius.exp',
                'type' => 'increase',
                'desc' => 'It\'s recommended to increase this to 6, so that XP orbs near to each other are merged into a single stack.',
            ];
        }

        if (((int)$spigot["world-settings"]["default"]["max-entity-collisions"]) >= 8) {
            $tips[] = [
                'file' => 'spigot.yml',
                'title' => 'max-entity-collisions',
                'type' => 'decrease',
                'desc' => 'It\'s recommended to decrease this to 2, this means less entities can be crammed into a single block reducing the possibility of having too many mobs in one area.',
            ];
        }

        if (((int)$paper["world-settings"]["default"]["max-auto-save-chunks-per-tick"]) >= 24) {
            $tips[] = [
                'file' => 'paper.yml',
                'title' => 'max-auto-save-chunks-per-tick',
                'type' => 'decrease',
                'desc' => 'It\'s recommended to decrease this to 6, so that the server tries to save less chunks per tick, spreading out chunk saves over a longer period of time.',
            ];
        }

        if ($paper["world-settings"]["default"]["optimize-explosions"] === "false") {
            $tips[] = [
                'file' => 'paper.yml',
                'title' => 'optimize-explosions',
                'type' => 'enable',
                'desc' => 'It\'s recommended to enable this to allow Paper\'s improved explosion performance, this is with the downside that it can affect the vanilla explosion mechanics.',
            ];
        }

        if (((int)$paper["world-settings"]["default"]["mob-spawner-tick-rate"]) === 1) {
            $tips[] = [
                'file' => 'paper.yml',
                'title' => 'mob-spawner-tick-rate',
                'type' => 'increase',
                'desc' => 'It\'s recommended to increase this to 2 to perform mob spawner checks less often, but will spawn more mobs each time it performs a check.',
            ];
        }

        if ($paper["world-settings"]["default"]["game-mechanics"]["disable-chest-cat-detection"] === "false") {
            $tips[] = [
                'file' => 'paper.yml',
                'title' => 'game-mechanics.disable-chest-cat-detection',
                'type' => 'enable',
                'desc' => 'It\'s recommended to enable this, to stop the game from repeatedly looking at each chest to check if there is a cat on top of it.',
            ];
        }

        if (((int)$paper["world-settings"]["default"]["container-update-tick-rate"]) === 1) {
            $tips[] = [
                'file' => 'paper.yml',
                'title' => 'container-update-tick-rate',
                'type' => 'increase',
                'desc' => 'It\'s recommended to increase this to 3, so that chests update their inventory less often to players, reducing the lag when lots of players have chests open.',
            ];
        }

        if (((int)$paper["world-settings"]["default"]["grass-spread-tick-rate"]) === 1) {
            $tips[] = [
                'file' => 'paper.yml',
                'title' => 'grass-spread-tick-rate',
                'type' => 'increase',
                'desc' => 'It\'s recommended to increase this to 4, so the game checks less often to see if grass should spread, but has a higher chance for it to spread.',
            ];
        }

        if (((int)$paper["world-settings"]["default"]["despawn-ranges"]["soft"]) >= 32) {
            $tips[] = [
                'file' => 'paper.yml',
                'title' => 'despawn-ranges.soft',
                'type' => 'decrease',
                'desc' => 'It\'s recommended to decrease this to 28, this means that mobs more than 28 blocks away from the player will start to randomly despawn every few ticks.',
            ];
        }

        if (((int)$paper["world-settings"]["default"]["despawn-ranges"]["hard"]) >= 128) {
            $tips[] = [
                'file' => 'paper.yml',
                'title' => 'despawn-ranges.hard',
                'type' => 'decrease',
                'desc' => 'It\'s recommended to decrease this to 96, this means that mobs more than 96 blocks away from the player will instantly despawn.',
            ];
        }

        if ($paper["world-settings"]["default"]["hopper"]["disable-move-event"] === "false") {
            $tips[] = [
                'file' => 'paper.yml',
                'title' => 'hopper.disable-move-event',
                'type' => 'enable',
                'desc' => 'It\'s recommended to enable this, to disable hoppers from ticking each inventory slot each time an item is transferred.',
            ];
        }

        if (((int)$paper["world-settings"]["default"]["non-player-arrow-despawn-rate"]) === -1) {
            $tips[] = [
                'file' => 'paper.yml',
                'title' => 'non-player-arrow-despawn-rate',
                'type' => 'increase',
                'desc' => 'It\'s recommended to increase this to 60 ticks, so that arrows that cannot be picked up (from an infinity bow) despawn within seconds.',
            ];
        }

        if (((int)$paper["world-settings"]["default"]["creative-arrow-despawn-rate"]) === -1) {
            $tips[] = [
                'file' => 'paper.yml',
                'title' => 'creative-arrow-despawn-rate',
                'type' => 'increase',
                'desc' => 'It\'s recommended to increase this to 60 ticks, so that arrows that cannot be picked up (from a creative player) despawn within seconds.',
            ];
        }

        if ($paper["world-settings"]["default"]["prevent-moving-into-unloaded-chunks"] === "false") {
            $tips[] = [
                'file' => 'paper.yml',
                'title' => 'prevent-moving-into-unloaded-chunks',
                'type' => 'enable',
                'desc' => 'It\'s recommended to enable this, so players have to wait for each next chunk to load before entering it, limiting the rate at which players can generate/load chunks.',
            ];
        }

        if ($paper["world-settings"]["default"]["use-faster-eigencraft-redstone"] === "false") {
            $tips[] = [
                'file' => 'paper.yml',
                'title' => 'use-faster-eigencraft-redstone',
                'type' => 'enable',
                'desc' => 'It\'s recommended to enable this, so Paper will use their optimized redstone implementation. This should still work correctly with all redstone builds.',
            ];
        }

        if ($paper["world-settings"]["default"]["fix-climbing-bypassing-cramming-rule"] === "false") {
            $tips[] = [
                'file' => 'paper.yml',
                'title' => 'fix-climbing-bypassing-cramming-rule',
                'type' => 'enable',
                'desc' => 'It\'s recommended to enable this, so the server does not have to check if an entity is climbing on a ladder when calculating entity cramming rules.',
            ];
        }

        if ($paper["world-settings"]["default"]["armor-stands-do-collision-entity-lookups"] === "true") {
            $tips[] = [
                'file' => 'paper.yml',
                'title' => 'armor-stands-do-collision-entity-lookups',
                'type' => 'disable',
                'desc' => 'It\'s recommended to disable this, so the server does not have to check entity cramming rules for armour stands.',
            ];
        }

        if ($paper["world-settings"]["default"]["armor-stands-tick"] === "true") {
            $tips[] = [
                'file' => 'paper.yml',
                'title' => 'armor-stands-tick',
                'type' => 'disable',
                'desc' => 'It\'s recommended to disable this, so the server does not have to perform any logic when ticking armor stands.',
            ];
        }

        if ($paper["world-settings"]["default"]["per-player-mob-spawns"] === "false") {
            $tips[] = [
                'file' => 'paper.yml',
                'title' => 'per-player-mob-spawns',
                'type' => 'enable',
                'desc' => 'It\'s recommended to enable this, so each player has their own mob limit rather than each chunk.',
            ];
        }

        if ($paper["world-settings"]["default"]["alt-item-despawn-rate"]["enabled"] === "false") {
            $tips[] = [
                'file' => 'paper.yml',
                'title' => 'alt-item-despawn-rate.enabled',
                'type' => 'enable',
                'desc' => 'It\'s recommended to enable this, so that Cobblestone will despawn within a few seconds, you can also configure other rules to despawn specific items more quickly.',
            ];
        }
        return $tips;
    }
}
