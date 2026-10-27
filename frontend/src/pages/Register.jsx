import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
export default function Register() {
  const { register } = useAuth(); const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' }); const [busy, setBusy] = useState(false);
  const change = e => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = async e => { e.preventDefault(); setBusy(true); try { await register(form); toast.success('Your account is ready.'); navigate('/rooms'); } catch (e) { toast.error(e.response?.data?.message || 'Unable to register.'); } finally { setBusy(false); } };
  return <main className="auth-shell"><div className="auth-card"><p className="eyebrow">START YOUR NEXT CHAPTER</p><h1>Make yourself <em>at home.</em></h1><p className="muted">Create your account and find your next stay.</p><form onSubmit={submit} className="auth-form"><div><label className="form-label">Full name</label><input className="form-control" name="name" value={form.name} onChange={change} minLength="2" maxLength="80" autoComplete="name" required /></div><div><label className="form-label">Email address</label><input className="form-control" name="email" type="email" value={form.email} onChange={change} autoComplete="email" required /></div><div><label className="form-label">Phone (optional)</label><input className="form-control" name="phone" value={form.phone} onChange={change} autoComplete="tel" /></div><div><label className="form-label">Password</label><input className="form-control" name="password" type="password" value={form.password} onChange={change} minLength="8" autoComplete="new-password" required /><small className="muted">Use at least 8 characters.</small></div><button className="btn btn-roomly w-100 py-3" disabled={busy}>{busy ? 'Creating account…' : 'Create account'}</button></form><p className="auth-switch">Already have an account? <Link to="/login">Log in</Link></p></div></main>;
}
