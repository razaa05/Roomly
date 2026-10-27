import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const today = new Date().toISOString().slice(0, 10);
const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
export default function RoomDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [checkIn, setCheckIn] = useState(today < tomorrow ? tomorrow : today);
  const [checkOut, setCheckOut] = useState(new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10));
  const [guests, setGuests] = useState(1);
  const [requests, setRequests] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => { api.get(`/rooms/${id}`).then(({ data }) => setRoom(data.room)).catch(() => toast.error('Room not found.')); }, [id]);
  const nights = Math.max(0, Math.round((new Date(`${checkOut}T00:00:00Z`) - new Date(`${checkIn}T00:00:00Z`)) / 86400000));
  const book = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login', { state: { from: `/rooms/${id}` } }); return; }
    setBusy(true);
    try {
      const { data } = await api.post('/bookings', { roomId: id, checkIn, checkOut, guests: Number(guests), specialRequests: requests });
      toast.success('Your reservation is confirmed!');
      navigate('/my-bookings', { state: { newBooking: data.booking._id } });
    } catch (e) { toast.error(e.response?.data?.message || 'Could not complete booking.'); }
    finally { setBusy(false); }
  };
  if (!room) return <main className="page-shell"><div className="container page-loader">Loading room details…</div></main>;
  return <main className="page-shell"><div className="container">
    <Link to="/rooms" className="back-link">← All rooms</Link>
    <div className="detail-grid mt-3">
      <div><img className="detail-image" src={room.imageUrl} alt={room.name} /><div className="detail-copy"><p className="eyebrow">{room.category} · ROOM {room.number}</p><h1>{room.name}</h1><p>{room.description}</p><h3 className="detail-subhead">Thoughtful essentials</h3><div className="amenity-list">{(room.amenities || []).map(a => <span key={a}>✳ {a}</span>)}</div></div></div>
      <aside className="booking-panel"><p className="eyebrow">MAKE IT YOURS</p><div className="booking-price">₹{Number(room.pricePerNight).toLocaleString('en-IN')} <span>/ night</span></div><p className="muted small">Taxes and any additional services may apply.</p>
        <form onSubmit={book} className="booking-form">
          <div><label className="form-label">Check-in</label><input className="form-control" type="date" min={tomorrow} value={checkIn} onChange={e => setCheckIn(e.target.value)} required /></div>
          <div><label className="form-label">Check-out</label><input className="form-control" type="date" min={checkIn || tomorrow} value={checkOut} onChange={e => setCheckOut(e.target.value)} required /></div>
          <div><label className="form-label">Guests</label><select className="form-select" value={guests} onChange={e => setGuests(e.target.value)}>{Array.from({ length: room.capacity }, (_, i) => <option key={i} value={i + 1}>{i + 1} guest{i ? 's' : ''}</option>)}</select></div>
          <div><label className="form-label">Special requests (optional)</label><textarea className="form-control" rows="2" maxLength="500" value={requests} onChange={e => setRequests(e.target.value)} placeholder="Anything we should know?" /></div>
          <div className="price-breakdown"><span>{nights} night{nights === 1 ? '' : 's'} × ₹{Number(room.pricePerNight).toLocaleString('en-IN')}</span><strong>₹{(nights * room.pricePerNight).toLocaleString('en-IN')}</strong></div>
          <button className="btn btn-roomly w-100 py-3" disabled={busy || nights < 1}>{busy ? 'Confirming…' : user ? 'Confirm reservation' : 'Log in to reserve'}</button>
          <p className="small muted text-center mb-0">Payment is currently due at the hotel.</p>
        </form>
      </aside>
    </div>
  </div></main>;
}
