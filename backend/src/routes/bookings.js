import { Router } from 'express';
import Booking from '../models/Booking.js';
import Room from '../models/Room.js';
import { protect, allowRoles } from '../middleware/auth.js';
import { parseDateOnly, nightsBetween } from '../utils/dates.js';

const router = Router();
router.post('/', protect, allowRoles('guest'), async (req, res, next) => {
  try {
    const checkIn = parseDateOnly(req.body.checkIn);
    const checkOut = parseDateOnly(req.body.checkOut);
    const guests = Number(req.body.guests || 1);
    if (!checkIn || !checkOut || checkOut <= checkIn) return res.status(400).json({ message: 'Check-out must be after check-in; use valid dates.' });
    if (checkIn < new Date(new Date().toISOString().slice(0, 10) + 'T00:00:00.000Z')) return res.status(400).json({ message: 'Check-in cannot be in the past.' });
    if (!Number.isInteger(guests) || guests < 1 || guests > 12) return res.status(400).json({ message: 'Guest count must be between 1 and 12.' });
    const room = await Room.findOne({ _id: req.body.roomId, isActive: true, status: { $nin: ['maintenance', 'cleaning'] } });
    if (!room) return res.status(404).json({ message: 'Room is unavailable.' });
    if (guests > room.capacity) return res.status(400).json({ message: `This room accommodates up to ${room.capacity} guests.` });
    const conflict = await Booking.exists({
      room: room._id, status: { $in: ['confirmed', 'checked-in'] },
      checkIn: { $lt: checkOut }, checkOut: { $gt: checkIn }
    });
    if (conflict) return res.status(409).json({ message: 'This room is already booked for those dates. Search availability again.' });
    const nights = nightsBetween(checkIn, checkOut);
    const booking = await Booking.create({
      guest: req.user._id, room: room._id, checkIn, checkOut, guests, nights,
      totalAmount: nights * room.pricePerNight,
      paymentMethod: 'pay-at-hotel',
      specialRequests: String(req.body.specialRequests || '').trim().slice(0, 500)
    });
    await booking.populate([{ path: 'room' }, { path: 'guest', select: 'name email' }]);
    res.status(201).json({ booking });
  } catch (e) { next(e); }
});
router.get('/mine', protect, allowRoles('guest'), async (req, res, next) => {
  try {
    const bookings = await Booking.find({ guest: req.user._id }).populate('room').sort({ createdAt: -1 });
    res.json({ bookings });
  } catch (e) { next(e); }
});
router.get('/', protect, allowRoles('staff', 'admin'), async (req, res, next) => {
  try {
    const bookings = await Booking.find().populate('room').populate('guest', 'name email phone').sort({ createdAt: -1 }).limit(500);
    res.json({ bookings });
  } catch (e) { next(e); }
});
router.patch('/:id/cancel', protect, async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found.' });
    if (req.user.role !== 'admin' && String(booking.guest) !== String(req.user._id)) return res.status(403).json({ message: 'You cannot cancel this booking.' });
    if (booking.status !== 'confirmed') return res.status(400).json({ message: 'Only confirmed bookings can be cancelled.' });
    if (booking.checkIn <= new Date()) return res.status(400).json({ message: 'Bookings that have started cannot be cancelled online.' });
    booking.status = 'cancelled';
    await booking.save();
    res.json({ booking, message: 'Booking cancelled. Contact the hotel for any applicable refund.' });
  } catch (e) { next(e); }
});
router.patch('/:id/status', protect, allowRoles('staff', 'admin'), async (req, res, next) => {
  try {
    const nextStatus = req.body.status;
    if (!['confirmed', 'checked-in', 'checked-out', 'cancelled'].includes(nextStatus)) return res.status(400).json({ message: 'Invalid booking status.' });
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found.' });
    const transitions = { confirmed: ['checked-in', 'cancelled'], 'checked-in': ['checked-out'], 'checked-out': [], cancelled: [] };
    if (nextStatus !== booking.status && !transitions[booking.status].includes(nextStatus)) return res.status(400).json({ message: `Cannot change ${booking.status} to ${nextStatus}.` });
    booking.status = nextStatus;
    await booking.save();
    await booking.populate([{ path: 'room' }, { path: 'guest', select: 'name email phone' }]);
    res.json({ booking });
  } catch (e) { next(e); }
});
export default router;
