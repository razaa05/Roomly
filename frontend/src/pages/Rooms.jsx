import { useEffect, useState } from 'react';
import api from '../api';
import RoomCard from '../components/RoomCard';
export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [category, setCategory] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = async () => {
    setLoading(true); setError('');
    try { const { data } = await api.get('/rooms', { params: { category: category || undefined, maxPrice: maxPrice || undefined } }); setRooms(data.rooms); }
    catch (e) { setError(e.response?.data?.message || 'Could not load rooms. Is the backend running?'); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);
  return <main className="page-shell"><div className="container">
    <div className="page-heading"><p className="eyebrow">THE ROOM COLLECTION</p><h1>Find your <em>space.</em></h1><p>Thoughtfully picked rooms for wherever life takes you.</p></div>
    <div className="filter-bar"><div><label className="form-label">Room type</label><select className="form-select" value={category} onChange={e => setCategory(e.target.value)}><option value="">All categories</option><option>Standard</option><option>Deluxe</option><option>Suite</option><option>Family</option></select></div><div><label className="form-label">Maximum price per night</label><select className="form-select" value={maxPrice} onChange={e => setMaxPrice(e.target.value)}><option value="">Any price</option><option value="2500">Up to ₹2,500</option><option value="4000">Up to ₹4,000</option><option value="6000">Up to ₹6,000</option></select></div><button className="btn btn-roomly filter-button" onClick={load}>Apply filters</button></div>
    {error && <div className="alert alert-warning">{error}</div>}
    {loading ? <div className="page-loader">Finding your room…</div> : <><p className="muted mb-3">{rooms.length} room{rooms.length === 1 ? '' : 's'} to explore</p><div className="row g-4">{rooms.map(room => <div className="col-md-6 col-lg-4" key={room._id}><RoomCard room={room} /></div>)}</div>{rooms.length === 0 && <div className="empty-state"><h3>No rooms match those filters.</h3><p>Try a different category or price range.</p></div>}</>}
  </div></main>;
}
