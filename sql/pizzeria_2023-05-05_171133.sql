/*!40101 SET NAMES utf8 */;
/*!40014 SET FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET SQL_NOTES=0 */;
DROP TABLE IF EXISTS customer_adresses;
CREATE TABLE `customer_adresses` (
  `addresse_id` int NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `cus_id` int NOT NULL COMMENT 'ID du client',
  `adresse` text COMMENT 'Adresses',
  PRIMARY KEY (`addresse_id`),
  KEY `cust_id` (`cus_id`),
  CONSTRAINT `customer_adresses_ibfk_1` FOREIGN KEY (`cus_id`) REFERENCES `customers` (`cus_id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS customers;
CREATE TABLE `customers` (
  `cus_id` int NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `firstname` varchar(255) DEFAULT NULL COMMENT 'Prénom',
  `lastname` varchar(255) DEFAULT NULL COMMENT 'Nom',
  `email` varchar(255) DEFAULT NULL COMMENT 'email',
  `password` varchar(60) DEFAULT NULL COMMENT 'Mot de passe',
  PRIMARY KEY (`cus_id`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS delivery_men;
CREATE TABLE `delivery_men` (
  `dm_id` int NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `firstname` varchar(255) NOT NULL COMMENT 'Prénom',
  `lastname` varchar(255) NOT NULL COMMENT 'Nom de famille',
  PRIMARY KEY (`dm_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS order_pizza;
CREATE TABLE `order_pizza` (
  `ord_id` int NOT NULL COMMENT 'ID de commande',
  `pizz_id` int NOT NULL COMMENT 'ID de la pizza',
  `pizz_qt` int NOT NULL COMMENT 'Quantité de pizza',
  PRIMARY KEY (`ord_id`,`pizz_id`),
  KEY `pizz_id` (`pizz_id`),
  CONSTRAINT `order_pizza_ibfk_1` FOREIGN KEY (`ord_id`) REFERENCES `orders` (`ord_id`),
  CONSTRAINT `order_pizza_ibfk_2` FOREIGN KEY (`pizz_id`) REFERENCES `pizzas` (`pizz_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS orders;
CREATE TABLE `orders` (
  `ord_id` int NOT NULL AUTO_INCREMENT COMMENT 'ID de commande',
  `cust_id` int NOT NULL,
  `delivery_id` int NOT NULL,
  `status` set('ENREGISTRE','EN_COURS_DE_LIVRAISON','LIVRE') DEFAULT NULL COMMENT 'Statut',
  `adresse` text COMMENT 'Adresse',
  PRIMARY KEY (`ord_id`),
  KEY `cust_id` (`cust_id`),
  KEY `delivery_id` (`delivery_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`cust_id`) REFERENCES `customers` (`cus_id`),
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`delivery_id`) REFERENCES `delivery_men` (`dm_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS pizzas;
CREATE TABLE `pizzas` (
  `pizz_id` int NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `code` varchar(4) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT 'code',
  `label` varchar(255) DEFAULT NULL COMMENT 'libellé',
  `ingredients` text COMMENT 'ingrédients',
  `category` varchar(255) DEFAULT NULL COMMENT 'catégorie',
  `price` decimal(10,0) NOT NULL COMMENT 'prix',
  `version` int NOT NULL COMMENT 'version',
  PRIMARY KEY (`pizz_id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;