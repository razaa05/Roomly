import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api';
import RoomCard from '../components/RoomCard';

export default function Home() {
  const [rooms, setRooms] = useState([]);
  useEffect(() => { api.get('/rooms').then(({ data }) => setRooms(data.rooms.slice(0, 3))).catch(() => {}); }, []);
  return <main>
    <section className="hero">
      <div className="hero-overlay" />
      <div className="container hero-content">
        <div className="hero-copy">
          <p className="hero-kicker"><span /> A BETTER WAY TO STAY</p>
          <h1>Find your<br /><em>somewhere.</em></h1>
          <p className="hero-subtitle">Considered spaces, effortless booking, and the little details that make a stay feel like yours.</p>
          <div className="d-flex flex-wrap gap-3 mt-4"><Link className="btn btn-light rounded-pill px-4 py-3" to="/rooms">Explore our rooms ↗</Link><a className="hero-text-link" href="#why-roomly">Discover Roomly ↓</a></div>
        </div>
        <div className="hero-note"><span className="note-mark">✳</span><span>Good stays<br />stay with you.</span></div>
      </div>
      <div className="hero-bottom"><span>01 — 04 / YOUR NEXT STAY</span><span>DESIGNED FOR SLOWER MORNINGS</span></div>
    </section>
    <section className="intro-section section-pad" id="why-roomly">
      <div className="container intro-grid">
        <div><p className="eyebrow">WELCOME TO ROOMLY</p><h2 className="section-heading">More than a room.<br /><em>A feeling.</em></h2></div>
        <div className="intro-copy"><p>We believe a great stay is made of simple things done beautifully: a comfortable room, a clear booking experience, and the freedom to make the time your own.</p><Link className="underlined-link" to="/rooms">Find your kind of comfort <span>↗</span></Link></div>
      </div>
    </section>
    <section className="featured-section section-pad">
      <div className="container">
        <div className="section-top"><div><p className="eyebrow">A PLACE FOR EVERY PACE</p><h2 className="section-heading">Rooms to settle into.</h2></div><Link to="/rooms" className="underlined-link">View all rooms ↗</Link></div>
        <div className="row g-4 mt-2">{rooms.map(room => <div className="col-md-6 col-lg-4" key={room._id}><RoomCard room={room} /></div>)}
          {rooms.length === 0 && <div className="col-12"><p className="muted">Connect the backend and seed the sample rooms to see featured stays here.</p><Link to="/rooms" className="btn btn-roomly">Browse rooms</Link></div>}
        </div>
      </div>
    </section>
    <section className="promise-section"><div className="container promise-grid"><div><span className="promise-icon">✳</span><h3>Easy by design</h3><p>Find a room and make a reservation in a few simple steps.</p></div><div><span className="promise-icon">⌂</span><h3>Comfort, considered</h3><p>Room details, amenities, and prices are clear from the start.</p></div><div><span className="promise-icon">↗</span><h3>Stay in control</h3><p>Keep track of bookings and manage your stay from one place.</p></div></div></section>
  </main>;
}
