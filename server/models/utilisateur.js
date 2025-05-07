import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Utilisateur = sequelize.define(
  "utilisateur",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("utilisateur", "admin", "superadmin"),
      defaultValue: "utilisateur",
    },
    date_inscription: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    is_talent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    domaine_artiste: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description_talent: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    image_profil: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    statut_talent: {
      type: DataTypes.ENUM("actif", "inactif", "en_validation"),
      defaultValue: "en_validation",
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetPasswordExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    specialite: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    annees_experience: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    competences: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    disponibilites: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    reseaux_sociaux: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {},
    },
    experience: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    cv: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    telephone: {
      type: DataTypes.STRING(20), // Spécifiez la longueur maximale
      allowNull: true,
      validate: {
        is: /^[0-9+\s-]*$/i // Validation simple pour numéros de téléphone
      }
    },
    adresse: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "utilisateur",
    timestamps: false,
  }
);

export default Utilisateur;