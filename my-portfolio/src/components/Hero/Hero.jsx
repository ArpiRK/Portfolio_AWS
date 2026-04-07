import './Hero.css'

function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="hero-inner">
        <div className="hero-content">
          <div className="hero-badge">
            <span></span>
            Open to new opportunities
          </div>
          <h1 className="hero-title">
            Senior .NET Engineer<br />
            building systems that<br />
            <span className="accent">actually scale.</span>
          </h1>
          <p className="hero-subtitle">
            9+ years building enterprise financial platforms. Modernizing
            legacy .NET systems to cloud-native architecture on Azure and AWS.
            Now integrating AI/LLM capabilities into production systems.
            Based in Chicago, IL.
          </p>
          <div className="hero-buttons">
            <a href="#contact" className="btn-primary">Get in Touch</a>
            <a href="#experience" className="btn-secondary">View My Work</a>
            <a href="https://www.linkedin.com/in/arpitha-ramakrishnaiah/" target="_blank" rel="noreferrer" className="btn-secondary">LinkedIn</a>
            <a href="https://github.com/ArpiRK" target="_blank" rel="noreferrer" className="btn-secondary">GitHub</a>
          </div>
          <div className="hero-stats">
            <div>
              <div className="stat-number">9+</div>
              <div className="stat-label">Years Experience</div>
            </div>
            <div>
              <div className="stat-number">Fortune</div>
              <div className="stat-label">100 Clients Served</div>
            </div>
            <div>
              <div className="stat-number">99.9%</div>
              <div className="stat-label">Uptime Delivered</div>
            </div>
            <div>
              <div className="stat-number">0</div>
              <div className="stat-label">P1 Incidents</div>
            </div>
          </div>
        </div>
        <div className="hero-photo">
          <div className="hero-photo-ring">
            <img src="/images/profile.png" alt="Arpitha Ramakrishnaiah" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
