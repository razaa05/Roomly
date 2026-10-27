import mongoose from 'mongoose';
const roomSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  number: { type: String, required: true, unique: true, trim: true },
  category: { type: String, enum: ['Standard', 'Deluxe', 'Suite', 'Family'], default: 'Standard' },
  description: { type: String, default: '' },
  pricePerNight: { type: Number, required: true, min: 1 },
  capacity: { type: Number, required: true, min: 1, default: 2 },
  imageUrl: { type: String, default: '' },
  amenities: [{ type: String }],
  status: { type: String, enum: ['available', 'maintenance', 'cleaning', 'occupied'], default: 'available' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });
roomSchema.index({ category: 1, pricePerNight: 1, isActive: 1 });
export default mongoose.model('Room', roomSchema);
