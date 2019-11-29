<?php

header('Access-Control-Allow-Origin: *');

require_once 'ScriptsLoader.php';
spl_autoload_register(ScriptsLoader::getCallbackName());

$main = new Main();
$main->action();