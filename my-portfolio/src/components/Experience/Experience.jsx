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
            {/* Previous: <div className="timeline-period">Nov 2024 – Present</div> */}
            <div className="timeline-period">Nov 2024 – Jul 2026</div>
          </div>
          <div className="timeline-company">Azbor Tech · Chicago, IL</div>
          {/* Previous bullets — commented out, not deleted:
          <ul className="timeline-bullets">
            <li>Modernizing 3 legacy .NET Framework apps to .NET 8 — clean architecture, CQRS, async/await, and EF Core repository pattern</li>
            <li>Built and deployed React + Vite frontend on AWS S3 with CloudFront CDN and GitHub Actions CI/CD pipeline for zero-touch deployments</li>
            <li>Designed serverless API layer using AWS Lambda and API Gateway — secrets managed via AWS Systems Manager Parameter Store</li>
            <li>Containerized .NET microservices with Docker and orchestrated with Kubernetes for consistent deployments across environments</li>
            <li>Implemented OAuth 2.0/OIDC with Azure AD across migrated services, replacing legacy authentication flows</li>
            <li>Integrated Claude API into production agentic chatbot — visitor intent detection, DynamoDB session memory, real-time Calendly scheduling, and resume delivery via SendGrid Lambda orchestration</li>
          </ul>
          */}
          <ul className="timeline-bullets">
            <li>Modernized 3 legacy .NET Framework applications to .NET 8 using clean architecture with CQRS (MediatR), async/await throughout, and EF Core repository pattern replacing manual ADO.NET queries</li>
            <li>Built and deployed React + Vite frontend on AWS S3 with CloudFront CDN and GitHub Actions CI/CD pipeline for zero-touch deployments</li>
            <li>Implemented OAuth 2.0/OIDC authentication with Azure AD across all migrated services, replacing legacy username/password flows with SSO</li>
            <li>Validated modernized services through unit and integration tests using xUnit and Moq — enforced test coverage gates in CI/CD pipeline via GitHub Actions</li>
            <li>Executed phased, zero-downtime migration by running legacy and modernized services in parallel behind Azure API Management, routing traffic module-by-module as each was validated — enabling instant rollback to legacy on regression</li>
          </ul>
          <div className="timeline-tags">
            {/* Previous tags — commented out, not deleted:
            {['.NET 8', 'C#', 'React', 'AWS', 'Lambda', 'Docker', 'Kubernetes', 'OAuth 2.0', 'CQRS', 'GitHub Actions'].map(t => (
              <span className="timeline-tag" key={t}>{t}</span>
            ))}
            */}
            {['.NET 8', 'C#', 'React', 'AWS', 'OAuth 2.0', 'CQRS', 'GitHub Actions'].map(t => (
              <span className="timeline-tag" key={t}>{t}</span>
            ))}
          </div>
        </div>

        <div className="timeline-item">
          <div className="timeline-header">
            <div className="timeline-role">Software Engineer → Team Lead</div>
            {/* Previous: <div className="timeline-period">2014 – 2023</div> */}
            <div className="timeline-period">Jan 2014 – Aug 2023</div>
          </div>
          <div className="timeline-company">Accenture Solutions</div>

          {/* Previous sub-role breakdown (Team Lead / Senior SE / SE) — commented out, not deleted.
              Merged into one flat role per request — full role-by-role detail lives in the resume, not the portfolio.
          <div className="sub-role">
            <div className="sub-role-title">Team Lead</div>
            <div className="sub-role-period">Jan 2021 – Aug 2023</div>
            <ul className="timeline-bullets">
              <li>Built and mentored a 6-engineer team executing distributed financial automation; implemented RESTful API layer for SAP/BlackLine integration using ASP.NET Core Web API handling 10K+ requests/hour</li>
              <li>Reduced financial report generation time by 60% through SQL query optimization and caching</li>
              <li>Implemented Azure AD SSO with OAuth 2.0 and OIDC — replaced legacy auth across enterprise tool suite</li>
              <li>Maintained 99.9% uptime with zero P1 incidents using Application Insights monitoring</li>
            </ul>
          </div>

          <div className="sub-role">
            <div className="sub-role-title">Senior Software Engineer</div>
            <div className="sub-role-period">Jan 2019 – Dec 2020</div>
            <ul className="timeline-bullets">
              <li>Automated month-end journal processing — eliminated 200+ hours/month of manual work</li>
              <li>Implemented SAML 2.0 SSO for enterprise client portals</li>
              <li>Migrated on-prem .NET apps to Azure App Service with zero downtime</li>
            </ul>
          </div>

          <div className="sub-role">
            <div className="sub-role-title">Software Engineer</div>
            <div className="sub-role-period">Jan 2014 – Dec 2018</div>
            <ul className="timeline-bullets">
              <li>Built BlackLine automation processing 30K+ journal entries monthly</li>
              <li>SQL Server query optimization achieving 30–70% improvement in report generation</li>
              <li>Designed data archival pipeline for 5+ years of historical financial records</li>
            </ul>
          </div>
          */}
          <ul className="timeline-bullets">
            <li>Built and mentored a 6-engineer team executing distributed financial automation; implemented RESTful API layer for SAP/BlackLine integration using ASP.NET Core Web API handling 10K+ requests/hour</li>
            <li>Architected real-time financial reporting dashboards backed by optimized SQL Server stored procedures — reduced report generation time by 60% for 5,000+ users, with additional query tuning achieving 30–70% gains</li>
            <li>Developed end-to-end BlackLine journal automation using ASP.NET Core and SSIS pipelines, processing 30K+ entries monthly and eliminating 200+ hours of manual reconciliation</li>
            {/* Previous: <li>Implemented Azure AD SSO with OAuth 2.0, OIDC, and SAML 2.0 across enterprise client portals and tool suites, replacing legacy username/password flows</li> */}
            <li>Implemented Azure AD SSO with SAML 2.0 across enterprise client portals and tool suites, replacing legacy username/password flows</li>
            <li>Extended a .NET Framework financial close platform with modules for invoice matching, GL reconciliation, and journal approvals across 3 business units — maintained 99.9% uptime with zero P1 incidents via Application Insights monitoring</li>
          </ul>

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
