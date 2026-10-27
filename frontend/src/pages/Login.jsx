import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
export default function Login() {
  const { login } = useAuth(); const navigate = useNavigate(); const location = useLocation();
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [busy, setBusy] = useState(false);
  const submit = async e => { e.preventDefault(); setBusy(true); try { const user = await login(email, password); toast.success(`Welcome back, ${user.name.split(' ')[0]}!`); navigate(location.state?.from || (user.role === 'admin' ? '/admin' : user.role === 'staff' ? '/operations' : '/')); } catch (e) { toast.error(e.response?.data?.message || 'Unable to log in.'); } finally { setBusy(false); } };
  return <main className="auth-shell"><div className="auth-card"><p className="eyebrow">YOUR ROOMLY ACCOUNT</p><h1>Welcome <em>back.</em></h1><p className="muted">Log in to manage your stay.</p><form onSubmit={submit} className="auth-form"><div><label className="form-label">Email address</label><input className="form-control" type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required /></div><div><label className="form-label">Password</label><input className="form-control" type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required /></div><button className="btn btn-roomly w-100 py-3" disabled={busy}>{busy ? 'Logging in…' : 'Log in'}</button></form><p className="auth-switch">New to Roomly? <Link to="/register">Create an account</Link></p><div className="demo-note"><strong>Demo accounts</strong><br />admin@roomly.local / Admin123!<br />staff@roomly.local / Staff123!<br />guest@roomly.local / Guest123!</div></div></main>;
}
