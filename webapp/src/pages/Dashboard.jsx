import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UPCOMING_TOURNAMENTS = [
  { dist: "Hyderabad", name: "Hyderabad Premier League", date: "25 Sep 2026" },
  { dist: "Warangal", name: "Warangal Cricket Cup", date: "10 Oct 2026" },
  { dist: "Karimnagar", name: "Karimnagar Football Tournament", date: "20 Oct 2026" },
  { dist: "Nizamabad", name: "Nizamabad Hockey Challenge", date: "05 Nov 2026" },
  { dist: "Khammam", name: "Khammam Open Tennis", date: "15 Nov 2026" },
  { dist: "Hyderabad", name: "Hyderabad Premier League", date: "25 Sep 2027" },
  { dist: "Warangal", name: "Warangal Cricket Cup", date: "10 Oct 2027" }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [allUsers, setAllUsers] = useState({});

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
      navigate('/login');
    } else {
      setUser(currentUser);
    }
    setAllUsers(JSON.parse(localStorage.getItem('users') || '{}'));
  }, [navigate]);

  if (!user) return null;

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  const getPlayers = () => {
    return Object.entries(allUsers)
      .map(([username, data]) => ({ username, ...data }))
      .filter(u => u.role === 'Player');
  };

  const myTournaments = UPCOMING_TOURNAMENTS.filter(t => t.dist === user.location);
  const otherTournaments = UPCOMING_TOURNAMENTS.filter(t => t.dist !== user.location);

  const players = getPlayers();
  const myPlayers = players.filter(p => p.location === user.location);
  const otherPlayers = players.filter(p => p.location !== user.location);

  return (
    <div className="app-container">
      <nav className="dashboard-nav">
        <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
          <img src="/logo.png" alt="Logo" style={{height: '40px'}} onError={(e) => {e.target.style.display='none'}} />
          <h2 style={{color: 'var(--primary)'}}>Sports Talent</h2>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
          <span style={{fontWeight: '500'}}>Welcome, {user.username} ({user.role})</span>
          <button className="btn btn-primary" onClick={() => navigate('/profile')} style={{padding: '0.5rem 1rem'}}>My Profile</button>
          <button className="btn btn-danger" onClick={handleLogout} style={{padding: '0.5rem 1rem'}}>Logout</button>
        </div>
      </nav>

      <main className="dashboard-content animate-fade-in">
        <div className="glass-panel" style={{padding: '2rem', marginBottom: '2rem'}}>
          <h1 style={{fontSize: '2rem', marginBottom: '0.5rem'}}>Hello, {user.username}!</h1>
          <p style={{color: 'var(--text-muted)', fontSize: '1.1rem'}}>📍 Location: {user.location}</p>
        </div>

        {user.role === 'Player' && (
          <div className="glass-panel" style={{padding: '2rem', marginBottom: '2rem', textAlign: 'center'}}>
            <h2 style={{marginBottom: '1rem'}}>Ready to improve your game?</h2>
            <p style={{marginBottom: '1.5rem', color: 'var(--text-muted)'}}>Use our AI-powered video analysis to get instant feedback on your posture and technique.</p>
            <button className="btn btn-primary" onClick={() => navigate('/analysis')} style={{fontSize: '1.2rem', padding: '1rem 2rem'}}>
              Launch Video Analysis
            </button>
          </div>
        )}

        <div className="grid-cards">
          {/* Player View: Tournaments */}
          {user.role === 'Player' && (
            <>
              <div className="glass-panel" style={{padding: '1.5rem'}}>
                <h3 style={{color: '#4338ca', marginBottom: '1rem'}}>🏆 Tournaments in your District</h3>
                {myTournaments.length > 0 ? (
                  <table className="data-table">
                    <thead><tr><th>Tournament</th><th>Date</th></tr></thead>
                    <tbody>
                      {myTournaments.map((t, i) => (
                        <tr key={i}><td>{t.name}</td><td>{t.date}</td></tr>
                      ))}
                    </tbody>
                  </table>
                ) : <p>No upcoming tournaments in your district.</p>}
              </div>
              <div className="glass-panel" style={{padding: '1.5rem'}}>
                <h3 style={{color: '#b45309', marginBottom: '1rem'}}>🏆 Other Tournaments</h3>
                <table className="data-table">
                  <thead><tr><th>District</th><th>Tournament</th><th>Date</th></tr></thead>
                  <tbody>
                    {otherTournaments.map((t, i) => (
                      <tr key={i}><td>{t.dist}</td><td>{t.name}</td><td>{t.date}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Coach View: Players */}
          {user.role === 'Coach' && (
            <>
              <div className="glass-panel" style={{padding: '1.5rem'}}>
                <h3 style={{color: '#059669', marginBottom: '1rem'}}>👥 Players in your District</h3>
                {myPlayers.length > 0 ? (
                  <table className="data-table">
                    <thead><tr><th>Username</th><th>Phone</th></tr></thead>
                    <tbody>
                      {myPlayers.map((p, i) => (
                        <tr key={i}><td>{p.username}</td><td>{p.phone}</td></tr>
                      ))}
                    </tbody>
                  </table>
                ) : <p>No registered players in your district.</p>}
              </div>
              <div className="glass-panel" style={{padding: '1.5rem'}}>
                <h3 style={{color: '#b45309', marginBottom: '1rem'}}>👥 Other Players</h3>
                {otherPlayers.length > 0 ? (
                  <table className="data-table">
                    <thead><tr><th>Username</th><th>District</th><th>Phone</th></tr></thead>
                    <tbody>
                      {otherPlayers.map((p, i) => (
                        <tr key={i}><td>{p.username}</td><td>{p.location}</td><td>{p.phone}</td></tr>
                      ))}
                    </tbody>
                  </table>
                ) : <p>No players from other districts.</p>}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
