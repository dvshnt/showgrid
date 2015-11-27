-- MySQL dump 10.13  Distrib 5.5.38, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: showgriddb
-- ------------------------------------------------------
-- Server version	5.5.38-0ubuntu0.14.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `server_address`
--

DROP TABLE IF EXISTS `server_address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `server_address` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `street` varchar(128) NOT NULL,
  `city` varchar(64) NOT NULL,
  `state` varchar(2) NOT NULL,
  `zip_code` varchar(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `server_address`
--

LOCK TABLES `server_address` WRITE;
/*!40000 ALTER TABLE `server_address` DISABLE KEYS */;
INSERT INTO `server_address` VALUES (1,'818 3rd Ave S','Nashville','TN','37210'),(2,'818 3rd Ave S','Nashville','TN','37210'),(3,'114 12th Ave N','Nashville','TN','37203'),(4,'2208 Elliston Pl','Nashville','TN','37203'),(5,'1402 Clinton St','Nashville','TN','37203'),(6,'1604 8th Ave S','Nashville','TN','37203'),(7,'410 4th Ave S','Nashville','TN','37201'),(8,'1 Cannery Row','Nashville','TN','37203'),(9,'1 Cannery Row','Nashville','TN','37203'),(10,'1 Cannery Row','Nashville','TN','37203'),(11,'4104 Hillsboro Pike','Nashville','TN','37215'),(12,'2219 Elliston Pl','Nashville','TN','37203'),(13,'217 2nd Ave S','Nashville','TN','37201'),(14,'100 Broadway','Nashville','TN','37201'),(15,'2106 8th Ave S','Nashville','TN','37204'),(16,'120 2nd Ave N','Nashville','TN','37201'),(17,'2804 Opryland Dr','Nashville','TN','37214'),(18,'116 5th Ave N','Nashville','TN','37219'),(19,'501 Broadway','Nashville','TN','37203'),(20,'2117 Belcourt Ave','Nashville','TN','37212'),(21,'500 Church St','Nashville','TN','37219'),(22,'8400 Tennessee 100','Nashville','TN','37221'),(23,'712 51st AVe N','Nashville','TN','37209'),(24,'2025 8th Ave S','Nashville','TN','37204'),(25,'402 12th Ave S','Nashville','TN','37203'),(26,'609 Lafayette Street','Nashville','TN','37204'),(27,'609 Lafayette Street','Nashville','TN','37204'),(28,'609 Lafayette Street','Nashville','TN','37204'),(29,'230 Franklin Rd','Franklin','TN','37064'),(30,'2600 West End Ave','Nashville','TN','37203'),(31,'301 6th Ave North','Nashville','TN','37243'),(32,'310 1st Ave. South','Nashville','Te','37201'),(33,'2412 Gallatin Ave','Nashville','Te','37216'),(34,'4225 Whites Creek Pike ','Nashville','te','37189'),(35,'917 Woodland Ave.','Nashville','TN','37206');
/*!40000 ALTER TABLE `server_address` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-11-27 18:05:31
