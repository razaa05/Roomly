import mongoose from 'mongoose';
const bookingSchema = new mongoose.Schema({
  guest: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true, index: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  guests: { type: Number, min: 1, required: true, default: 1 },
  nights: { type: Number, required: true, min: 1 },
  totalAmount: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['confirmed', 'checked-in', 'checked-out', 'cancelled'], default: 'confirmed', index: true },
  paymentMethod: { type: String, enum: ['pay-at-hotel'], default: 'pay-at-hotel' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },
  specialRequests: { type: String, maxlength: 500, default: '' }
}, { timestamps: true });
bookingSchema.index({ room: 1, checkIn: 1, checkOut: 1, status: 1 });
export default mongoose.model('Booking', bookingSchema);
