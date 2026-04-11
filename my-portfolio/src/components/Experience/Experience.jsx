import './Experience.css'

function Experience() {
  return (
    <section className="experience" id="experience">
      <div className="section-label">Career Journey</div>
      <h2 className="section-title">Where I've Worked</h2>

      <div className="timeline">

        <div className="timeline-item">
          <div className="timeline-header">
            <div className="timeline-role">Senior Software Engineer (.NET)</div>
            <div className="timeline-period">Nov 2024 – Present</div>
          </div>
          <div className="timeline-company">Azbor Tech · Chicago, IL</div>
          <ul className="timeline-bullets">
            <li>Modernizing 3 legacy .NET Framework apps to .NET 8 — clean architecture, CQRS, async/await, and EF Core repository pattern</li>
            <li>Built and deployed React + Vite frontend on AWS S3 with CloudFront CDN and GitHub Actions CI/CD pipeline for zero-touch deployments</li>
            <li>Designed serverless API layer using AWS Lambda and API Gateway — secrets managed via AWS Systems Manager Parameter Store</li>
            <li>Containerized .NET microservices with Docker and orchestrated with Kubernetes for consistent deployments across environments</li>
            <li>Implemented OAuth 2.0/OIDC with Azure AD across migrated services, replacing legacy authentication flows</li>
            <li>Integrated Claude API into production agentic chatbot — visitor intent detection, DynamoDB session memory, real-time Calendly scheduling, and resume delivery via SendGrid Lambda orchestration</li>
          </ul>
          <div className="timeline-tags">
            {['.NET 8', 'C#', 'React', 'AWS', 'Lambda', 'Docker', 'Kubernetes', 'OAuth 2.0', 'CQRS', 'GitHub Actions'].map(t => (
              <span className="timeline-tag" key={t}>{t}</span>
            ))}
          </div>
        </div>

        <div className="timeline-item">
          <div className="timeline-header">
            <div className="timeline-role">Software Engineer → Team Lead</div>
            <div className="timeline-period">2014 – 2023</div>
          </div>
          <div className="timeline-company">Accenture Solutions</div>

          <div className="sub-role">
            <div className="sub-role-title">Team Lead</div>
            <div className="sub-role-period">2021 – 2023</div>
            <ul className="timeline-bullets">
              <li>Led 6-engineer team building financial platforms for Fortune 100 clients — 5,000+ users, 30K+ monthly transactions</li>
              <li>Built SAP-BlackLine API integration handling 10K+ requests/hour at sub-200ms latency</li>
              <li>Reduced financial report generation time by 60% through SQL query optimization and caching</li>
              <li>Implemented Azure AD SSO with OAuth 2.0 and OIDC — replaced legacy auth across enterprise tool suite</li>
              <li>Maintained 99.9% uptime with zero P1 incidents using Application Insights monitoring</li>
            </ul>
          </div>

          <div className="sub-role">
            <div className="sub-role-title">Senior Software Engineer</div>
            <div className="sub-role-period">2018 – 2021</div>
            <ul className="timeline-bullets">
              <li>Automated month-end journal processing — eliminated 200+ hours/month of manual work</li>
              <li>Built ETL pipeline consolidating data from 5+ source systems into unified reporting view</li>
              <li>Implemented SAML 2.0 SSO for enterprise client portals</li>
              <li>Migrated on-prem .NET apps to Azure App Service with zero downtime</li>
            </ul>
          </div>

          <div className="sub-role">
            <div className="sub-role-title">Software Engineer</div>
            <div className="sub-role-period">2014 – 2018</div>
            <ul className="timeline-bullets">
              <li>Built BlackLine automation processing 30K+ journal entries monthly</li>
              <li>SQL Server query optimization achieving 30–70% improvement in report generation</li>
              <li>Designed data archival pipeline for 5+ years of historical financial records</li>
            </ul>
          </div>

          <div className="timeline-tags" style={{marginTop: '1rem'}}>
            {['C#', 'ASP.NET Core', 'SQL Server', 'SSIS', 'BizTalk', 'Azure AD', 'OAuth 2.0', 'SAML 2.0', 'Application Insights', 'SAP', 'BlackLine'].map(t => (
              <span className="timeline-tag" key={t}>{t}</span>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}

export default Experience
