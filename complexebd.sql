-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: complexebd
-- ------------------------------------------------------
-- Server version	8.0.35

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `commentaire`
--

DROP TABLE IF EXISTS `commentaire`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `commentaire` (
  `id` int NOT NULL AUTO_INCREMENT,
  `contenu` text COLLATE utf8mb4_general_ci NOT NULL,
  `date_creation` datetime DEFAULT CURRENT_TIMESTAMP,
  `utilisateur_id` int NOT NULL,
  `evenement_id` int NOT NULL,
  `note` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `utilisateur_id` (`utilisateur_id`),
  KEY `evenement_id` (`evenement_id`),
  CONSTRAINT `commentaire_ibfk_1` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateur` (`id`),
  CONSTRAINT `commentaire_ibfk_2` FOREIGN KEY (`evenement_id`) REFERENCES `evenement` (`id`),
  CONSTRAINT `commentaire_chk_1` CHECK ((`note` between 1 and 5))
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `commentaire`
--

LOCK TABLES `commentaire` WRITE;
/*!40000 ALTER TABLE `commentaire` DISABLE KEYS */;
INSERT INTO `commentaire` VALUES (1,'Super concert, les musiciens étaient excellents!','2025-06-16 09:00:00',2,1,5),(2,'Atelier très instructif, merci!','2025-05-11 10:30:00',3,2,4),(3,'Conférence passionnante mais un peu trop courte','2025-07-11 08:45:00',2,3,4),(4,'Le formateur était très compétent','2025-08-06 11:20:00',3,4,5),(5,'Spectacle magnifique, à revoir absolument!','2025-09-13 10:15:00',2,5,5),(6,'L\'organisation pourrait être améliorée','2025-06-17 14:30:00',3,1,3),(7,'Matériel de qualité pour l\'atelier','2025-05-12 16:20:00',2,2,4);
/*!40000 ALTER TABLE `commentaire` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `espace`
--

DROP TABLE IF EXISTS `espace`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `espace` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `type` enum('salle','atelier') COLLATE utf8mb4_general_ci NOT NULL,
  `sous_type` enum('théâtre','bibliothèque','informatique','musique','conférence','café','photographie','langue','arts') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `capacite` int DEFAULT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `image_url` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `espace`
--

LOCK TABLES `espace` WRITE;
/*!40000 ALTER TABLE `espace` DISABLE KEYS */;
INSERT INTO `espace` VALUES (1,'Grand Théâtre','salle','théâtre',200,NULL,NULL),(2,'Studio Photo','atelier','photographie',15,NULL,NULL),(3,'cozina','atelier','photographie',20,'bla bla bla','');
/*!40000 ALTER TABLE `espace` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `evenement`
--

DROP TABLE IF EXISTS `evenement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `evenement` (
  `id` int NOT NULL AUTO_INCREMENT,
  `titre` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `date_debut` datetime NOT NULL,
  `date_fin` datetime NOT NULL,
  `espace_id` int NOT NULL,
  `type` enum('spectacle','atelier','conference','exposition','rencontre') COLLATE utf8mb4_general_ci NOT NULL,
  `affiche_url` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `createur_id` int NOT NULL,
  `prix` decimal(10,2) DEFAULT '0.00',
  `statut` enum('planifie','confirme','annule') COLLATE utf8mb4_general_ci DEFAULT 'planifie',
  PRIMARY KEY (`id`),
  KEY `espace_id` (`espace_id`),
  KEY `createur_id` (`createur_id`),
  CONSTRAINT `evenement_ibfk_1` FOREIGN KEY (`espace_id`) REFERENCES `espace` (`id`),
  CONSTRAINT `evenement_ibfk_2` FOREIGN KEY (`createur_id`) REFERENCES `utilisateur` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `evenement`
--

LOCK TABLES `evenement` WRITE;
/*!40000 ALTER TABLE `evenement` DISABLE KEYS */;
INSERT INTO `evenement` VALUES (1,'Concert Andalou',NULL,'2025-06-15 20:00:00','2025-06-15 22:30:00',1,'spectacle',NULL,1,0.00,'planifie'),(2,'Atelier Photo',NULL,'2025-05-10 14:00:00','2025-05-10 17:00:00',2,'atelier',NULL,1,0.00,'planifie'),(3,'Conférence Art Moderne','Discussion sur les tendances artistiques contemporaines','2025-07-10 18:00:00','2025-07-10 20:30:00',1,'conference','conf_art.jpg',1,50.00,'confirme'),(4,'Atelier Peinture','Initiation à la peinture à l\'huile','2025-08-05 14:00:00','2025-08-05 17:00:00',2,'atelier','peinture.jpg',1,120.00,'planifie'),(5,'Spectacle de Danse','Performance de danse contemporaine','2025-09-12 20:00:00','2025-09-12 22:00:00',1,'spectacle','danse.jpg',1,80.00,'confirme'),(14,'xxxxxxxxxxxxxxxxxxxxxxxxxx',' mbdcjabj','2025-04-23 18:10:00','2025-04-23 20:10:00',1,'spectacle',NULL,1,30.00,'planifie'),(15,'yyyyyyyyyyyyyyyyyyy','nSKCDNkdj','2025-04-23 18:11:00','2025-04-23 20:11:00',1,'spectacle',NULL,1,0.00,'planifie'),(16,'Foire Artisanalex','','2025-04-23 18:40:00','2025-04-23 20:40:00',1,'conference',NULL,1,0.00,'planifie'),(17,'cozina','bla bla bal','2025-09-24 22:55:00','2025-09-26 00:55:00',2,'exposition',NULL,1,39.00,'planifie');
/*!40000 ALTER TABLE `evenement` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `participation_artiste`
--

DROP TABLE IF EXISTS `participation_artiste`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `participation_artiste` (
  `id` int NOT NULL AUTO_INCREMENT,
  `artiste_id` int NOT NULL,
  `evenement_id` int NOT NULL,
  `role` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `description_role` text COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`id`),
  KEY `artiste_id` (`artiste_id`),
  KEY `evenement_id` (`evenement_id`),
  CONSTRAINT `participation_artiste_ibfk_1` FOREIGN KEY (`artiste_id`) REFERENCES `utilisateur` (`id`) ON DELETE CASCADE,
  CONSTRAINT `participation_artiste_ibfk_2` FOREIGN KEY (`evenement_id`) REFERENCES `evenement` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `participation_artiste`
--

LOCK TABLES `participation_artiste` WRITE;
/*!40000 ALTER TABLE `participation_artiste` DISABLE KEYS */;
INSERT INTO `participation_artiste` VALUES (1,2,1,'Chanteuse principale',NULL),(2,3,2,'Formateur photo',NULL),(3,2,3,'Modérateur','Animation de la conférence'),(4,3,4,'Formateur','Enseignement des techniques de peinture'),(5,2,5,'Danseuse principale','Performance solo'),(6,3,5,'Chorégraphe','Mise en scène du spectacle');
/*!40000 ALTER TABLE `participation_artiste` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservation`
--

DROP TABLE IF EXISTS `reservation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `evenement_id` int NOT NULL,
  `utilisateur_id` int NOT NULL,
  `date_reservation` datetime DEFAULT CURRENT_TIMESTAMP,
  `nombre_places` int DEFAULT '1',
  `statut` enum('confirme','annule','en_attente') COLLATE utf8mb4_general_ci DEFAULT 'confirme',
  PRIMARY KEY (`id`),
  KEY `evenement_id` (`evenement_id`),
  KEY `utilisateur_id` (`utilisateur_id`),
  CONSTRAINT `reservation_ibfk_1` FOREIGN KEY (`evenement_id`) REFERENCES `evenement` (`id`),
  CONSTRAINT `reservation_ibfk_2` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateur` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservation`
--

LOCK TABLES `reservation` WRITE;
/*!40000 ALTER TABLE `reservation` DISABLE KEYS */;
INSERT INTO `reservation` VALUES (1,1,2,'2025-04-20 10:00:00',2,'confirme'),(2,1,3,'2025-04-21 11:30:00',1,'confirme'),(3,2,2,'2025-04-22 09:15:00',1,'annule'),(4,3,3,'2025-05-01 14:20:00',3,'confirme'),(5,3,2,'2025-05-02 16:45:00',2,'en_attente'),(6,4,3,'2025-06-10 10:30:00',1,'confirme'),(7,5,2,'2025-07-15 12:00:00',4,'confirme'),(8,5,3,'2025-07-18 15:20:00',2,'confirme'),(9,2,1,'2025-04-30 22:25:00',20,'en_attente'),(10,4,4,'2025-04-21 22:25:00',25,'en_attente');
/*!40000 ALTER TABLE `reservation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `utilisateur`
--

DROP TABLE IF EXISTS `utilisateur`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `utilisateur` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `role` enum('utilisateur','admin','superadmin') COLLATE utf8mb4_general_ci DEFAULT 'utilisateur',
  `date_inscription` datetime DEFAULT CURRENT_TIMESTAMP,
  `is_talent` tinyint(1) NOT NULL DEFAULT '0',
  `domaine_artiste` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `description_talent` text COLLATE utf8mb4_general_ci,
  `image_profil` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `statut_talent` enum('actif','inactif','en_validation') COLLATE utf8mb4_general_ci DEFAULT 'en_validation',
  `resetPasswordToken` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `resetPasswordExpires` datetime DEFAULT NULL,
  `specialite` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `annees_experience` int DEFAULT NULL,
  `competences` text COLLATE utf8mb4_general_ci,
  `disponibilites` text COLLATE utf8mb4_general_ci,
  `reseaux_sociaux` json DEFAULT NULL,
  `experience` json DEFAULT NULL,
  `cv` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `telephone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `adresse` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `utilisateur`
--

LOCK TABLES `utilisateur` WRITE;
/*!40000 ALTER TABLE `utilisateur` DISABLE KEYS */;
INSERT INTO `utilisateur` VALUES (1,'Admin','admin@culture.ma','$2y$10$TXdpYnOAfb04O9rVaGUzm.sDaQDFsL/CiVuz/B5eeilqCPomfeg8S','superadmin','2025-04-19 00:37:05',0,NULL,NULL,NULL,'en_validation',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(2,'Fatima Zahra','fatima@artiste.ma','$2y$10$mdEFice0TdjqvQsB5ev9AeMAydSQWYclXA.eNzZ4uttGrTg3NBclK','utilisateur','2025-04-19 00:37:05',1,'Musique traditionnelle','Chanteuse et compositrice',NULL,'en_validation',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(3,'Ahmed Photographe','ahmed@photo.ma','$2y$10$mdEFice0TdjqvQsB5ev9AeMAydSQWYclXA.eNzZ4uttGrTg3NBclK','utilisateur','2025-04-19 00:37:05',1,'Photographie','Spécialiste paysages du désert',NULL,'en_validation',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(4,'soufiane','soufiane.oulahcen9999@gmail.com','$2b$10$KBYz.PaWHsaqRdgPOxRTEul3DKLi6NxXuDPZVfVfhvgAsiF0bog1C','admin','2025-04-19 00:37:05',0,'','',NULL,'',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(5,'meryem','meryem@gmail.com','$2b$10$pj1nzSJsSOj1eSIIjZwRq.2yCokQvqlZU/6K3XMsfhwRo4c/pQbma','utilisateur','2025-04-22 00:14:13',0,NULL,NULL,NULL,'en_validation',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(9,'meryem','mdsckjsdbncjkds@gmail.com','1234567890','utilisateur','2025-04-23 21:31:11',0,'','',NULL,'en_validation',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(11,'hassan ','hassan@gmail.com','defaultPassword','utilisateur','2025-04-24 01:08:32',1,'musicien','',NULL,'en_validation',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(12,'anas','anas@gmail.com','1234567890','utilisateur','2025-04-24 01:19:36',1,NULL,NULL,NULL,'en_validation',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(13,'Admin','stifahafsa4@gmail.com','$2y$10$X2pfMB2pkxACNPOq2LBHkucz9MRFba7eo84KisEfLcU9UOEKcyoVS','superadmin','2025-04-28 21:07:05',0,NULL,NULL,NULL,'en_validation',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(14,'hafsa','hafsa@artiste.ma','$2y$10$6OXXysRu10meTaT2jA.81evD6o2XSLYJdk/zN3faoaY6Z9z0Rxun6','utilisateur','2025-04-19 00:37:05',1,'Musique traditionnelle','Chanteuse et compositrice',NULL,'en_validation',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(15,'Salim','salim@gmail.com','1234567890','utilisateur','2025-04-28 01:19:36',1,NULL,NULL,NULL,'en_validation',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(16,'Admin User','admin@example.com','$2y$10$BgtTH6WOctHe0/B0G1sOWerL94.keaSALrMluwJvhGOQgKDz0myvu','admin','2025-04-28 21:31:28',0,NULL,NULL,NULL,'en_validation',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(17,'User','user@example.com','$2y$10$5t6od3yOKWDusslIyHkHq.UKjQNIdiNs1xwvLtyD.cac/WG4Gexve','utilisateur','2025-04-28 21:32:22',0,NULL,NULL,NULL,'en_validation',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(18,'Hasna','talent@example.com','$2y$10$FWwnO7z1bNk5xwNE.Fcv1.dbMRZYZKq3obw5T7yTDazBDH67AaqCu','utilisateur','2025-04-28 21:33:33',1,'Chanteur','Je suis un chanteur passionné.',NULL,'en_validation',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(19,'Amine','aminet@example.com','$2y$10$tzxmfLYpwkBLbD/5QsYWm.eb7DunczsyPiJBOZfgWkAMXS/BDNSGe','utilisateur','2025-05-01 21:43:28',1,'Photographie','Photographe passionné par les portraits et la nature.','jean_profil.jpg','actif',NULL,NULL,'Portraits et paysages',5,'Photoshop, Lightroom, Retouche photo','Lundi à Vendredi, 9h-17h','{\"facebook\": \"https://facebook.com/jeanphoto\", \"instagram\": \"https://instagram.com/jeanphoto\"}','[{\"titre\": \"Exposition Nature 2021\", \"description\": \"Exposition personnelle à Paris\"}, {\"titre\": \"Collaboration StudioX\", \"description\": \"Projet collaboratif avec StudioX en 2022\"}]','jean_cv.pdf',NULL,NULL),(20,'hafsa','hafsa@complexe.ma','$2b$10$bmA7UG8kRzZ/0EI/Qm0yQ.33A2huBzjFDOmubVLeUyVPdhLOMejBO','utilisateur','2025-05-06 17:28:07',0,NULL,NULL,NULL,'en_validation',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `utilisateur` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-07  1:55:29
