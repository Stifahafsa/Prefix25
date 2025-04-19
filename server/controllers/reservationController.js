import Reservation from '../models/reservation.js';

export const getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.findAll();
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Reservation.update(req.body, { where: { id } });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;
    await Reservation.destroy({ where: { id } });
    res.json({ message: 'Reservation deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};