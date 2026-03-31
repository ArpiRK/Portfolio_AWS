import './Skills.css'

const skillGroups = [
  {
    title: '.NET & Backend',
    skills: ['C#', '.NET 8', 'ASP.NET Core', 'Entity Framework Core', 'Web API', 'WCF', 'REST APIs', 'Microservices', 'SOLID', 'Clean Architecture']
  },
  {
    title: 'Identity & Auth',
    skills: ['OAuth 2.0', 'OIDC', 'SAML 2.0', 'Azure AD', 'SSO', 'JWT', 'ASP.NET Core Identity', 'RBAC']
  },
  {
    title: 'Cloud & DevOps',
    skills: ['Microsoft Azure', 'App Services', 'Docker', 'Kubernetes', 'Terraform', 'GitHub Actions', 'Azure DevOps', 'CI/CD', 'Application Insights']
  },
  {
    title: 'Data & Integration',
    skills: ['SQL Server', 'T-SQL', 'SSIS', 'ETL Pipelines', 'Stored Procedures', 'SAP', 'BlackLine', 'Service Bus']
  },
  {
    title: 'AI & Emerging',
    skills: ['Claude API', 'OpenAI GPT-4', 'LlamaIndex', 'MCP', 'ChromaDB', 'Prompt Engineering', 'LLM Integration']
  },
  {
    title: 'Tools & Practices',
    skills: ['Git', 'Visual Studio', 'Postman', 'Agile/Scrum', 'Code Reviews', 'Azure Key Vault', 'IIS']
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