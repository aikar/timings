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

let checks = [
  {
    file: "server.properties",
    title: "network-compression-threshold",
    type: "increase",
    check: ({ serverProperties, spigot }) => (
      parseInt(serverProperties['network-compression-threshold']) <= 256 && 
      spigot.settings.bungeecord === 'false'
    ),
    desc: "A higher network compression threshold means the CPU spends less time compressing smaller packets. Increase this to 512."
  },
  {
    file: "bukkit.yml",
    title: "chunk-gc.period-in-ticks",
    type: "decrease",
    check: ({ bukkit }) => parseInt(bukkit['chunk-gc']['period-in-ticks']) >= 600,
    desc: "If GC runs too infrequently this can result in noticeable spikes. Decrease the garbage collection period-in-ticks to 400."
  },
  {
    file: "bukkit.yml",
    title: "spawn-limits.monsters",
    type: "decrease",
    check: ({ bukkit }) => parseInt(bukkit['spawn-limits']['monsters']) >= 70,
    desc: "It's recommended to decrease the spawn limit to 15 which means that less mobs will spawn which causes less load on the server."
  },
  {
    file: "bukkit.yml",
    title: "spawn-limits.water-ambient",
    type: "decrease",
    check: ({ bukkit }) => parseInt(bukkit['spawn-limits']['water-ambient']) >= 20,
    desc: "It's recommended to decrease the water ambient limit to 5 which means that less water mobs will spawn which causes less load on the server."
  },
  {
    file: "bukkit.yml",
    title: "spawn-limits.ambient",
    type: "decrease",
    check: ({ bukkit }) => parseInt(bukkit['spawn-limits']['ambient']) >= 15,
    desc: "It's recommended to decrease the ambient mob limit to 1 which means that less ambient mobs will spawn which causes less load on the server."
  },
  {
    file: "bukkit.yml",
    title: "spawn-limits.animals",
    type: "decrease",
    check: ({ bukkit }) => parseInt(bukkit['spawn-limits']['animals']) >= 15,
    desc: "It's recommended to decrease the animal limit to 5 which means that less animals will spawn which causes less load on the server."
  },
  {
    file: "bukkit.yml",
    title: "spawn-limits.water-animals",
    type: "decrease",
    check: ({ bukkit }) => parseInt(bukkit['spawn-limits']['water-animals']) >= 15,
    desc: "It's recommended to decrease the water animal limit to 5 which means that less water animals will spawn which causes less load on the server."
  },
  {
    file: "server.properties",
    title: "view-distance",
    type: "decrease",
    check: ({ serverProperties, spigotWorldDefaultSettings }) => (
      parseInt(serverProperties['view-distance']) >= 10 &&
      spigotWorldDefaultSettings['view-distance'] === 'default'
    ),
    desc: "It's recommended to decrease the view limit so the server has to load less chunks for each player."
  },
  {
    file: "spigot.yml",
    title: "entity-activation-range.animals",
    type: "decrease",
    check: ({ spigotWorldDefaultSettings }) => parseInt(spigotWorldDefaultSettings['entity-activation-range']['animals']) >= 32,
    desc: "It's recommended to decrease the entity activation range to 16 meaning that animals far away from players will not be processed."
  },
  {
    file: "spigot.yml",
    title: "entity-activation-range.monsters",
    type: "decrease",
    check: ({ spigotWorldDefaultSettings }) => parseInt(spigotWorldDefaultSettings['entity-activation-range']['monsters']) >= 32,
    desc: "It's recommended to decrease the entity activation range to 16 meaning that monsters far away from players will not be processed. Note that this can have an adverse effect on any mob farms or grinders."
  },
  {
    file: "spigot.yml",
    title: "entity-activation-range.misc",
    type: "decrease",
    check: ({ spigotWorldDefaultSettings }) => parseInt(spigotWorldDefaultSettings['entity-activation-range']['misc']) >= 16,
    desc: "It's recommended to decrease the activation range to 12 meaning that other entities far away from players will not be processed."
  },
  {
    file: "spigot.yml",
    title: "entity-activation-range.water",
    type: "decrease",
    check: ({ spigotWorldDefaultSettings }) => parseInt(spigotWorldDefaultSettings['entity-activation-range']['water']) >= 16,
    desc: "It's recommended to decrease the activation range to 12 meaning that water entities far away from players will not be processed."
  },
  {
    file: "spigot.yml",
    title: "entity-activation-range.villagers",
    type: "decrease",
    check: ({ spigotWorldDefaultSettings }) => parseInt(spigotWorldDefaultSettings['entity-activation-range']['villagers']) >= 32,
    desc: "It's recommended to decrease the activation range to 16 meaning that villagers far away from players will not be processed. Note that this could cause issues with technical gameplay involving villager farms."
  },
  {
    file: "spigot.yml",
    title: "nerf-spawner-mobs",
    type: "enable",
    check: ({ spigotWorldDefaultSettings }) => spigotWorldDefaultSettings['nerf-spawner-mobs'] === 'false',
    desc: "It's recommended to enable this, which means any mobs that come from a spawner will have no AI, massively reducing the impact of mob farms if you have a number of these."
  },
  {
    file: "spigot.yml",
    title: "arrow-despawn-rate",
    type: "decrease",
    check: ({ spigotWorldDefaultSettings }) => parseInt(spigotWorldDefaultSettings['arrow-despawn-rate']) >= 1200,
    desc: "It's recommended to decrease this to 300, meaning arrow entities in your world will despawn more quickly."
  },
  {
    file: "spigot.yml",
    title: "merge-radius.item",
    type: "increase",
    check: ({ spigotWorldDefaultSettings }) => parseFloat(spigotWorldDefaultSettings['merge-radius']['item']) <= 2.5,
    desc: "It's recommended to increase this to 4, so that items near to each other are merged into a single stack."
  },
  {
    file: "spigot.yml",
    title: "merge-radius.exp",
    type: "increase",
    check: ({ spigotWorldDefaultSettings }) => parseFloat(spigotWorldDefaultSettings['merge-radius']['exp']) <= 3,
    desc: "It's recommended to increase this to 6, so that XP orbs near to each other are merged into a single stack."
  },
  {
    file: "spigot.yml",
    title: "max-entity-collisions",
    type: "decrease",
    check: ({ spigotWorldDefaultSettings }) => parseInt(spigotWorldDefaultSettings['max-entity-collisions']) >= 8,
    desc: "It's recommended to decrease this to 2, this means less entities can be crammed into a single block reducing the possibility of having too many mobs in one area."
  },
  {
    file: "paper.yml",
    title: "max-auto-save-chunks-per-tick",
    type: "decrease",
    check: ({ paperWorldDefaultSettings }) => parseInt(paperWorldDefaultSettings['max-auto-save-chunks-per-tick']) >= 24,
    desc: "It's recommended to decrease this to 6, so that the server tries to save less chunks per tick, spreading out chunk saves over a longer period of time."
  },
  {
    file: "paper.yml",
    title: "optimize-explosions",
    type: "enable",
    check: ({ paperWorldDefaultSettings }) => paperWorldDefaultSettings['optimize-explosions'] === 'false',
    desc: "It's recommended to enable this to allow Paper's improved explosion performance, this is with the downside that it can affect the vanilla explosion mechanics."
  },
  {
    file: "paper.yml",
    title: "mob-spawner-tick-rate",
    type: "increase",
    check: ({ paperWorldDefaultSettings }) => parseInt(paperWorldDefaultSettings['mob-spawner-tick-rate']) === 1,
    desc: "It's recommended to increase this to 2 to perform mob spawner checks less often, but will spawn more mobs each time it performs a check."
  },
  {
    file: "paper.yml",
    title: "game-mechanics.disable-chest-cat-detection",
    type: "enable",
    check: ({ paperWorldDefaultSettings }) => paperWorldDefaultSettings['game-mechanics']['disable-chest-cat-detection'] === 'false',
    desc: "It's recommended to enable this, to stop the game from repeatedly looking at each chest to check if there is a cat on top of it."
  },
  {
    file: "paper.yml",
    title: "container-update-tick-rate",
    type: "increase",
    check: ({ paperWorldDefaultSettings }) => parseInt(paperWorldDefaultSettings['container-update-tick-rate']) === 1,
    desc: "It's recommended to increase this to 3, so that chests update their inventory less often to players, reducing the lag when lots of players have chests open."
  },
  {
    file: "paper.yml",
    title: "grass-spread-tick-rate",
    type: "increase",
    check: ({ paperWorldDefaultSettings }) => parseInt(paperWorldDefaultSettings['grass-spread-tick-rate']) === 1,
    desc: "It's recommended to increase this to 4, so the game checks less often to see if grass should spread, but has a higher chance for it to spread."
  },
  {
    file: "paper.yml",
    title: "despawn-ranges.soft",
    type: "decrease",
    check: ({ paperWorldDefaultSettings }) => parseInt(paperWorldDefaultSettings['despawn-ranges']['soft']) >= 32,
    desc: "It's recommended to decrease this to 28, this means that mobs more than 28 blocks away from the player will start to randomly despawn every few ticks."
  },
  {
    file: "paper.yml",
    title: "despawn-ranges.hard",
    type: "decrease",
    check: ({ paperWorldDefaultSettings }) => parseInt(paperWorldDefaultSettings['despawn-ranges']['hard']) >= 128,
    desc: "It's recommended to decrease this to 96, this means that mobs more than 96 blocks away from the player will instantly despawn."
  },
  {
    file: "paper.yml",
    title: "hopper.disable-move-event",
    type: "enable",
    check: ({ paperWorldDefaultSettings }) => paperWorldDefaultSettings['hopper']['disable-move-event'] === 'false',
    desc: "It's recommended to enable this, to disable hoppers from ticking each inventory slot each time an item is transferred."
  },
  {
    file: "paper.yml",
    title: "non-player-arrow-despawn-rate",
    type: "increase",
    check: ({ paperWorldDefaultSettings }) => parseInt(paperWorldDefaultSettings['non-player-arrow-despawn-rate']) === -1,
    desc: "It's recommended to increase this to 60 ticks, so that arrows that cannot be picked up (from an infinity bow) despawn within seconds."
  },
  {
    file: "paper.yml",
    title: "creative-arrow-despawn-rate",
    type: "increase",
    check: ({ paperWorldDefaultSettings }) => parseInt(paperWorldDefaultSettings['creative-arrow-despawn-rate']) === -1,
    desc: "It's recommended to increase this to 60 ticks, so that arrows that cannot be picked up (from a creative player) despawn within seconds."
  },
  {
    file: "paper.yml",
    title: "prevent-moving-into-unloaded-chunks",
    type: "enable",
    check: ({ paperWorldDefaultSettings }) => paperWorldDefaultSettings['prevent-moving-into-unloaded-chunks'] === 'false',
    desc: "It's recommended to enable this, so players have to wait for each next chunk to load before entering it, limiting the rate at which players can generate\\/load chunks."
  },
  {
    file: "paper.yml",
    title: "use-faster-eigencraft-redstone",
    type: "enable",
    check: ({ paperWorldDefaultSettings }) => paperWorldDefaultSettings['use-faster-eigencraft-redstone'] === 'false',
    desc: "It's recommended to enable this, so Paper will use their optimized redstone implementation. This should still work correctly with all redstone builds."
  },
  {
    file: "paper.yml",
    title: "fix-climbing-bypassing-cramming-rule",
    type: "enable",
    check: ({ paperWorldDefaultSettings }) => paperWorldDefaultSettings['fix-climbing-bypassing-cramming-rule'] === 'false',
    desc: "It's recommended to enable this, so the server does not have to check if an entity is climbing on a ladder when calculating entity cramming rules."
  },
  {
    file: "paper.yml",
    title: "armor-stands-do-collision-entity-lookups",
    type: "disable",
    check: ({ paperWorldDefaultSettings }) => paperWorldDefaultSettings['armor-stands-do-collision-entity-lookups'] === 'true',
    desc: "It's recommended to disable this, so the server does not have to check entity cramming rules for armour stands."
  },
  {
    file: "paper.yml",
    title: "armor-stands-tick",
    type: "disable",
    check: ({ paperWorldDefaultSettings }) => paperWorldDefaultSettings['armor-stands-tick'] === 'true',
    desc: "It's recommended to disable this, so the server does not have to perform any logic when ticking armor stands."
  },
  {
    file: "paper.yml",
    title: "per-player-mob-spawns",
    type: "enable",
    check: ({ paperWorldDefaultSettings }) => paperWorldDefaultSettings['per-player-mob-spawns'] === 'false',
    desc: "It's recommended to enable this, so each player has their own mob limit rather than each chunk."
  },
  {
    file: "paper.yml",
    title: "alt-item-despawn-rate.enabled",
    type: "enable",
    check: ({ paperWorldDefaultSettings }) => paperWorldDefaultSettings['alt-item-despawn-rate']['enabled'] === 'false',
    desc: "It's recommended to enable this, so that Cobblestone will despawn within a few seconds, you can also configure other rules to despawn specific items more quickly."
  }
];

function tryCheck(configData) {
  return item => {
    try {
      return item.check(configData);
    } catch (e) {
      return false;
    }
  }
}

export function getTips(timingsMaster) {
  let configData = {
    spigot: timingsMaster.config.spigot,
    bukkit: timingsMaster.config.bukkit,
    paper: timingsMaster.config.paper,
    // The server properties is only included in some builds eg. purpur
    serverProperties: timingsMaster.config['server.properties'] || null,
    paperWorldDefaultSettings: timingsMaster.config.paper['world-settings'].default,
    spigotWorldDefaultSettings: timingsMaster.config.spigot['world-settings'].default
  };

  return checks.filter(tryCheck(configData));
}