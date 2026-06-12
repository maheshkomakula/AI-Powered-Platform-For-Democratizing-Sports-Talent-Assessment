import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function Home() {
  return (
    <div className="home-page">
      <nav className="home-nav glass-panel">
        <div className="nav-brand">
          <img src={logo} alt="Sports Talent Platform Logo" className="nav-logo" />
          <span className="nav-title">Sports Talent Platform</span>
        </div>
        <div className="nav-links">
          <Link to="/login" className="btn btn-secondary nav-btn">Login</Link>
          <Link to="/register" className="btn btn-primary nav-btn">Get Started</Link>
        </div>
      </nav>

      <main className="home-main">
        <section className="hero-section">
          <div className="hero-content animate-fade-in">
            <h1 className="hero-title">
              Discover & Nurture <br/>
              <span className="text-gradient">Sports Talent</span>
            </h1>
            <p className="hero-subtitle">
              The ultimate ecosystem connecting aspiring players with top-tier coaches, leveraging advanced video analytics and data-driven insights to elevate performance.
            </p>
            <div className="hero-cta">
              <Link to="/register" className="btn btn-primary btn-large cta-btn">Join as Player or Coach</Link>
              <a href="#features" className="btn btn-outline btn-large cta-btn">Explore Features</a>
            </div>
          </div>
          
          <div className="hero-graphics animate-fade-in-delayed">
            <div className="glass-panel abstract-shape shape-1"></div>
            <div className="glass-panel abstract-shape shape-2"></div>
            <div className="glass-panel abstract-shape shape-3"></div>
            <img src={logo} alt="Hero Graphics" className="hero-main-img" style={{filter: 'drop-shadow(0px 10px 20px rgba(0,0,0,0.15))'}} />
          </div>
        </section>

        <section id="features" className="features-section">
          <div className="section-header">
            <h2 className="section-title">Why Choose Our Platform?</h2>
            <div className="title-underline"></div>
          </div>
          
          <div className="features-grid">
            <div className="feature-card glass-panel animate-on-scroll">
              <div className="feature-icon player-icon">🏃‍♂️</div>
              <h3 className="feature-title">For Players</h3>
              <p className="feature-desc">
                Create your athletic profile, upload performance videos, and get discovered by top coaches.
              </p>
            </div>
            
            <div className="feature-card glass-panel animate-on-scroll delay-1">
              <div className="feature-icon coach-icon">📋</div>
              <h3 className="feature-title">For Coaches</h3>
              <p className="feature-desc">
                Scout emerging talent, access rich player metrics, and organize your coaching roster efficiently.
              </p>
            </div>
            
            <div className="feature-card glass-panel animate-on-scroll delay-2">
              <div className="feature-icon analytics-icon">📈</div>
              <h3 className="feature-title">Advanced Analytics</h3>
              <p className="feature-desc">
                Utilize our cutting-edge video analysis tools powered by AI to get actionable insights on biomechanics and form.
              </p>
            </div>
          </div>
        </section>

        <section id="sports" className="features-section" style={{background: 'var(--glass-bg)'}}>
          <div className="section-header">
            <h2 className="section-title">Supported Sports</h2>
            <div className="title-underline"></div>
            <p style={{marginTop: '1rem', color: 'var(--text-muted)', fontSize: '1.125rem'}}>
              We currently specialize in advanced analytics and talent discovery for these primary sports.
            </p>
          </div>
          
          <div className="features-grid" style={{maxWidth: '800px'}}>
            <div className="feature-card glass-panel animate-on-scroll">
              <div className="feature-icon">🏏</div>
              <h3 className="feature-title">Cricket</h3>
              <p className="feature-desc">
                Perfect your batting stance, bowling action, and fielding techniques with our AI-driven video analysis.
              </p>
            </div>
            
            <div className="feature-card glass-panel animate-on-scroll delay-1">
              <div className="feature-icon">🏸</div>
              <h3 className="feature-title">Badminton</h3>
              <p className="feature-desc">
                Analyze your footwork, smash mechanics, and court coverage to dominate the game.
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="home-footer glass-panel">
        <div className="footer-content">
          <div className="footer-brand">
            <img src={logo} alt="Logo" className="footer-logo" />
            <p>© {new Date().getFullYear()} Sports Talent Platform.<br/>All rights reserved.</p>
          </div>
          <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
