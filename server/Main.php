<?php

class Main {
	public function action() {
			if (isset($_GET['action'])) {
			switch ($_GET['action']) {
				case 'get_levels_list':
					$this->getLevelsList();
					break;

				case 'get_level_data':
					$this->getLevel();
					break;

				default:
					echo 'unknown action';
			}
		} else {
			echo 'action not found';
		}
	}

	private function getLevelsList() {
		$dbLevels = DataBase::query('SELECT id, name FROM levels');
		if ($dbLevels) {
			$response = [];
			while ($level = $dbLevels->fetch_array()) {
				$responseLevel = new stdClass();
				$responseLevel->id = $level['id'];
				$responseLevel->name = $level['name'];
				$response[] = $responseLevel;
			}
			echo json_encode($response);
		} else {
			echo 'get levels list database error';
		}
	}

	private function getLevel() {
		if (isset($_GET['id']) && is_numeric($_GET['id'])) {
			$dbLevel = DataBase::query('SELECT data FROM levels WHERE id='.$_GET['id']);
			if ($dbLevel) {
				$level = $dbLevel->fetch_array();
				echo $level['data'];
			} else {
				echo 'get level database error';
			}
		} else {
			echo 'invalid id';
		}
	}
}