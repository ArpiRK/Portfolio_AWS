import './About.css'

function About() {
  return (
    <section className="about" id="about">
      <div className="section-label">Nice to meet you</div>
      <h2 className="section-title">Hi, I'm Arpitha.</h2>

      <p className="about-text">
        I'm a Senior .NET Engineer with 9+ years building enterprise systems
        across financial services, and hands-on experience with modern cloud-native
        development on both Azure and AWS.
      </p>
      <p className="about-text">
        I've led engineering teams at Accenture serving Fortune 100 clients,
        delivered systems handling 30K+ monthly transactions at sub-200ms latency,
        and currently modernizing legacy .NET systems to cloud-native architecture
        using AWS, React, Docker, and Kubernetes.
        I hold an M.S. in Computer Science from Illinois Institute of Technology.
      </p>

      <div className="about-pillars">
        <div className="pillar">
          <div className="pillar-icon">⚡</div>
          <div className="pillar-title">Backend Engineering</div>
          <p className="pillar-text">
            C#, .NET Core, ASP.NET, Entity Framework — building APIs and services
            that power enterprise financial platforms.
          </p>
        </div>
        <div className="pillar">
          <div className="pillar-icon">🔐</div>
          <div className="pillar-title">Identity & Auth</div>
          <p className="pillar-text">
            OAuth 2.0, OIDC, SAML 2.0, Azure AD SSO — securing enterprise
            platforms with modern authentication patterns.
          </p>
        </div>
        <div className="pillar">
          <div className="pillar-icon">☁️</div>
          <div className="pillar-title">Cloud & DevOps</div>
          <p className="pillar-text">
            Azure and AWS, Docker, Kubernetes, Terraform, CI/CD — deploying
            and operating systems at scale across cloud platforms.
          </p>
        </div>
      </div>
    </section>
  )
}

export default About
