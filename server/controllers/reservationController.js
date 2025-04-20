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
    const [updated] = await Reservation.update(req.body, { where: { id } });
    if (updated) {
      const updatedReservation = await Reservation.findByPk(id);
      res.json(updatedReservation);
    } else {
      res.status(404).json({ message: "Reservation not found" });
    }
  } catch (err) {
    console.error(err); // Add this line to log the real error
    res.status(500).json({ message: "Erreur lors de la modification de la réservation" });
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

export const createReservation = async (req, res) => {
  try {
    const reservation = await Reservation.create(req.body);
    res.status(201).json(reservation);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de l'enregistrement de la réservation" });
  }
};