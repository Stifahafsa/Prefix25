-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : sam. 19 avr. 2025 à 02:01
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `complexebd`
--

-- --------------------------------------------------------

--
-- Structure de la table `commentaire`
--

CREATE TABLE `commentaire` (
  `id` int(11) NOT NULL,
  `contenu` text NOT NULL,
  `date_creation` datetime DEFAULT current_timestamp(),
  `utilisateur_id` int(11) NOT NULL,
  `evenement_id` int(11) NOT NULL,
  `note` int(11) DEFAULT NULL CHECK (`note` between 1 and 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `espace`
--

CREATE TABLE `espace` (
  `id` int(11) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `type` enum('salle','atelier') NOT NULL,
  `sous_type` enum('théâtre','bibliothèque','informatique','musique','conférence','café','photographie','langue','arts') DEFAULT NULL,
  `capacite` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `espace`
--

INSERT INTO `espace` (`id`, `nom`, `type`, `sous_type`, `capacite`, `description`, `image_url`) VALUES
(1, 'Grand Théâtre', 'salle', 'théâtre', 200, NULL, NULL),
(2, 'Studio Photo', 'atelier', 'photographie', 15, NULL, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `evenement`
--

CREATE TABLE `evenement` (
  `id` int(11) NOT NULL,
  `titre` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `date_debut` datetime NOT NULL,
  `date_fin` datetime NOT NULL,
  `espace_id` int(11) NOT NULL,
  `type` enum('spectacle','atelier','conference','exposition','rencontre') NOT NULL,
  `affiche_url` varchar(255) DEFAULT NULL,
  `createur_id` int(11) NOT NULL,
  `prix` decimal(10,2) DEFAULT 0.00,
  `statut` enum('planifie','confirme','annule') DEFAULT 'planifie'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `evenement`
--

INSERT INTO `evenement` (`id`, `titre`, `description`, `date_debut`, `date_fin`, `espace_id`, `type`, `affiche_url`, `createur_id`, `prix`, `statut`) VALUES
(1, 'Concert Andalou', NULL, '2025-06-15 20:00:00', '2025-06-15 22:30:00', 1, 'spectacle', NULL, 1, 0.00, 'planifie'),
(2, 'Atelier Photo', NULL, '2025-05-10 14:00:00', '2025-05-10 17:00:00', 2, 'atelier', NULL, 1, 0.00, 'planifie');

-- --------------------------------------------------------

--
-- Structure de la table `participation_artiste`
--

CREATE TABLE `participation_artiste` (
  `id` int(11) NOT NULL,
  `artiste_id` int(11) NOT NULL,
  `evenement_id` int(11) NOT NULL,
  `role` varchar(255) NOT NULL,
  `description_role` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `participation_artiste`
--

INSERT INTO `participation_artiste` (`id`, `artiste_id`, `evenement_id`, `role`, `description_role`) VALUES
(1, 2, 1, 'Chanteuse principale', NULL),
(2, 3, 2, 'Formateur photo', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `reservation`
--

CREATE TABLE `reservation` (
  `id` int(11) NOT NULL,
  `evenement_id` int(11) NOT NULL,
  `utilisateur_id` int(11) NOT NULL,
  `date_reservation` datetime DEFAULT current_timestamp(),
  `nombre_places` int(11) DEFAULT 1,
  `statut` enum('confirme','annule','en_attente') DEFAULT 'confirme'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `utilisateur`
--

CREATE TABLE `utilisateur` (
  `id` int(11) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('utilisateur','admin','superadmin') DEFAULT 'utilisateur',
  `date_inscription` datetime DEFAULT current_timestamp(),
  `is_talent` tinyint(1) DEFAULT 0,
  `domaine_artiste` varchar(255) DEFAULT NULL,
  `description_talent` text DEFAULT NULL,
  `image_profil` varchar(255) DEFAULT NULL,
  `statut_talent` enum('actif','inactif','en_validation') DEFAULT 'en_validation'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `utilisateur`
--

INSERT INTO `utilisateur` (`id`, `nom`, `email`, `password`, `role`, `date_inscription`, `is_talent`, `domaine_artiste`, `description_talent`, `image_profil`, `statut_talent`) VALUES
(1, 'Admin', 'admin@culture.ma', '$2y$10$...', 'superadmin', '2025-04-19 00:37:05', 0, NULL, NULL, NULL, 'en_validation'),
(2, 'Fatima Zahra', 'fatima@artiste.ma', '$2y$10$...', 'utilisateur', '2025-04-19 00:37:05', 1, 'Musique traditionnelle', 'Chanteuse et compositrice', NULL, 'en_validation'),
(3, 'Ahmed Photographe', 'ahmed@photo.ma', '$2y$10$...', 'utilisateur', '2025-04-19 00:37:05', 1, 'Photographie', 'Spécialiste paysages du désert', NULL, 'en_validation');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `commentaire`
--
ALTER TABLE `commentaire`
  ADD PRIMARY KEY (`id`),
  ADD KEY `utilisateur_id` (`utilisateur_id`),
  ADD KEY `evenement_id` (`evenement_id`);

--
-- Index pour la table `espace`
--
ALTER TABLE `espace`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `evenement`
--
ALTER TABLE `evenement`
  ADD PRIMARY KEY (`id`),
  ADD KEY `espace_id` (`espace_id`),
  ADD KEY `createur_id` (`createur_id`);

--
-- Index pour la table `participation_artiste`
--
ALTER TABLE `participation_artiste`
  ADD PRIMARY KEY (`id`),
  ADD KEY `artiste_id` (`artiste_id`),
  ADD KEY `evenement_id` (`evenement_id`);

--
-- Index pour la table `reservation`
--
ALTER TABLE `reservation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `evenement_id` (`evenement_id`),
  ADD KEY `utilisateur_id` (`utilisateur_id`);

--
-- Index pour la table `utilisateur`
--
ALTER TABLE `utilisateur`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `commentaire`
--
ALTER TABLE `commentaire`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `espace`
--
ALTER TABLE `espace`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `evenement`
--
ALTER TABLE `evenement`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `participation_artiste`
--
ALTER TABLE `participation_artiste`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `reservation`
--
ALTER TABLE `reservation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `utilisateur`
--
ALTER TABLE `utilisateur`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `commentaire`
--
ALTER TABLE `commentaire`
  ADD CONSTRAINT `commentaire_ibfk_1` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateur` (`id`),
  ADD CONSTRAINT `commentaire_ibfk_2` FOREIGN KEY (`evenement_id`) REFERENCES `evenement` (`id`);

--
-- Contraintes pour la table `evenement`
--
ALTER TABLE `evenement`
  ADD CONSTRAINT `evenement_ibfk_1` FOREIGN KEY (`espace_id`) REFERENCES `espace` (`id`),
  ADD CONSTRAINT `evenement_ibfk_2` FOREIGN KEY (`createur_id`) REFERENCES `utilisateur` (`id`);

--
-- Contraintes pour la table `participation_artiste`
--
ALTER TABLE `participation_artiste`
  ADD CONSTRAINT `participation_artiste_ibfk_1` FOREIGN KEY (`artiste_id`) REFERENCES `utilisateur` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `participation_artiste_ibfk_2` FOREIGN KEY (`evenement_id`) REFERENCES `evenement` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `reservation`
--
ALTER TABLE `reservation`
  ADD CONSTRAINT `reservation_ibfk_1` FOREIGN KEY (`evenement_id`) REFERENCES `evenement` (`id`),
  ADD CONSTRAINT `reservation_ibfk_2` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateur` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
