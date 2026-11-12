import './About.css'

function About() {
  return (
    <section className="about" id="about">
      <div className="section-label">Nice to meet you</div>
      <h2 className="section-title">Hi, I'm Arpitha.</h2>

      {/* Previous copy — commented out, not deleted:
      <p className="about-text">
        I'm a Senior .NET Engineer with 9+ years building enterprise systems
        across financial services, and hands-on experience with modern cloud-native
        development on both Azure and AWS.
      </p>
      */}
      {/* Previous copy — commented out, not deleted:
      <p className="about-text">
        I'm a .NET Engineer with 9+ years building enterprise systems
        across financial services, and hands-on experience with modern cloud-native
        development on both Azure and AWS. I've led engineering teams at Accenture
        serving Fortune 100 clients, delivered systems processing 30K+ monthly
        transactions, and modernized legacy .NET Framework applications to .NET 8
        with clean architecture and Azure AD authentication. I also build AI-powered
        applications integrating LLMs (Claude API, GPT-4, Llama-3) and RAG pipelines
        into production cloud systems. I hold an M.S. in Computer Science from
        Illinois Institute of Technology.
      </p>
      */}
      <p className="about-text">
        I'm a software engineer with 9+ years of experience building enterprise systems.
      </p>
      <p className="about-text">
        At Accenture, I grew from production support to leading a team of 6 engineers,
        building finance automation for Fortune 100 clients. Our systems handled 10K+ API
        requests per hour, automated 30K+ journal entries a month, and made reports 60%
        faster for 5,000+ users. I worked across C#, .NET Framework, SQL Server, SSIS, and
        BizTalk, integrating systems like SAP and BlackLine.
        {/* Removed until a .NET Core project card is added: I've also built projects on modern .NET (ASP.NET Core / .NET 8). */}
      </p>
      <p className="about-text">
        Today I build AI-powered apps — the chatbot on this site runs on the Claude API,
        AWS Lambda, and DynamoDB. I also work hands-on with MCP, LlamaIndex, and RAG
        pipelines. I hold an M.S. in Computer Science from Illinois Institute of Technology.
      </p>
      {/* Previous copy — commented out, not deleted:
      <p className="about-text">
        I've led engineering teams at Accenture serving Fortune 100 clients,
        delivered systems handling 30K+ monthly transactions at sub-200ms latency,
        and currently modernizing legacy .NET systems to cloud-native architecture
        using AWS, React, Docker, and Kubernetes.
        I also build AI-powered applications integrating LLMs (Claude API, GPT-4,
        Llama-3) and RAG pipelines into production cloud systems.
        I hold an M.S. in Computer Science from Illinois Institute of Technology.
      </p>
      */}
      {/* Previous copy — commented out, not deleted:
      <p className="about-text">
        I've led engineering teams at Accenture serving Fortune 100 clients,
        delivered systems processing 30K+ monthly transactions, and currently
        modernizing legacy .NET systems to cloud-native architecture using AWS and React.
        I also build AI-powered applications integrating LLMs (Claude API, GPT-4,
        Llama-3) and RAG pipelines into production cloud systems.
        I hold an M.S. in Computer Science from Illinois Institute of Technology.
      </p>
      */}

      <div className="about-pillars">
        <div className="pillar">
          <div className="pillar-icon">⚡</div>
          <div className="pillar-title">Backend Engineering</div>
          {/* Previous copy — commented out, not deleted:
          <p className="pillar-text">
            C#, .NET Core, ASP.NET, Entity Framework — building APIs and services
            that power enterprise financial platforms.
          </p>
          */}
          <p className="pillar-text">
            C#, .NET Framework, ASP.NET Core, and SQL Server — building APIs and
            services that power enterprise financial platforms.
          </p>
        </div>
        {/* Previous card — commented out, not deleted:
        <div className="pillar">
          <div className="pillar-icon">🔐</div>
          <div className="pillar-title">Identity & Auth</div>
          <p className="pillar-text">
            OAuth 2.0, OIDC, SAML 2.0, Azure AD SSO — securing enterprise
            platforms with modern authentication patterns.
          </p>
        </div>
        */}
        <div className="pillar">
          <div className="pillar-icon">🔗</div>
          <div className="pillar-title">Integration & Data</div>
          <p className="pillar-text">
            BizTalk, SSIS, ETL pipelines, and REST APIs — connecting enterprise
            systems like SAP and BlackLine.
          </p>
        </div>
        <div className="pillar">
          <div className="pillar-icon">☁️</div>
          {/* Previous: <div className="pillar-title">Cloud & DevOps</div> */}
          <div className="pillar-title">Cloud & Identity</div>
          {/* Previous copy — commented out, not deleted:
          <p className="pillar-text">
            Azure and AWS, Docker, Kubernetes, Terraform, CI/CD — deploying
            and operating systems at scale across cloud platforms.
          </p>
          */}
          {/* Previous copy — commented out, not deleted:
          <p className="pillar-text">
            Azure and AWS, Terraform, CI/CD — deploying
            and operating systems at scale across cloud platforms.
          </p>
          */}
          <p className="pillar-text">
            AWS serverless, Azure, OAuth 2.0, OIDC, SAML, and Azure AD — secure,
            cloud-hosted applications.
          </p>
        </div>
        <div className="pillar">
          <div className="pillar-icon">🤖</div>
          {/* Previous: <div className="pillar-title">AI & LLM Integration</div> */}
          <div className="pillar-title">AI & LLM Apps</div>
          {/* Previous copy — commented out, not deleted:
          <p className="pillar-text">
            Claude API, GPT-4, LlamaIndex, ChromaDB, RAG pipelines — building
            AI-powered features into production applications.
          </p>
          */}
          <p className="pillar-text">
            Claude API, GPT-4, LlamaIndex, MCP, and RAG — building AI features
            into real applications.
          </p>
        </div>
      </div>
    </section>
  )
}

export default About
