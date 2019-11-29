-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1:3306
-- Время создания: Ноя 30 2019 г., 02:50
-- Версия сервера: 5.7.25
-- Версия PHP: 7.2.22

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `platformer`
--

-- --------------------------------------------------------

--
-- Структура таблицы `levels`
--

CREATE TABLE `levels` (
  `id` int(11) NOT NULL,
  `name` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `data` json NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `levels`
--

INSERT INTO `levels` (`id`, `name`, `data`) VALUES
(1, 'First level', '{\"stage\": {\"width\": 2000, \"height\": 2000}, \"types\": [{\"id\": \"sand\", \"image\": \"img/sandBlock.png\", \"collision\": {\"top\": 15, \"left\": 31, \"right\": 169, \"bottom\": 153}}, {\"id\": \"platform\", \"image\": \"img/platformBlock.png\", \"collision\": {\"top\": 15, \"left\": 31, \"right\": 539, \"bottom\": 153}}], \"blocks\": [{\"x\": 275, \"y\": 1705, \"type\": \"sand\"}, {\"x\": 470, \"y\": 1377, \"type\": \"sand\"}, {\"x\": 1025, \"y\": 1372, \"type\": \"sand\"}, {\"x\": 268, \"y\": 938, \"type\": \"sand\"}, {\"x\": 229, \"y\": 1087, \"type\": \"sand\"}, {\"x\": 575, \"y\": 987, \"type\": \"sand\"}, {\"x\": 1094, \"y\": 975, \"type\": \"sand\"}, {\"x\": 90, \"y\": 1391, \"type\": \"sand\"}, {\"x\": 747, \"y\": 1031, \"type\": \"sand\"}, {\"x\": 327, \"y\": 1377, \"type\": \"sand\"}, {\"x\": 1556, \"y\": 1033, \"type\": \"sand\"}, {\"x\": 31, \"y\": 1844, \"type\": \"sand\"}, {\"x\": 32, \"y\": 1103, \"type\": \"sand\"}, {\"x\": 1670, \"y\": 1654, \"type\": \"sand\"}, {\"x\": 1775, \"y\": 1471, \"type\": \"sand\"}, {\"x\": 421, \"y\": 1638, \"type\": \"sand\"}, {\"x\": 709, \"y\": 1638, \"type\": \"platform\"}, {\"x\": 619, \"y\": 1377, \"type\": \"sand\"}, {\"x\": 868, \"y\": 1413, \"type\": \"sand\"}, {\"x\": 1372, \"y\": 1676, \"type\": \"sand\"}, {\"x\": 564, \"y\": 1638, \"type\": \"sand\"}, {\"x\": 1224, \"y\": 1638, \"type\": \"sand\"}, {\"x\": 1182, \"y\": 1214, \"type\": \"sand\"}, {\"x\": 1017, \"y\": 1120, \"type\": \"sand\"}, {\"x\": 595, \"y\": 1138, \"type\": \"sand\"}, {\"x\": 1367, \"y\": 1524, \"type\": \"sand\"}, {\"x\": 328, \"y\": 1233, \"type\": \"sand\"}, {\"x\": 1431, \"y\": 1376, \"type\": \"sand\"}, {\"x\": 427, \"y\": 929, \"type\": \"sand\"}, {\"x\": 1587, \"y\": 1839, \"type\": \"sand\"}]}');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `levels`
--
ALTER TABLE `levels`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `levels`
--
ALTER TABLE `levels`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
