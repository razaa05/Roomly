import { Link } from 'react-router-dom';
export default function NotFound() { return <main className="empty-state page-shell"><span className="eyebrow">404 · WRONG TURN</span><h1>Not quite <em>here.</em></h1><p>Let's get you back to somewhere comfortable.</p><Link to="/" className="btn btn-roomly">Back to home</Link></main>; }
