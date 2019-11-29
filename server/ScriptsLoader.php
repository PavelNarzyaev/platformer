<?php

class ScriptsLoader {
	public static function getCallbackName() {
		return 'ScriptsLoader::autoLoader';
	}

	public static function autoLoader ($className) {
		require_once $className.'.php';
	}
}