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
-- Table structure for table `server_venue`
--

DROP TABLE IF EXISTS `server_venue`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `server_venue` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `address_id` int(11) NOT NULL,
  `image` varchar(100) NOT NULL,
  `website` varchar(200) NOT NULL,
  `opened` tinyint(1) NOT NULL,
  `autofill` varchar(200) NOT NULL,
  `age` smallint(5) unsigned NOT NULL,
  `primary_color` varchar(7) DEFAULT NULL,
  `secondary_color` varchar(7) DEFAULT NULL,
  `accent_color` varchar(7) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `server_venue_3ac8a70a` (`address_id`),
  CONSTRAINT `address_id_refs_id_6bc6fe5d` FOREIGN KEY (`address_id`) REFERENCES `server_address` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `server_venue`
--

LOCK TABLES `server_venue` WRITE;
/*!40000 ALTER TABLE `server_venue` DISABLE KEYS */;
INSERT INTO `server_venue` VALUES (1,'3rd & Lindsley',2,'img/venues/thirdandl.jpg','http://www.3rdandlindsley.com/',1,'',0,'#000000','#FFFFFF','#F6F6F6'),(3,'Exit/In',4,'img/venues/exitin.jpg','http://www.exitin.com/',1,'',0,'#3B7B37','#FFFFFF','#231F20'),(4,'Marathon Music Works',5,'img/venues/marathon.jpg','http://www.marathonmusicworks.com/',1,'',0,'#224424','#FFFFFF','#224424'),(5,'The Basement',6,'img/venues/basement.jpg','http://www.thebasementnashville.do615.com/',1,'',0,'#0B2C52','#F3E6CD','#FC4107'),(7,'Mercy Lounge',8,'img/venues/mercylounge.jpg','http://www.mercylounge.com/',1,'',0,'#DD3A35','#FFFFFF','#F6F6F6'),(8,'The High Watt',9,'img/venues/highwatt.jpg','http://www.mercylounge.com/',1,'',0,'#29296A','#FFFFFF','#F6F6F6'),(9,'The Cannery Ballroom',10,'img/venues/mercylounge_1.jpg','http://www.mercylounge.com/',1,'',0,'#FFB818','#231F20','#FCFCFC'),(10,'Bluebird Café',11,'img/venues/bluebird.jpg','http://www.bluebirdcafe.com/',1,'',0,'#2CB5FF','#FFFFFF','#131B26'),(11,'The End',12,'img/venues/theend.jpg','http://www.endnashville.com/',1,'',0,'#222222','#ffffff','#f6f6f6'),(12,'The Listening Room',13,'img/venues/listeningroomcafe.jpg','http://www.listeningroomcafe.com/',1,'',0,'#000000','#ffffff','#f6f6f6'),(14,'Douglas Corner',15,'img/venues/douglascorner.jpg','http://www.douglascorner.com/',1,'',0,'#121135','#EFD776','#E7C065'),(16,'Grand Ole Opry',17,'img/venues/grandoleopry.jpg','http://www.opry.com/',1,'',0,'#B60D29','#FFFFFF','#F6F6F6'),(17,'Ryman Auditorium',18,'img/venues/ryman.jpg','http://www.ryman.com/',1,'',0,'#32110B','#FCAA18','#F7F2D0'),(18,'Bridgestone Arena',19,'img/venues/bridgestone.jpg','http://www.bridgestonearena.com/',1,'',0,'#050505','#F60500','#FFFFFF'),(20,'Pucketts',21,'img/venues/pucketts.jpg','http://www.puckettsgrocery.com/',0,'',0,'#452813','#FCB41B','#C3C8CB'),(21,'Music City Roots',29,'img/venues/loveless.jpg','http://www.lovelesscafe.com/',1,'',0,'#8B9633','#434819','#F6F6F6'),(22,'The Stone Fox',23,'img/venues/stonefox.jpg','http://www.thestonefoxnashville.com/',1,'',0,'#2EB9B0','#F3E4CB','#498580'),(24,'Station Inn',25,'img/venues/stationinn.jpg','http://www.stationinn.com/',1,'',0,'#195DFD','#E5F0F3','#C81A39'),(25,'City Winery',26,'img/venues/citywinery.jpg','http://www.citywinery.com/nashville/',1,'',0,'#540B24','#FFFFFF','#75032F'),(28,'Ascend Amphitheater',32,'showgrid/img/venues/ascendampitheater.jpg','http://www.ascendamphitheater.com/',1,'',0,'#9A1A2F','#FFFFFF','#F6F6F6'),(30,'The Woods at Fontanel',34,'showgrid/img/venues/woodsatfontanel.jpeg','http://www.woodsamphitheater.com/',1,'',0,'#BF592C','#FEF4D0','#98AFA7'),(31,'The Basement East',35,'showgrid/img/venues/basementsign_1.jpg','http://thebasementeast.do615.com/',1,'',21,'#0B2C52','#ffffff','#D63036');
/*!40000 ALTER TABLE `server_venue` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-11-27 18:02:20
