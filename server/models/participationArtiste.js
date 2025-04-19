import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const ParticipationArtiste = sequelize.define('participation_artiste', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  artiste_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  evenement_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description_role: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'participation_artiste',
  timestamps: false,
});

export default ParticipationArtiste;