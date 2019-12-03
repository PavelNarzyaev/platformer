-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1:3306
-- Время создания: Дек 03 2019 г., 05:55
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
  `id` int(11) DEFAULT NULL,
  `name` char(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `data` json DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `levels`
--

INSERT INTO `levels` (`id`, `name`, `data`) VALUES
(1, 'First level', '{\"stage\": {\"width\": 2000, \"height\": 2000}, \"types\": [{\"id\": \"graphite_cube\", \"image\": \"img/graphite_cube.png\", \"collision\": {\"top\": 15, \"left\": 29, \"right\": 157, \"bottom\": 142}}, {\"id\": \"metal_cube\", \"image\": \"img/metal_cube.png\", \"collision\": {\"top\": 15, \"left\": 29, \"right\": 157, \"bottom\": 142}}, {\"id\": \"wood_cube\", \"image\": \"img/wood_cube.png\", \"collision\": {\"top\": 15, \"left\": 29, \"right\": 157, \"bottom\": 142}}, {\"id\": \"graphite_horizontal\", \"image\": \"img/graphite_horizontal.png\", \"collision\": {\"top\": 15, \"left\": 29, \"right\": 471, \"bottom\": 142}}, {\"id\": \"metal_horizontal\", \"image\": \"img/metal_horizontal.png\", \"collision\": {\"top\": 15, \"left\": 29, \"right\": 471, \"bottom\": 142}}, {\"id\": \"wood_horizontal\", \"image\": \"img/wood_horizontal.png\", \"collision\": {\"top\": 15, \"left\": 29, \"right\": 471, \"bottom\": 142}}, {\"id\": \"graphite_vertical\", \"image\": \"img/graphite_vertical.png\", \"collision\": {\"top\": 15, \"left\": 29, \"right\": 157, \"bottom\": 456}}, {\"id\": \"metal_vertical\", \"image\": \"img/metal_vertical.png\", \"collision\": {\"top\": 15, \"left\": 29, \"right\": 157, \"bottom\": 456}}, {\"id\": \"wood_vertical\", \"image\": \"img/wood_vertical.png\", \"collision\": {\"top\": 15, \"left\": 29, \"right\": 157, \"bottom\": 456}}], \"blocks\": [{\"x\": 1098, \"y\": 1110, \"type\": \"graphite_cube\"}, {\"x\": 791, \"y\": 306, \"type\": \"graphite_cube\"}, {\"x\": 912, \"y\": 919, \"type\": \"graphite_cube\"}, {\"x\": 528, \"y\": 1552, \"type\": \"metal_cube\"}, {\"x\": 656, \"y\": 1552, \"type\": \"metal_cube\"}, {\"x\": 528, \"y\": 1425, \"type\": \"metal_cube\"}, {\"x\": 1226, \"y\": 1552, \"type\": \"wood_cube\"}, {\"x\": 305, \"y\": 301, \"type\": \"wood_cube\"}, {\"x\": 1098, \"y\": 714, \"type\": \"wood_cube\"}, {\"x\": 784, \"y\": 1237, \"type\": \"graphite_horizontal\"}, {\"x\": 784, \"y\": 1552, \"type\": \"metal_horizontal\"}, {\"x\": 0, \"y\": 1872, \"type\": \"wood_horizontal\"}, {\"x\": 442, \"y\": 1872, \"type\": \"wood_horizontal\"}, {\"x\": 884, \"y\": 1872, \"type\": \"wood_horizontal\"}, {\"x\": 1326, \"y\": 1872, \"type\": \"wood_horizontal\"}, {\"x\": 1557, \"y\": 1745, \"type\": \"wood_horizontal\"}, {\"x\": 784, \"y\": 605, \"type\": \"graphite_vertical\"}, {\"x\": 1226, \"y\": 923, \"type\": \"metal_vertical\"}, {\"x\": 1226, \"y\": 482, \"type\": \"wood_vertical\"}]}');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
