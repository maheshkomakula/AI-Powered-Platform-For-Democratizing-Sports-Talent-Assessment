import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const TELANGANA_DISTRICTS = [
    "Adilabad", "Bhadradri Kothagudem", "Hyderabad", "Jagtial", "Jangaon",
    "Jayashankar Bhupalpally", "Jogulamba Gadwal", "Kamareddy", "Karimnagar",
    "Khammam", "Kumuram Bheem Asifabad", "Mahabubabad", "Mahabubnagar",
    "Mancherial", "Medak", "Medchal-Malkajgiri", "Mulugu", "Nagarkurnool",
    "Nalgonda", "Narayanpet", "Nirmal", "Nizamabad", "Peddapalli",
    "Rajanna Sircilla", "Ranga Reddy", "Sangareddy", "Siddipet",
    "Suryapet", "Vikarabad", "Wanaparthy", "Warangal", "Hanamkonda",
    "Yadadri Bhuvanagiri"
];

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'Player',
    location: TELANGANA_DISTRICTS[0],
    phone: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password || !formData.phone) {
      setError("Please fill all fields");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.error || 'Registration failed');
        return;
      }
      
      alert('Registration Successful!');
      navigate('/login');
    } catch (err) {
      setError('Could not connect to the server');
    }
  };

  return (
    <div className="auth-page">
      <div className="glass-panel auth-card animate-fade-in" style={{maxWidth: '500px'}}>
        <div className="auth-header">
          <img src={logo} alt="Logo" style={{height: '60px', marginBottom: '1rem', objectFit: 'contain'}} />
          <h2>Create an Account</h2>
          <p style={{color: 'var(--text-muted)'}}>Join the Sports Talent Platform</p>
        </div>
        
        {error && (
          <div style={{color: 'var(--error)', marginBottom: '1rem', textAlign: 'center', fontWeight: '500'}}>
            {error}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input 
              type="text" 
              name="username"
              className="form-input" 
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              name="password"
              className="form-input" 
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Role</label>
            <select name="role" className="form-select" value={formData.role} onChange={handleChange}>
              <option value="Player">Player</option>
              <option value="Coach">Coach</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">District (Location)</label>
            <select name="location" className="form-select" value={formData.location} onChange={handleChange}>
              {TELANGANA_DISTRICTS.map(dist => (
                <option key={dist} value={dist}>{dist}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input 
              type="tel" 
              name="phone"
              className="form-input" 
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{width: '100%', marginTop: '1rem'}}>
            Register
          </button>
        </form>

        <p style={{textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem'}}>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}
