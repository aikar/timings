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

/* Solution to propagate loading events to other components */

let finishListeners = [];
let startListeners = [];

export function onFinishLoading(cb) {
    finishListeners.push(cb);
}
export function onStartLoading(cb) {
    startListeners.push(cb);
}

export function startLoading() {
    for (const l of startListeners) {
        l();
    }
    startListeners = [];
}
export function finishLoading() {
    for (const l of finishListeners) {
        l();
    }
    finishListeners = [];
}
