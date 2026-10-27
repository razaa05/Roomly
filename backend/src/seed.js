import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Room from './models/Room.js';

try {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/roomly');
  const demoUsers = [
    { name: 'Roomly Admin', email: 'admin@roomly.local', password: 'Admin123!', role: 'admin' },
    { name: 'Roomly Staff', email: 'staff@roomly.local', password: 'Staff123!', role: 'staff' },
    { name: 'Demo Guest', email: 'guest@roomly.local', password: 'Guest123!', role: 'guest' }
  ];
  for (const item of demoUsers) {
    if (!(await User.exists({ email: item.email }))) {
      await User.create({ name: item.name, email: item.email, role: item.role, passwordHash: await bcrypt.hash(item.password, 12) });
    }
  }
  const demoRooms = [
    { name: 'Classic Comfort', number: '101', category: 'Standard', pricePerNight: 2200, capacity: 2, description: 'A comfortable room with warm interiors and everything you need for a restful stay.', imageUrl: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80', amenities: ['Wi-Fi', 'Air conditioning', 'TV', 'Work desk'] },
    { name: 'Deluxe Retreat', number: '202', category: 'Deluxe', pricePerNight: 3800, capacity: 2, description: 'A spacious room with upgraded amenities and a calm, contemporary design.', imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80', amenities: ['Wi-Fi', 'Air conditioning', 'Smart TV', 'Mini fridge'] },
    { name: 'Urban Suite', number: '301', category: 'Suite', pricePerNight: 6200, capacity: 3, description: 'A refined suite with a lounge area for guests who want a little more space.', imageUrl: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80', amenities: ['Wi-Fi', 'Lounge', 'Mini fridge', 'Room service'] },
    { name: 'Family Haven', number: '401', category: 'Family', pricePerNight: 5100, capacity: 4, description: 'A flexible family room with generous space for a small group or family.', imageUrl: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80', amenities: ['Wi-Fi', 'Air conditioning', 'Extra beds', 'TV'] }
  ];
  for (const room of demoRooms) {
    if (!(await Room.exists({ number: room.number }))) await Room.create(room);
  }
  console.log('Seed complete. Demo accounts and sample rooms are ready.');
  await mongoose.disconnect();
} catch (error) {
  console.error('Seed failed. Check your MongoDB connection (MONGODB_URI):', error.message);
  process.exit(1);
}
