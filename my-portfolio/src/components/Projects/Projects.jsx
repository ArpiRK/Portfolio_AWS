import './Projects.css'

const projects = [
  {
    title: 'MCP Agentic Analytics Platform',
    desc: 'Agentic analytics platform where a LlamaIndex agent answers natural-language business questions via MCP tool servers and generates charts on the fly.',
    tags: ['Python', 'MCP', 'LlamaIndex', 'PostgreSQL', 'Vector DB', 'Streamlit'],
    link: 'https://github.com/ArpiRK/MCP-Enabled-analytics-platform'
  },
  {
    title: 'GuardianAI',
    desc: 'Insurance platform with dual AI assistants for customer support and policy recommendations. Built with GPT-4 and Llama-3 with context-aware responses.',
    tags: ['GPT-4', 'Llama-3', 'React', 'Node.js', 'Python'],
    link: 'https://github.com/ArpiRK/GuardianAI'
  },
  {
    title: 'LLM Analytics Dashboard',
    desc: 'Natural language BI tool that lets business users query financial data in plain English. Translates questions into SQL and returns visual insights.',
    tags: ['Python', 'LlamaIndex', 'GPT-4', 'ChromaDB', 'PostgreSQL'],
    link: 'https://github.com/ArpiRK/GITHub-dashboard'
  },
  {
    title: 'ASP.NET Core Portfolio',
    desc: 'Full-stack portfolio built with ASP.NET Core MVC, hosted on Azure App Service. Features AI chatbot, resume delivery via SendGrid, and Application Insights monitoring.',
    tags: ['ASP.NET Core', 'C#', 'Azure', 'SendGrid', 'Application Insights', 'Terraform'],
    link: 'https://github.com/ArpiRK/Portfolio'
  },
  {
    title: 'SmartPortables Retail UI',
    desc: 'E-commerce retail frontend for a consumer electronics brand. Product catalog, cart, and checkout flow built with React.',
    tags: ['React', 'Node.js', 'CSS'],
    link: 'https://github.com/ArpiRK/Retail-UI'
  }
]

function Projects() {
  return (
    <section className="projects" id="projects">
      <div className="projects-inner">
        <div className="section-label">Featured Work</div>
        <h2 className="section-title">Projects</h2>
        <div className="projects-grid">
          {projects.map((project) => (
            <div className="project-card" key={project.title}>
              <div className="project-label">Project</div>
              <div className="project-title">{project.title}</div>
              <p className="project-desc">{project.desc}</p>
              <div className="project-tags">
                {project.tags.map((t) => (
                  <span className="project-tag" key={t}>{t}</span>
                ))}
              </div>
              <a href={project.link} target="_blank" rel="noreferrer" className="project-link">
                View on GitHub
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Projects
