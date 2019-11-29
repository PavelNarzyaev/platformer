<?php

class DataBase {
	private static $connected = false;
	/** @var mysqli */
	private static $mysql;

	private static function connect () {
		self::$mysql = new mysqli(
			DataBaseConfig::DB_HOST,
			DataBaseConfig::DB_USER,
			DataBaseConfig::DB_PASSWORD,
			DataBaseConfig::DB_NAME,
			DataBaseConfig::DB_PORT
		);
		if (!self::$mysql->connect_errno) {
			self::$connected = true;
		}
	}

	public static function query($query) {
		if (!self::$connected) {
			self::connect();
		}
		if (self::$connected) {
			return self::$mysql->query($query);
		} else {
			return false;
		}
	}

	public static function shield ($value) {
		if (!self::$connected) {
			self::connect();
		}
		if (self::$connected) {
			if ($value) {
				$value = mysqli_real_escape_string(self::$mysql, $value);
			}
		}
		return $value;
	}
}