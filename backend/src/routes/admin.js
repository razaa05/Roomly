import { Router } from 'express';
import { protect, allowRoles } from '../middleware/auth.js';
import User from '../models/User.js';
import Room from '../models/Room.js';
import Booking from '../models/Booking.js';
const router = Router();
router.use(protect, allowRoles('admin'));
router.get('/summary', async (_req, res, next) => {
  try {
    const [rooms, users, bookings, activeBookings, revenue] = await Promise.all([
      Room.countDocuments({ isActive: true }),
      User.countDocuments({ isActive: true }),
      Booking.countDocuments(),
      Booking.countDocuments({ status: { $in: ['confirmed', 'checked-in'] } }),
      Booking.aggregate([{ $match: { status: { $in: ['confirmed', 'checked-in', 'checked-out'] }, paymentStatus: 'paid' } }, { $group: { _id: null, total: { $sum: '$totalAmount' } } }])
    ]);
    res.json({ summary: { rooms, users, bookings, activeBookings, revenue: revenue[0]?.total || 0 } });
  } catch (e) { next(e); }
});
router.get('/users', async (_req, res, next) => {
  try {
    const users = await User.find().select('name email role phone isActive createdAt').sort({ createdAt: -1 }).limit(500);
    res.json({ users });
  } catch (e) { next(e); }
});
router.patch('/users/:id/role', async (req, res, next) => {
  try {
    const role = req.body.role;
    if (!['guest', 'staff', 'admin'].includes(role)) return res.status(400).json({ message: 'Invalid role.' });
    if (String(req.params.id) === String(req.user._id)) return res.status(400).json({ message: 'You cannot change your own role.' });
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true, runValidators: true }).select('name email role phone isActive');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json({ user });
  } catch (e) { next(e); }
});
export default router;
