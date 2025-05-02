// import { DataTypes } from 'sequelize';
// import sequelize from '../config/database.js';
// import bcrypt from 'bcrypt';

// const User = sequelize.define('utilisateur', {
//   id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true
//   },
//   nom: {
//     type: DataTypes.STRING,
//     allowNull: false
//   },
//   email: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     unique: true,
//     validate: {
//       isEmail: true
//     }
//   },
//   password: {
//     type: DataTypes.STRING,
//     allowNull: false
//   },
//   role: {
//     type: DataTypes.ENUM('utilisateur', 'admin', 'superadmin'),
//     defaultValue: 'utilisateur'
//   },
//   date_inscription: {
//     type: DataTypes.DATE,
//     defaultValue: DataTypes.NOW
//   },
//   is_talent: {
//     type: DataTypes.BOOLEAN,
//     defaultValue: false
//   },
//   domaine_artiste: {
//     type: DataTypes.STRING,
//     allowNull: true
//   },
//   description_talent: {
//     type: DataTypes.TEXT,
//     allowNull: true
//   },
//   image_profil: {
//     type: DataTypes.STRING,
//     allowNull: true
//   },
//   statut_talent: {
//     type: DataTypes.ENUM('actif', 'inactif', 'en_validation'),
//     defaultValue: 'en_validation'
//   },
//   resetPasswordToken: {
//     type: DataTypes.STRING,
//     allowNull: true
//   },
//   resetPasswordExpires: {
//     type: DataTypes.DATE,
//     allowNull: true
//   },
//   specialite: {
//     type: DataTypes.STRING,
//     allowNull: true
//   },
//   annees_experience: {
//     type: DataTypes.INTEGER,
//     allowNull: true
//   },
//   competences: {
//     type: DataTypes.TEXT,
//     allowNull: true
//   },
//   disponibilites: {
//     type: DataTypes.TEXT,
//     allowNull: true
//   },
//   reseaux_sociaux: {
//     type: DataTypes.JSON,
//     allowNull: true,
//     defaultValue: {}
//   },
//   experience: {
//     type: DataTypes.JSON,
//     allowNull: true,
//     defaultValue: []
//   },
//   cv: {
//     type: DataTypes.STRING,
//     allowNull: true
//   },
//   telephone: {
//     type: DataTypes.STRING,
//     allowNull: true
//   },
//   adresse: {
//     type: DataTypes.STRING,
//     allowNull: true
//   }
// }, {
//   tableName: 'utilisateur',
//   timestamps: false,
//   hooks: {
//     beforeCreate: async (user) => {
//       if (user.password) {
//         user.password = await bcrypt.hash(user.password, 10);
//       }
//     },
//     beforeUpdate: async (user) => {
//       if (user.changed('password')) {
//         user.password = await bcrypt.hash(user.password, 10);
//       }
//     }
//   }
// });

// // Instance method to check password
// User.prototype.checkPassword = async function(password) {
//   return await bcrypt.compare(password, this.password);
// };

// export default User;