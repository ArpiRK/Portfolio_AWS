import './Skills.css'

const skillGroups = [
  {
    // Previous title — commented out, not deleted:
    // title: '.NET & Backend',
    title: 'Backend',
    // Previous list — commented out, not deleted:
    // skills: ['C#', '.NET 8', 'ASP.NET Core', 'Entity Framework Core', 'Web API', 'REST APIs', 'Microservices', 'SOLID', 'Clean Architecture']
    // skills: ['C#', '.NET 8', 'ASP.NET Core', 'Entity Framework Core', 'Web API', 'REST APIs', 'SOLID', 'Clean Architecture']
    // skills: ['C#', '.NET Framework', 'ASP.NET Core', '.NET 8', 'Web API', 'Entity Framework / EF Core', 'LINQ', 'WCF', 'REST APIs', 'SOLID']
    skills: ['C#', '.NET Framework', 'ASP.NET Core', 'Web API', 'Entity Framework / EF Core', 'LINQ', 'WCF', 'REST APIs', 'SOLID']
  },
  {
    title: 'Identity & Auth',
    // Previous list — commented out, not deleted:
    // skills: ['OAuth 2.0', 'OIDC', 'SAML 2.0', 'Azure AD', 'SSO', 'JWT', 'ASP.NET Core Identity', 'RBAC']
    skills: ['OAuth 2.0', 'OIDC', 'SAML 2.0', 'Azure AD', 'SSO', 'JWT']
  },
  {
    title: 'Cloud & DevOps',
    // Previous list — commented out, not deleted:
    // skills: ['Azure', 'AWS S3', 'CloudFront', 'Lambda', 'API Gateway', 'Docker', 'Kubernetes', 'Terraform', 'GitHub Actions', 'CI/CD', 'Application Insights']
    // skills: ['Azure', 'AWS S3', 'CloudFront', 'Lambda', 'API Gateway', 'Terraform', 'GitHub Actions', 'CI/CD', 'Application Insights']
    skills: ['Azure', 'AWS S3', 'CloudFront', 'Lambda', 'API Gateway', 'DynamoDB', 'Amazon SES', 'GitHub Actions', 'CI/CD', 'Application Insights']
  },
  {
    title: 'Data & Integration',
    // Previous list — commented out, not deleted:
    // skills: ['SQL Server', 'T-SQL', 'SSIS', 'ETL Pipelines', 'SAP', 'BlackLine', 'Service Bus']
    // skills: ['SQL Server', 'T-SQL', 'SSIS', 'BizTalk', 'ETL Pipelines', 'SAP', 'BlackLine', 'Service Bus']
    skills: ['SQL Server', 'T-SQL', 'SSIS', 'BizTalk', 'ETL Pipelines', 'SAP', 'BlackLine']
  },
  {
    title: 'AI & Emerging',
    skills: ['Claude API', 'OpenAI GPT-4', 'LlamaIndex', 'MCP', 'ChromaDB', 'LLM Integration']
  },
  {
    title: 'Tools & Practices',
    // Previous list — commented out, not deleted:
    // skills: ['Git', 'Visual Studio', 'Postman', 'Agile/Scrum', 'Azure Key Vault', 'IIS']
    skills: ['Git', 'Visual Studio', 'Postman', 'Agile/Scrum', 'IIS']
  }
]

function Skills() {
  return (
    <section className="skills" id="skills">
      <div className="skills-inner">
        <div className="section-label">My Toolkit</div>
        <h2 className="section-title">Technologies I Work With</h2>
        <div className="skills-grid">
          {skillGroups.map((group) => (
            <div className="skill-group" key={group.title}>
              <div className="skill-group-title">{group.title}</div>
              <div className="skill-tags">
                {group.skills.map((skill) => (
                  <span className="skill-tag" key={skill}>{skill}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Skills
