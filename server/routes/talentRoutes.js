// import express from 'express';
// import { getTalentProfile, updateTalentProfile, updatePassword, upload } from '../controllers/talentController.js';
// import { protect, isTalent } from '../middlewares/authMiddleware.js';

// const router = express.Router();

// // Middleware pour vérifier si l'utilisateur est authentifié et est un talent
// const talentAuthMiddleware = [protect, isTalent];

// // Route pour obtenir le profil du talent
// router.get('/profile', talentAuthMiddleware, getTalentProfile);

// // Route pour mettre à jour le profil du talent
// // Utilisation de multer pour gérer les fichiers uploadés
// router.put('/profile', 
//   talentAuthMiddleware, 
//   upload.fields([
//     { name: 'image_profil', maxCount: 1 },
//     { name: 'cv', maxCount: 1 }
//   ]), 
//   updateTalentProfile
// );

// // Route pour mettre à jour le mot de passe
// router.put('/password', talentAuthMiddleware, updatePassword);

// // Export nommé pour être compatible avec l'import dans app.js
// export const talentRouter = router;

// // Export par défaut pour d'autres imports
// export default router;