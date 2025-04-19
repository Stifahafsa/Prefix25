import express from 'express';
import { 
  getCommentaires, 
  createCommentaire, 
  updateCommentaire, 
  deleteCommentaire 
} from '../controllers/commentaireController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, getCommentaires);
router.post('/', verifyToken, createCommentaire);
router.put('/:id', verifyToken, updateCommentaire);
router.delete('/:id', verifyToken, deleteCommentaire);

export default router;