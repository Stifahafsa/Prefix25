import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Commentaire = sequelize.define('commentaire', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  contenu: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  date_creation: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  utilisateur_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  evenement_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  note: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 5,
    },
  },
}, {
  tableName: 'commentaire',
  timestamps: false,
});

export default Commentaire;