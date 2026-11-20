-- Base de donnees Maeritina Quincaillerie
-- Conforme au cahier des charges Honey Group : exactement 4 tables metier.
-- Importer ce fichier dans phpMyAdmin ou avec le client MySQL.

CREATE DATABASE IF NOT EXISTS maeritina_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE maeritina_db;

CREATE TABLE IF NOT EXISTS categories (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(120) NOT NULL,
  description TEXT NULL,
  actif TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_categories_nom (nom)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS produits (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  categorie_id INT UNSIGNED NOT NULL,
  nom VARCHAR(180) NOT NULL,
  description TEXT NULL,
  reference_oem VARCHAR(100) NULL,
  prix DECIMAL(12,2) NULL,
  disponibilite ENUM('disponible', 'sur_commande', 'indisponible')
    NOT NULL DEFAULT 'sur_commande',
  image_url VARCHAR(500) NULL,
  actif TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_produits_categories
    FOREIGN KEY (categorie_id) REFERENCES categories(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  INDEX idx_produits_nom (nom),
  INDEX idx_produits_reference_oem (reference_oem),
  INDEX idx_produits_categorie (categorie_id),
  INDEX idx_produits_disponibilite (disponibilite)
) ENGINE=InnoDB;

-- Un produit peut correspondre a plusieurs vehicules.
-- Cette relation est conservee dans la table demandee marques_vehicules,
-- sans ajouter une cinquieme table.
CREATE TABLE IF NOT EXISTS marques_vehicules (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  produit_id INT UNSIGNED NOT NULL,
  marque VARCHAR(100) NOT NULL,
  modele VARCHAR(120) NOT NULL,
  annee_debut SMALLINT UNSIGNED NULL,
  annee_fin SMALLINT UNSIGNED NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_marques_vehicules_produit
    FOREIGN KEY (produit_id) REFERENCES produits(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  INDEX idx_mv_produit (produit_id),
  INDEX idx_mv_marque_modele (marque, modele)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS demandes_devis (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nom_client VARCHAR(150) NOT NULL,
  telephone VARCHAR(40) NOT NULL,
  email VARCHAR(190) NULL,
  vehicule VARCHAR(180) NULL,
  reference_recherchee VARCHAR(180) NULL,
  message TEXT NOT NULL,
  statut ENUM('nouvelle', 'en_cours', 'traitee', 'annulee')
    NOT NULL DEFAULT 'nouvelle',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_demandes_statut_date (statut, created_at)
) ENGINE=InnoDB;

INSERT IGNORE INTO categories (nom, description) VALUES
('Freinage', 'Plaquettes, disques et composants de freinage.'),
('Moteur', 'Pieces et composants du moteur.'),
('Filtration', 'Filtres a huile, air, carburant et habitacle.'),
('Suspension', 'Amortisseurs et composants de suspension.'),
('Electricite automobile', 'Composants electriques et eclairage.'),
('Transmission', 'Embrayage et composants de transmission.');

CREATE TABLE IF NOT EXISTS adminAcount (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_admin_account_username (username)
) ENGINE=InnoDB;
