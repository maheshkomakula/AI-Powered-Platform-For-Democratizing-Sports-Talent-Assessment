import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login failed');
        return;
      }

      // Store the active session user so the dashboard continues to work
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (err) {
      setError('Could not connect to the server');
    }
  };

  return (
    <div className="auth-page">
      <div className="glass-panel auth-card animate-fade-in">
        <div className="auth-header">
          <img src="/logo.png" alt="Logo" className="auth-logo" onError={(e) => {e.target.style.display='none'}} />
          <h2>Welcome Back</h2>
          <p style={{color: 'var(--text-muted)'}}>Login to Sports Talent Platform</p>
        </div>
        
        {error && (
          <div style={{color: 'var(--error)', marginBottom: '1rem', textAlign: 'center', fontWeight: '500'}}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input 
              type="text" 
              className="form-input" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter your username"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-input" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{width: '100%', marginTop: '1rem'}}>
            Login
          </button>
        </form>

        <p style={{textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem'}}>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}
