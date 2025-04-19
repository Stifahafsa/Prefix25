import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Reservation = sequelize.define('reservation', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  evenement_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  utilisateur_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  date_reservation: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  nombre_places: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  statut: {
    type: DataTypes.ENUM('confirme', 'annule', 'en_attente'),
    defaultValue: 'confirme',
  },
}, {
  tableName: 'reservation',
  timestamps: false,
});

export default Reservation;