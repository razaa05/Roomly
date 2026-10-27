import { Router } from 'express';
import Room from '../models/Room.js';
import Booking from '../models/Booking.js';
import { protect, allowRoles } from '../middleware/auth.js';
import { parseDateOnly } from '../utils/dates.js';

const router = Router();
router.get('/availability', async (req, res, next) => {
  try {
    const checkIn = parseDateOnly(req.query.checkIn);
    const checkOut = parseDateOnly(req.query.checkOut);
    if (!checkIn || !checkOut || checkOut <= checkIn) return res.status(400).json({ message: 'Provide valid check-in and check-out dates.' });
    const conflicts = await Booking.find({
      status: { $in: ['confirmed', 'checked-in'] },
      checkIn: { $lt: checkOut }, checkOut: { $gt: checkIn }
    }).select('room');
    const busyIds = conflicts.map(b => b.room);
    const rooms = await Room.find({ isActive: true, status: { $nin: ['maintenance', 'cleaning'] }, _id: { $nin: busyIds } }).sort({ pricePerNight: 1 });
    res.json({ rooms });
  } catch (e) { next(e); }
});
router.get('/', async (req, res, next) => {
  try {
    const filter = { isActive: true };
    if (req.query.category && ['Standard', 'Deluxe', 'Suite', 'Family'].includes(req.query.category)) filter.category = req.query.category;
    if (req.query.maxPrice && Number.isFinite(Number(req.query.maxPrice))) filter.pricePerNight = { $lte: Number(req.query.maxPrice) };
    const rooms = await Room.find(filter).sort({ pricePerNight: 1 });
    res.json({ rooms });
  } catch (e) { next(e); }
});
router.get('/:id', async (req, res, next) => {
  try {
    const room = await Room.findOne({ _id: req.params.id, isActive: true });
    if (!room) return res.status(404).json({ message: 'Room not found.' });
    res.json({ room });
  } catch (e) { next(e); }
});
router.post('/', protect, allowRoles('admin'), async (req, res, next) => {
  try {
    const room = await Room.create(req.body);
    res.status(201).json({ room });
  } catch (e) { next(e); }
});
router.patch('/:id', protect, allowRoles('admin'), async (req, res, next) => {
  try {
    const allowed = ['name', 'number', 'category', 'description', 'pricePerNight', 'capacity', 'imageUrl', 'amenities', 'status', 'isActive'];
    const changes = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
    const room = await Room.findByIdAndUpdate(req.params.id, changes, { new: true, runValidators: true });
    if (!room) return res.status(404).json({ message: 'Room not found.' });
    res.json({ room });
  } catch (e) { next(e); }
});
router.delete('/:id', protect, allowRoles('admin'), async (req, res, next) => {
  try {
    const futureBooking = await Booking.exists({ room: req.params.id, status: { $in: ['confirmed', 'checked-in'] }, checkOut: { $gt: new Date() } });
    if (futureBooking) return res.status(409).json({ message: 'This room has an active booking. Mark it inactive instead.' });
    const room = await Room.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!room) return res.status(404).json({ message: 'Room not found.' });
    res.json({ message: 'Room archived.' });
  } catch (e) { next(e); }
});
export default router;
