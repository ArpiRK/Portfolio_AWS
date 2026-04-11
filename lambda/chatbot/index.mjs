import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";

const ssmClient = new SSMClient({ region: "us-east-1" });
const dynamoClient = new DynamoDBClient({ region: "us-east-1" });
const docClient = DynamoDBDocumentClient.from(dynamoClient);

async function getApiKey() {
  const command = new GetParameterCommand({
    Name: "/portfolio/Claude_API_Key",
    WithDecryption: true
  });
  const response = await ssmClient.send(command);
  return response.Parameter.Value;
}

async function getCalendlyToken() {
  const command = new GetParameterCommand({
    Name: "/portfolio/calendly",
    WithDecryption: true
  });
  const response = await ssmClient.send(command);
  return response.Parameter.Value;
}

async function getAvailableSlots(dateStr) {
  try {
    const token = await getCalendlyToken();
    const startTime = new Date(`${dateStr}T00:00:00-06:00`).toISOString();
    const endTime = new Date(`${dateStr}T23:59:59-06:00`).toISOString();
    const url = `https://api.calendly.com/event_type_available_times?event_type=https://api.calendly.com/event_types/1cec73fd-b676-4838-ad85-eda7cdb084b6&start_time=${startTime}&end_time=${endTime}`;
    console.log('Fetching Calendly slots:', url);
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    console.log('Calendly response:', JSON.stringify(data));
    if (!data.collection) return [];
    return data.collection.map(slot => {
      const date = new Date(slot.start_time);
      const time = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        timeZone: 'America/Chicago',
        hour12: true
      });
      return { time, url: slot.scheduling_url };
    });
  } catch (error) {
    console.error('Calendly error:', error);
    return [];
  }
}

function parseDateFromMessage(message) {
  const today = new Date();
  const msg = message.toLowerCase();
  const days = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
  const months = ['january','february','march','april','may','june','july','august','september','october','november','december'];

  for (let i = 0; i < months.length; i++) {
    if (msg.includes(months[i])) {
      // Match day number that appears right after month name, ignore time numbers
      const afterMonth = msg.split(months[i])[1];
      const dayMatch = afterMonth?.match(/\b(\d{1,2})(st|nd|rd|th)?\b/);
      if (dayMatch) {
        const year = today.getFullYear();
        const month = String(i + 1).padStart(2, '0');
        const day = String(parseInt(dayMatch[1])).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
    }
  }

  if (msg.includes('tomorrow')) {
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }

  if (msg.includes('today')) {
    return today.toISOString().split('T')[0];
  }

  for (let i = 0; i < months.length; i++) {
    if (msg.includes(months[i])) {
      const dayMatch = msg.match(/\b(\d{1,2})\b/);
      if (dayMatch) {
        const year = today.getFullYear();
        const month = String(i + 1).padStart(2, '0');
        const day = String(dayMatch[1]).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
    }
  }

  return null;
}

async function getSession(sessionId) {
  try {
    const result = await docClient.send(new GetCommand({
      TableName: "portfolio-sessions",
      Key: { sessionId }
    }));
    return result.Item || {
      sessionId,
      visitorType: "unknown",
      extractedRole: null,
      extractedSkills: [],
      resumeSent: false,
      projectsShown: [],
      turnCount: 0,
      awaitingResumeEmail: false,
      calendlyOffered: false
    };
  } catch {
    return {
      sessionId,
      visitorType: "unknown",
      extractedRole: null,
      extractedSkills: [],
      resumeSent: false,
      projectsShown: [],
      turnCount: 0,
      awaitingResumeEmail: false,
      calendlyOffered: false
    };
  }
}

async function saveSession(session) {
  await docClient.send(new PutCommand({
    TableName: "portfolio-sessions",
    Item: {
      ...session,
      ttl: Math.floor(Date.now() / 1000) + (60 * 60 * 2)
    }
  }));
}

function detectVisitorType(message, currentType) {
  if (currentType !== "unknown") return currentType;
  const msg = message.toLowerCase();
  if (msg.match(/hiring|recruiter|position|opening|role|jd|job description|team|candidate|sponsorship|looking for/))
    return "recruiter";
  if (msg.match(/interview|behavioral|tell me about|how would you|describe a time|weakness|strength/))
    return "interviewer";
  if (msg.match(/architecture|how did you|technical|code|implement|design|pattern|stack|how does|explain/))
    return "technical";
  return "unknown";
}

function extractSkills(message) {
  const skillKeywords = [
    ".net", "c#", "asp.net", "azure", "aws", "sql", "react", "docker",
    "kubernetes", "microservices", "api", "rest", "oauth", "entity framework",
    "python", "typescript", "javascript", "llm", "ai", "cloud", "devops",
    "terraform", "github actions", "postgresql", "redis", "kafka", "rabbitmq"
  ];
  const msg = message.toLowerCase();
  return skillKeywords.filter(skill => msg.includes(skill));
}

const ARPITHA_SKILLS = [
  ".net", "c#", "asp.net core", "entity framework core", "web api", "linq",
  "minimal apis", "react", "vite", "javascript", "html", "css",
  "oauth 2.0", "oidc", "saml 2.0", "azure ad", "jwt", "sso",
  "azure", "aws", "docker", "kubernetes", "terraform", "github actions",
  "sql server", "postgresql", "ssis", "etl", "t-sql",
  "claude api", "gpt-4", "llamaindex", "chromadb", "rag", "prompt engineering",
  "microservices", "cqrs", "clean architecture", "agile", "scrum"
];

const PROJECTS = [
  {
    name: "AWS Portfolio Site",
    skills: ["aws", "lambda", "react", "claude api", "api gateway", "s3", "cloudfront", "github actions", "ai"],
    description: "Production portfolio with AI chatbot (Claude API), serverless Lambda backend, CI/CD via GitHub Actions"
  },
  {
    name: "MCP Agentic Analytics Platform",
    skills: ["llamaindex", "mcp", "python", "postgresql", "ai", "llm", "agents", "rag"],
    description: "Agentic analytics platform where LlamaIndex agent answers natural language business questions via MCP tool servers"
  },
  {
    name: "GuardianAI",
    skills: ["gpt-4", "llama-3", "react", "node.js", "ai", "llm", "python"],
    description: "Insurance platform with dual-model AI architecture — GPT-4 for support, Llama-3 for policy recommendations"
  },
  {
    name: "LLM Analytics Dashboard",
    skills: ["llamaindex", "chromadb", "postgresql", "python", "rag", "ai", "llm", "sql"],
    description: "Natural language BI tool — translates plain English to SQL via LlamaIndex with auto-generated charts"
  }
];

function matchJobFit(extractedSkills) {
  if (!extractedSkills || extractedSkills.length === 0) return null;
  const matched = extractedSkills.filter(skill =>
    ARPITHA_SKILLS.some(s => s.includes(skill) || skill.includes(s))
  );
  const score = Math.round((matched.length / extractedSkills.length) * 100);
  return { score, matched, missing: extractedSkills.filter(s => !matched.includes(s)) };
}

function recommendProjects(extractedSkills) {
  if (!extractedSkills || extractedSkills.length === 0) return PROJECTS.slice(0, 2);
  return PROJECTS
    .map(p => ({
      ...p,
      relevance: extractedSkills.filter(s =>
        p.skills.some(ps => ps.includes(s) || s.includes(ps))
      ).length
    }))
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 2);
}

async function sendResumeEmail(email) {
  try {
    const url = 'https://qc29nqhkgl.execute-api.us-east-1.amazonaws.com/sendResume';
    console.log('Calling sendResume:', url, 'for email:', email);
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const text = await response.text();
    console.log('sendResume raw response:', response.status, text);
    const data = JSON.parse(text);
    return data.success;
  } catch (error) {
    console.error('sendResumeEmail error:', error.message);
    return false;
  }
}

function buildSystemPrompt(session, fitResult, recommendedProjects) {
  const visitorContext = session.visitorType !== "unknown"
    ? `CURRENT VISITOR TYPE: ${session.visitorType.toUpperCase()} — adapt all responses for this visitor.`
    : `VISITOR TYPE: Unknown — identify intent from the conversation.`;

  const fitContext = fitResult
    ? `\nJOB FIT DATA (use in your response):
Score: ${fitResult.score}%
Matched: ${fitResult.matched.join(", ")}
Missing: ${fitResult.missing.join(", ") || "none"}`
    : "";

  const projectContext = recommendedProjects?.length > 0
    ? `\nRELEVANT PROJECTS FOR THIS VISITOR:
${recommendedProjects.map(p => `- ${p.name}: ${p.description}`).join("\n")}`
    : "";

  const sessionContext = session.extractedRole
    ? `\nSESSION CONTEXT:
Role: ${session.extractedRole}
Skills mentioned: ${session.extractedSkills?.join(", ") || "none"}
Resume sent: ${session.resumeSent ? "yes" : "no"}
Turn: ${session.turnCount}`
    : "";

  return `You are an intelligent agentic portfolio assistant for Arpitha Ramakrishnaiah, a Senior .NET Engineer with 9+ years of experience.

${visitorContext}
${sessionContext}
${fitContext}
${projectContext}

VISITOR TYPES AND BEHAVIOR:

RECRUITER / HIRING MANAGER:
- On FIRST recruiter message, ALWAYS ask sponsorship before anything else:
  "Quick note before we dive in — Arpitha is currently on OPT and authorized to work in the US. She will need H-1B sponsorship in the future but not immediately. Does your company support H-1B sponsorship? Happy to proceed either way — just want to be transparent upfront."
- If NO → "Understood — appreciate the honesty. That may be a challenge down the road. Feel free to explore her background anyway if you'd like."
- If YES → proceed with full fit analysis
- If UNSURE → "No worries — worth checking with your HR team. In the meantime, let me show you why Arpitha could be a strong fit."
- Never dump a full skills list unprompted
- Wait for JD or role details before doing analysis
- For fit analysis use bullet format ONLY — no tables:
  ✅ [Skill] — [Arpitha's evidence]
  ⚠️ [Skill] — [gap or partial match]
  ❌ [Skill] — [missing]

TECHNICAL REVIEWER / ENGINEER:
- Go deep on technical topics
- Explain architecture decisions and trade-offs
- Reference specific implementation details
- Show depth — not just what was built but why

INTERVIEWER:
- Answer as Arpitha would in a real interview
- Use STAR format (Situation, Task, Action, Result)
- Be specific with metrics: 60% faster reports, 10K+ req/hour, 30K+ entries/month

EXPLORER / UNKNOWN:
- Ask ONE routing question to identify intent
- Adapt immediately once intent is clear

FORMATTING RULES:
- NEVER use markdown tables — they render poorly in chat
- Use bullet points and numbered lists only
- Bold key terms using **bold**
- Keep responses scannable
- End every response with ONE clear next step

ROLE FIT RULES:
- Arpitha is a Senior .NET Backend Engineer
- Pure DevOps, infrastructure-only, QA automation, SAP, Java-primary roles are NOT a good fit
- Be honest about fit — don't force positive spin on mismatched roles

ABOUT ARPITHA:
- Senior .NET Engineer, 9+ years, Fortune 100 financial systems
- C#, .NET 8, ASP.NET Core, Entity Framework Core, Web API, LINQ, Minimal APIs
- Azure: App Service, Azure AD, Application Insights, DevOps, Key Vault, Service Bus
- AWS: S3, CloudFront, Lambda, API Gateway, Systems Manager
- Auth: OAuth 2.0, OIDC, SAML 2.0, Azure AD, JWT, SSO
- Frontend: React, Vite, JavaScript
- Data: SQL Server, PostgreSQL, SSIS, ETL, T-SQL, Query Optimization
- AI/LLM: Claude API, GPT-4, LlamaIndex, ChromaDB, RAG pipelines, Prompt Engineering, MCP
- DevOps: Docker, Kubernetes, Terraform, GitHub Actions, CI/CD
- Architecture: CQRS, Clean Architecture, Microservices
- M.S. Computer Science, Illinois Institute of Technology (Dec 2025)
- Chicago, IL — open to relocation
- Currently on OPT, will need H-1B sponsorship in the future

EXPERIENCE:
- Azbor Tech (Nov 2024–Present): .NET modernization, CQRS, EF Core, AWS Lambda, React, AI chatbot
- Accenture Team Lead (Jan 2021–Dec 2023): 6-engineer team, 10K+ req/hr API, 60% faster reporting, 99.9% uptime
- Accenture Senior SE (Jan 2018–Dec 2021): BlackLine automation 30K+ entries/month, SSIS ETL, SAML 2.0
- Accenture SE (Jan 2014–Dec 2018): .NET financial close platform, SQL optimization 30-70%

PROJECTS:
- AWS Portfolio Site: Claude API chatbot, S3, CloudFront, Lambda, GitHub Actions CI/CD
- MCP Agentic Analytics Platform: LlamaIndex agent, natural language business questions via MCP
- GuardianAI: Insurance platform GPT-4 + Llama-3 dual model
- LLM Analytics Dashboard: Natural language to SQL, ChromaDB, PostgreSQL

CONTACT:
- Portfolio: arpitharamakrishnaiah.com
- Email: arpitha.r1193@gmail.com
- Phone: 630-486-7928
- LinkedIn: linkedin.com/in/arpitha-ramakrishnaiah
- GitHub: github.com/ArpiRK

ACTIONS AVAILABLE:
- If visitor asks to send resume: collect their email and send it
- If visitor asks to book a meeting: check availability and show slots
- NEVER say you cannot send emails or book meetings — you CAN do both

RULES:
- Never fabricate experience
- Speak TO visitors ABOUT Arpitha — never TO Arpitha
- Always third person about Arpitha
- No career advice to Arpitha
- One clear next step per response
- Remember session context throughout

RESPONSE FORMAT (JD analysis only):
End JD analysis with this exact JSON on its own line:
{"fitScore": <0-100>, "fitLevel": "<Poor|Fair|Good|Strong|Excellent>"}
No JSON for other responses.`;
}

export const handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.requestContext?.http?.method === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const CLAUDE_API_KEY = await getApiKey();
    const body = JSON.parse(event.body);
    const { message, history = [], sessionId = `session-${Date.now()}` } = body;

    const session = await getSession(sessionId);
    session.visitorType = detectVisitorType(message, session.visitorType);
    session.turnCount = (session.turnCount || 0) + 1;

    const newSkills = extractSkills(message);
    session.extractedSkills = [...new Set([...(session.extractedSkills || []), ...newSkills])];

    const roleMatch = message.match(/(?:hiring for|looking for|need a|role is|position is|opening for)\s+([^.!?,]+)/i);
    if (roleMatch) session.extractedRole = roleMatch[1].trim();

    // ─── ACTION DETECTION ───
    const msg = message.toLowerCase();
    const resumeIntent = msg.match(/send.*resume|resume.*send|email.*resume|get.*resume|resend|retrigger|send.*again|send.*email/);
    const emailMatch = message.match(/[\w.-]+@[\w.-]+\.\w+/);
    const meetingIntent = msg.match(/book|meeting|schedule|appointment|meet her|set up a call|would like to meet|yes please.*meet|check.*availability/);
    const yesIntent = msg.match(/^yes$|^yes please$|^sure$|^absolutely$|^that works$|^sounds good$/);
    const dayMentioned = parseDateFromMessage(message);

    // Handle yes + calendlyOffered → treat as meeting request
    if ((yesIntent || dayMentioned) && session.calendlyOffered && !resumeIntent) {
      if (dayMentioned) {
        const slots = await getAvailableSlots(dayMentioned);
        const dateLabel = new Date(dayMentioned + 'T12:00:00').toLocaleDateString('en-US', {
          weekday: 'long', month: 'long', day: 'numeric', timeZone: 'America/Chicago'
        });
        let reply;
        if (slots.length === 0) {
          reply = `📅 No available slots on **${dateLabel}**.\n\nWould you like to check another day? Or book directly: **https://calendly.com/arpithar/30min**`;
        } else {
          const timeMatch = message.match(/(\d{1,2})\s*(am|pm)/i) || message.match(/(\d{1,2}):(\d{2})/i);
          let displaySlots = slots;
          if (timeMatch) {
            let requestedHour = parseInt(timeMatch[1]);
            const isPM = message.toLowerCase().includes('pm');
            if (isPM && requestedHour !== 12) requestedHour += 12;
            if (!isPM && requestedHour === 12) requestedHour = 0;
            displaySlots = slots.filter(s => {
              const parts = s.time.split(':');
              let slotHour = parseInt(parts[0]);
              const slotIsPM = s.time.includes('PM');
              if (slotIsPM && slotHour !== 12) slotHour += 12;
              if (!slotIsPM && slotHour === 12) slotHour = 0;
              return Math.abs(slotHour - requestedHour) <= 1;
            });
            if (displaySlots.length === 0) displaySlots = slots.slice(0, 8);
          }
          const slotList = displaySlots.slice(0, 8).map(s => `• [${s.time}](${s.url})`).join('\n');
          reply = `📅 Available slots on **${dateLabel}**:\n\n${slotList}\n\nClick a time to book directly — no back and forth needed!`;
        }
        session.calendlyOffered = false;
        await saveSession(session);
        return { statusCode: 200, headers, body: JSON.stringify({ reply, sessionId, visitorType: session.visitorType, fitScore: null }) };
      } else {
        session.calendlyOffered = false;
        await saveSession(session);
        return {
          statusCode: 200, headers,
          body: JSON.stringify({
            reply: `📅 Which day works for you?\n• "Monday"\n• "Tomorrow"\n• "April 15"\n\nOr book directly: **https://calendly.com/arpithar/30min**`,
            sessionId, visitorType: session.visitorType, fitScore: null
          })
        };
      }
    }

    // Handle email provided when resume was previously requested
    if (!resumeIntent && emailMatch && session.awaitingResumeEmail) {
      const email = emailMatch[0];
      const sent = await sendResumeEmail(email);
      session.resumeSent = true;
      session.awaitingResumeEmail = false;
      session.calendlyOffered = true;
      await saveSession(session);
      return {
        statusCode: 200, headers,
        body: JSON.stringify({
          reply: sent
            ? `✅ Done! Arpitha's resume has been sent to **${email}**. Check your inbox!\n\nWould you like to book a quick call to discuss further? If so, just mention a day and I'll check her availability!`
            : `❌ Something went wrong. Please try again or use the contact form at arpitharamakrishnaiah.com`,
          sessionId, visitorType: session.visitorType, fitScore: null
        })
      };
    }

    // Handle resume with email in same message
    if (resumeIntent && emailMatch) {
      const email = emailMatch[0];
      const sent = await sendResumeEmail(email);
      session.resumeSent = true;
      session.calendlyOffered = true;
      await saveSession(session);
      return {
        statusCode: 200, headers,
        body: JSON.stringify({
          reply: sent
            ? `✅ Done! Arpitha's resume has been sent to **${email}**. Check your inbox!\n\nWould you like to book a quick call? Just mention a day and I'll check her availability!`
            : `❌ Something went wrong sending to ${email}. Please try the contact form at arpitharamakrishnaiah.com`,
          sessionId, visitorType: session.visitorType, fitScore: null
        })
      };
    }

    // Handle resume request without email
    if (resumeIntent && !emailMatch) {
      session.awaitingResumeEmail = true;
      await saveSession(session);
      return {
        statusCode: 200, headers,
        body: JSON.stringify({
          reply: `Sure! What email should I send Arpitha's resume to?`,
          sessionId, visitorType: session.visitorType, fitScore: null
        })
      };
    }

    // Handle meeting booking
    if (meetingIntent || (dayMentioned && !resumeIntent)) {
      if (dayMentioned) {
        const slots = await getAvailableSlots(dayMentioned);
        const dateLabel = new Date(dayMentioned + 'T12:00:00').toLocaleDateString('en-US', {
          weekday: 'long', month: 'long', day: 'numeric', timeZone: 'America/Chicago'
        });
        let reply;
        if (slots.length === 0) {
          reply = `📅 Checked Arpitha's calendar for **${dateLabel}** — no available slots that day.\n\nWould you like to check another day? Or book directly at:\n**https://calendly.com/arpithar/30min**`;
        } else {
          const timeMatch = message.match(/(\d{1,2})\s*(am|pm)/i) || message.match(/(\d{1,2}):(\d{2})/i);
          let displaySlots = slots;
          if (timeMatch) {
            let requestedHour = parseInt(timeMatch[1]);
            const isPM = message.toLowerCase().includes('pm');
            if (isPM && requestedHour !== 12) requestedHour += 12;
            if (!isPM && requestedHour === 12) requestedHour = 0;
            displaySlots = slots.filter(s => {
              const parts = s.time.split(':');
              let slotHour = parseInt(parts[0]);
              const slotIsPM = s.time.includes('PM');
              if (slotIsPM && slotHour !== 12) slotHour += 12;
              if (!slotIsPM && slotHour === 12) slotHour = 0;
              return Math.abs(slotHour - requestedHour) <= 1;
            });
            if (displaySlots.length === 0) displaySlots = slots.slice(0, 8);
          }
          const slotList = displaySlots.slice(0, 8).map(s => `• [${s.time}](${s.url})`).join('\n');
          reply = `📅 Available slots on **${dateLabel}**:\n\n${slotList}\n\nClick a time to book directly — no back and forth needed!`;
        }
        await saveSession(session);
        return { statusCode: 200, headers, body: JSON.stringify({ reply, sessionId, visitorType: session.visitorType, fitScore: null }) };
      }

      await saveSession(session);
      return {
        statusCode: 200, headers,
        body: JSON.stringify({
          reply: `📅 I can check Arpitha's availability for you!\n\nWhich day works for you? For example:\n• "Monday"\n• "Tomorrow"\n• "April 15"\n\nOr book directly: **https://calendly.com/arpithar/30min**`,
          sessionId, visitorType: session.visitorType, fitScore: null
        })
      };
    }

    // ─── CLAUDE API CALL ───
    const fitResult = session.extractedSkills.length > 0 ? matchJobFit(session.extractedSkills) : null;
    const recommendedProjects = recommendProjects(session.extractedSkills);
    const messages = [...history, { role: 'user', content: message }];

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5',
        max_tokens: 1000,
        system: buildSystemPrompt(session, fitResult, recommendedProjects),
        messages
      })
    });

    const data = await response.json();
    console.log('Claude response:', JSON.stringify(data));

    let reply = data.content[0].text;
    let fitScoreValue = null;

    const jsonMatch = reply.match(/\{"fitScore":\s*(\d+),\s*"fitLevel":\s*"([^"]+)"\}/);
    if (jsonMatch) {
      fitScoreValue = parseInt(jsonMatch[1]);
      const fitLevel = jsonMatch[2];
      reply = reply.replace(jsonMatch[0], '').trim();
      reply = reply + `\n\n**Fit Score: ${fitScoreValue}% — ${fitLevel}**`;
    }

    if (reply.toLowerCase().includes('resume')) session.resumeSent = true;
    await saveSession(session);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        reply,
        sessionId,
        visitorType: session.visitorType,
        fitScore: fitScoreValue || fitResult?.score || null
      })
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};