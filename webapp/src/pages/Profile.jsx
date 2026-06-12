import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    location: '',
    phone: '',
    bio: '',
    sport: '',
    experience_level: ''
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (!currentUser) {
        navigate('/login');
        return;
      }
      
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/profile/${currentUser.username}`);
        if (response.ok) {
          const data = await response.json();
          setUser(data);
          setFormData({
            location: data.location || '',
            phone: data.phone || '',
            bio: data.bio || '',
            sport: data.sport || '',
            experience_level: data.experience_level || ''
          });
        } else {
          setError('Could not load profile data');
        }
      } catch (err) {
        setError('Could not connect to the server');
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/profile/${user.username}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.error || 'Failed to update profile');
        return;
      }
      
      setUser(data.user);
      // Update local storage to match the new basic details
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      localStorage.setItem('currentUser', JSON.stringify({ ...currentUser, ...data.user }));
      
      setMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setError('Could not connect to the server');
    }
  };

  if (!user) return <div style={{padding: '2rem', textAlign: 'center'}}>Loading profile...</div>;

  return (
    <div className="app-container">
      <nav className="dashboard-nav">
        <div style={{display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer'}} onClick={() => navigate('/dashboard')}>
          <img src="/logo.png" alt="Logo" style={{height: '40px'}} onError={(e) => {e.target.style.display='none'}} />
          <h2 style={{color: 'var(--primary)'}}>Sports Talent</h2>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
          <button className="btn btn-secondary" onClick={() => navigate('/dashboard')} style={{padding: '0.5rem 1rem'}}>Back to Dashboard</button>
        </div>
      </nav>

      <main className="dashboard-content animate-fade-in" style={{maxWidth: '800px'}}>
        <div className="glass-panel" style={{padding: '2.5rem'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
            <h1 style={{fontSize: '2rem'}}>My Profile</h1>
            {!isEditing && (
              <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                Edit Profile
              </button>
            )}
          </div>

          {error && <div style={{color: 'var(--error)', marginBottom: '1rem', fontWeight: '500'}}>{error}</div>}
          {message && <div style={{color: 'var(--secondary)', marginBottom: '1rem', fontWeight: '500'}}>{message}</div>}

          {!isEditing ? (
            <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
              <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
                <div style={{
                  width: '80px', height: '80px', borderRadius: '50%', 
                  background: 'var(--primary)', color: 'white', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '2.5rem', fontWeight: 'bold'
                }}>
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 style={{fontSize: '1.5rem'}}>{user.username}</h2>
                  <span style={{
                    display: 'inline-block', padding: '0.25rem 0.75rem', 
                    background: 'rgba(67, 56, 202, 0.1)', color: 'var(--primary)',
                    borderRadius: '999px', fontSize: '0.875rem', fontWeight: '600', marginTop: '0.5rem'
                  }}>
                    {user.role}
                  </span>
                </div>
              </div>
              
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1rem'}}>
                <div>
                  <h4 style={{color: 'var(--text-muted)', marginBottom: '0.5rem'}}>Location</h4>
                  <p style={{fontSize: '1.1rem'}}>{user.location || 'Not specified'}</p>
                </div>
                <div>
                  <h4 style={{color: 'var(--text-muted)', marginBottom: '0.5rem'}}>Phone Number</h4>
                  <p style={{fontSize: '1.1rem'}}>{user.phone || 'Not specified'}</p>
                </div>
                <div>
                  <h4 style={{color: 'var(--text-muted)', marginBottom: '0.5rem'}}>Primary Sport</h4>
                  <p style={{fontSize: '1.1rem'}}>{user.sport || 'Not specified'}</p>
                </div>
                <div>
                  <h4 style={{color: 'var(--text-muted)', marginBottom: '0.5rem'}}>Experience Level</h4>
                  <p style={{fontSize: '1.1rem'}}>{user.experience_level || 'Not specified'}</p>
                </div>
              </div>

              <div style={{marginTop: '0.5rem'}}>
                <h4 style={{color: 'var(--text-muted)', marginBottom: '0.5rem'}}>Bio</h4>
                <p style={{fontSize: '1.1rem', lineHeight: '1.6', background: 'rgba(255,255,255,0.5)', padding: '1rem', borderRadius: '8px'}}>
                  {user.bio || 'Tell us a bit about yourself! Click Edit Profile to add a bio.'}
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem'}}>
                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input type="text" name="location" className="form-input" value={formData.location} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input type="tel" name="phone" className="form-input" value={formData.phone} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Primary Sport</label>
                  <input type="text" name="sport" className="form-input" value={formData.sport} onChange={handleChange} placeholder="e.g. Cricket, Football" />
                </div>
                <div className="form-group">
                  <label className="form-label">Experience Level</label>
                  <select name="experience_level" className="form-select" value={formData.experience_level} onChange={handleChange}>
                    <option value="">Select Level</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Professional">Professional</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Bio</label>
                <textarea 
                  name="bio" 
                  className="form-input" 
                  rows="4" 
                  value={formData.bio} 
                  onChange={handleChange}
                  placeholder="Tell us about your athletic journey, achievements, and goals..."
                  style={{resize: 'vertical'}}
                ></textarea>
              </div>
              
              <div style={{display: 'flex', gap: '1rem', marginTop: '2rem'}}>
                <button type="submit" className="btn btn-primary" style={{padding: '0.75rem 2rem'}}>Save Changes</button>
                <button type="button" className="btn btn-outline" onClick={() => {setIsEditing(false); setError('');}} style={{padding: '0.75rem 2rem'}}>Cancel</button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
