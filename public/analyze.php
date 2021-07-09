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

require_once __DIR__ . "/../init.php";

$template = DataLoader::getInstance();
Analyze::analyze($template->data);