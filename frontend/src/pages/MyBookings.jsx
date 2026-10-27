import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api';
const money = n => `₹${Number(n || 0).toLocaleString('en-IN')}`;
export default function MyBookings() {
  const [bookings, setBookings] = useState([]); const [loading, setLoading] = useState(true);
  const load = () => api.get('/bookings/mine').then(({ data }) => setBookings(data.bookings)).catch(e => toast.error(e.response?.data?.message || 'Could not load bookings.')).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);
  const cancel = async id => { if (!window.confirm('Cancel this reservation?')) return; try { await api.patch(`/bookings/${id}/cancel`); toast.success('Reservation cancelled.'); load(); } catch (e) { toast.error(e.response?.data?.message || 'Cancellation failed.'); } };
  return <main className="page-shell"><div className="container"><div className="page-heading compact-heading"><p className="eyebrow">YOUR ROOMLY JOURNEY</p><h1>Your <em>bookings.</em></h1><p>All your upcoming plans, in one place.</p></div>
    {loading ? <div className="page-loader">Loading your bookings…</div> : bookings.length === 0 ? <div className="empty-state"><span className="empty-icon">✳</span><h3>Your next stay starts here.</h3><p>You don't have any reservations yet.</p><Link to="/rooms" className="btn btn-roomly">Explore rooms</Link></div> :
      <div className="booking-list">{bookings.map(b => <article className="booking-row" key={b._id}><div className="booking-thumb">{b.room?.imageUrl && <img src={b.room.imageUrl} alt="" />}</div><div className="booking-row-main"><p className="eyebrow">BOOKING #{b._id.slice(-7).toUpperCase()}</p><h3>{b.room?.name || 'Room unavailable'}</h3><p>{new Date(b.checkIn).toLocaleDateString('en-IN')} — {new Date(b.checkOut).toLocaleDateString('en-IN')} · {b.nights} night{b.nights === 1 ? '' : 's'}</p><span className={`status-pill status-${b.status}`}>{b.status.replace('-', ' ')}</span></div><div className="booking-row-end"><strong>{money(b.totalAmount)}</strong><span className="muted small">{b.paymentStatus === 'paid' ? 'Paid' : 'Pay at hotel'}</span>{b.status === 'confirmed' && new Date(b.checkIn) > new Date() && <button className="btn btn-sm btn-outline-secondary mt-2" onClick={() => cancel(b._id)}>Cancel booking</button>}</div></article>)}</div>}
  </div></main>;
}
