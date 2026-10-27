import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Rooms from './pages/Rooms';
import RoomDetails from './pages/RoomDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import MyBookings from './pages/MyBookings';
import Operations from './pages/Operations';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';

export default function App() {
  return <>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/rooms" element={<Rooms />} />
      <Route path="/rooms/:id" element={<RoomDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/my-bookings" element={<ProtectedRoute roles={['guest']}><MyBookings /></ProtectedRoute>} />
      <Route path="/operations" element={<ProtectedRoute roles={['staff', 'admin']}><Operations /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute roles={['admin']}><Admin /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    <footer className="site-footer"><div className="container d-flex flex-wrap justify-content-between gap-2"><span className="footer-brand">roomly.</span><span>Thoughtful stays. Seamless experiences.</span><span>College project · MERN Stack</span></div></footer>
  </>;
}
