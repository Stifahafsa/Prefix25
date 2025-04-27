// models/notification.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Utilisateur from "./utilisateur.js"; // pour l'association

const Notification = sequelize.define("Notification", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  utilisateurId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Utilisateur,
      key: "id",
    },
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  is_read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: "notifications",
  timestamps: true, // pour createdAt et updatedAt automatiques
});

// Association (un utilisateur a plusieurs notifications)
Utilisateur.hasMany(Notification, { foreignKey: "utilisateurId" });
Notification.belongsTo(Utilisateur, { foreignKey: "utilisateurId" });

export default Notification;
