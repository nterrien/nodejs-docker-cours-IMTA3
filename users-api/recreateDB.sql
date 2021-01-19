DROP DATABASE `mabdd`;

CREATE DATABASE IF NOT EXISTS  `mabdd`;

USE `mabdd`;

CREATE TABLE `user` (
  `id` int(11) AUTO_INCREMENT PRIMARY KEY,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `age` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `playlist` (
  `id` int(11) AUTO_INCREMENT PRIMARY KEY,
  `name` varchar(255) DEFAULT NULL,
  `user` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `suggestions` (
  `id` int(11) AUTO_INCREMENT PRIMARY KEY,
  `name` varchar(255) DEFAULT NULL,
  `user` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP DATABASE `Catalog-Api`;

CREATE DATABASE IF NOT EXISTS `Catalog-Api`;

USE `Catalog-Api`;

CREATE TABLE `movies` (
  `id` int(11) AUTO_INCREMENT PRIMARY KEY,
  `title` varchar(255) NOT NULL,
  `director` varchar(255) NOT NULL,
  `age-rating` varchar(255) NOT NULL,
  `duration` int(11) NOT NULL,
  `popularity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `movies_genre` (
  `id` int(11) AUTO_INCREMENT PRIMARY KEY,
  `id_movie` int(11) NOT NULL,
  `id_genre` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `genres` (
  `id` int(11) AUTO_INCREMENT PRIMARY KEY,
  `description` varchar(255)  NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `movies_people` (
  `id` int(11) AUTO_INCREMENT PRIMARY KEY,
  `id_movie` int(11) NOT NULL,
  `id_people` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `people` (
  `id` int(11) AUTO_INCREMENT PRIMARY KEY,
  `name` varchar(255) NOT NULL,
  `roles` varchar(255)  NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;