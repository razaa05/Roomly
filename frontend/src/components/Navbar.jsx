import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const signOut = () => { logout(); navigate('/'); };
  return <nav className="navbar navbar-expand-lg navbar-dark roomly-nav">
    <div className="container">
      <Link className="navbar-brand fw-bold" to="/">roomly<span>.</span></Link>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navContent" aria-controls="navContent" aria-expanded="false" aria-label="Toggle navigation"><span className="navbar-toggler-icon" /></button>
      <div className="collapse navbar-collapse" id="navContent">
        <div className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
          <NavLink className="nav-link" to="/rooms">Explore rooms</NavLink>
          {user?.role === 'guest' && <NavLink className="nav-link" to="/my-bookings">My bookings</NavLink>}
          {(user?.role === 'staff' || user?.role === 'admin') && <NavLink className="nav-link" to="/operations">Operations</NavLink>}
          {user?.role === 'admin' && <NavLink className="nav-link" to="/admin">Admin</NavLink>}
          {user ? <><span className="nav-user">{user.name}</span><button className="btn btn-sm btn-outline-light ms-lg-2" onClick={signOut}>Log out</button></> :
            <><Link className="nav-link" to="/login">Log in</Link><Link className="btn btn-sm btn-light rounded-pill px-3 ms-lg-2" to="/register">Create account</Link></>}
        </div>
      </div>
    </div>
  </nav>;
}
