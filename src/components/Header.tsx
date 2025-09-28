import { Link } from 'react-router-dom';
import { Button } from '@mui/material';

export default function Header() {
  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid #eee' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
          <span>🏠</span>
          <h1 style={{ margin: 0, fontSize: '1.2rem' }}>RealtorCRM</h1>
        </Link>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Link to="/calendar">
          <Button variant="outlined">Календарь</Button>
        </Link>
        <Link to="/profile">
          <Button variant="contained" color="primary">Профиль</Button>
        </Link>
      </div>
    </header>
  );
}