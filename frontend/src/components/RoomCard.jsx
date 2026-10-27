import { Link } from 'react-router-dom';
export default function RoomCard({ room }) {
  return <article className="room-card h-100">
    <Link to={`/rooms/${room._id}`} className="room-image-wrap">
      <img className="room-image" src={room.imageUrl || 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80'} alt={room.name} loading="lazy" />
      <span className="room-category">{room.category}</span>
    </Link>
    <div className="room-card-body">
      <div className="d-flex justify-content-between align-items-start gap-2">
        <div><p className="eyebrow mb-1">ROOM {room.number}</p><h3 className="room-title">{room.name}</h3></div>
        <div className="text-end"><strong className="room-price">₹{Number(room.pricePerNight).toLocaleString('en-IN')}</strong><div className="muted small">/ night</div></div>
      </div>
      <p className="room-description">{room.description}</p>
      <div className="room-meta"><span>♙ Up to {room.capacity} guests</span><span>✦ {room.amenities?.slice(0, 2).join(' · ') || 'Comfort stay'}</span></div>
      <Link className="btn btn-roomly w-100 mt-3" to={`/rooms/${room._id}`}>View room <span aria-hidden="true">↗</span></Link>
    </div>
  </article>;
}
