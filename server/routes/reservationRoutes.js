import express from 'express';
import { 
  getReservations, 
  updateReservation, 
  deleteReservation 
} from '../controllers/reservationController.js';
import { verifyToken, isSuperAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, getReservations);
router.put('/:id', verifyToken, updateReservation);
router.delete('/:id', verifyToken, isSuperAdmin, deleteReservation); 

export default router;