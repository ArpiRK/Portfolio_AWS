# Arpitha Ramakrishnaiah — Portfolio

Personal portfolio site for **Arpitha Ramakrishnaiah**, Senior .NET Engineer with 9+ years building enterprise financial platforms. Features an agentic AI assistant powered by Claude API, real-time Calendly scheduling, and a serverless backend on AWS.

**Live site:** [arpitharamakrishnaiah.com](https://arpitharamakrishnaiah.com)

---

## Architecture

```
Browser
  └── CloudFront CDN
        └── S3 (static React build)

Contact / Resume Form
  └── API Gateway (REST)
        ├── /sendContact  → Lambda (sendContact)
        └── /sendResume   → Lambda (sendResume)
              └── SendGrid (email delivery)

AI Chatbot
  └── API Gateway (HTTP)
        └── Lambda (portfolio-chatbot)
              ├── Claude API (claude-haiku) — intent detection + responses
              ├── DynamoDB (portfolio-sessions) — session memory (TTL: 2hrs)
              ├── Calendly API — real-time availability + slot booking
              ├── sendResume Lambda — resume delivery via chat
              └── AWS SSM Parameter Store — secrets management
```

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 8 |
| Hosting | AWS S3 + CloudFront |
| Backend | AWS Lambda (Node.js 20, ES modules) |
| AI Chatbot | Claude API (claude-haiku), agentic intent routing |
| Session Memory | AWS DynamoDB (TTL: 2 hours) |
| Scheduling | Calendly API (real-time availability) |
| Email | SendGrid via AWS API Gateway |
| Secrets | AWS Systems Manager Parameter Store |
| CI/CD | GitHub Actions → S3 sync + CloudFront invalidation |

---

## Project Structure

```
Portfolio_AWS/
├── .github/
│   └── workflows/
│       └── deploy.yml              # CI/CD pipeline
├── lambda/
│   ├── sendContact/                # Lambda: contact form handler
│   │   └── index.mjs
│   ├── sendResume/                 # Lambda: resume email delivery
│   │   └── index.mjs
│   └── chatbot/                    # Lambda: agentic AI chatbot
│       └── index.mjs               # Deployed directly via AWS console
└── my-portfolio/                   # React frontend (Vite)
    ├── src/
    │   ├── components/
    │   │   ├── Navbar/             # Responsive navbar with hamburger menu
    │   │   ├── Hero/
    │   │   ├── About/
    │   │   ├── Skills/
    │   │   ├── Experience/
    │   │   ├── Projects/
    │   │   ├── Contact/            # Resume form, contact form, Calendly widget
    │   │   └── Chatbot/            # Agentic AI assistant widget
    │   ├── App.jsx
    │   └── main.jsx
    ├── public/
    └── index.html
```

---

## Chatbot — Agentic AI Assistant

The portfolio chatbot goes beyond simple Q&A. It detects visitor intent and completes real tasks.

**Visitor intent detection:**
- Recruiter → asks sponsorship question first, then does JD fit analysis
- Technical reviewer → goes deep on architecture and implementation details
- Interviewer → answers in STAR format with real metrics
- Explorer → asks one routing question to identify intent

**Agentic actions:**
- Sends resume via email directly from chat (calls sendResume Lambda internally)
- Checks real-time Calendly availability for a requested day
- Returns clickable time slot links for direct booking on Calendly
- Maintains session context in DynamoDB across conversation turns

**AWS Parameter Store secrets:**
- `/portfolio/Claude_API_Key` — Claude API key
- `/portfolio/calendly` — Calendly personal access token
- `/portfolio/sendgrid-api-key` — SendGrid API key

> **Note:** The chatbot Lambda (`lambda/chatbot/index.mjs`) is deployed directly via the AWS console, not through CI/CD. The file in this repo reflects the current deployed version but must be manually re-uploaded if changed locally.

---

## Local Development

### Prerequisites

- Node.js 20+
- npm

### Run the frontend

```bash
cd my-portfolio
npm install
npm run dev
```

Dev server starts at `http://localhost:5173`.

### Environment variables

Create `my-portfolio/.env` (not committed):

```
VITE_API_BASE_URL=https://<your-api-gateway-id>.execute-api.us-east-1.amazonaws.com
VITE_CHATBOT_API_URL=https://<your-chatbot-api-gateway-id>.execute-api.us-east-1.amazonaws.com/default/portfolio-chatbot
```

---

## Deployment

Deployment is fully automated via GitHub Actions on every push to `main`.

**Required GitHub Secrets:**

| Secret | Description |
|---|---|
| `AWS_ACCESS_KEY_ID` | IAM user access key |
| `AWS_SECRET_ACCESS_KEY` | IAM user secret key |
| `AWS_REGION` | e.g. `us-east-1` |
| `S3_BUCKET` | S3 bucket name for the static site |
| `CLOUDFRONT_DISTRIBUTION_ID` | CloudFront distribution to invalidate |
| `VITE_API_BASE_URL` | API Gateway URL for sendResume/sendContact |
| `VITE_CHATBOT_API_URL` | API Gateway URL for the chatbot Lambda |

**Pipeline steps:**

1. Checkout code
2. Setup Node.js 20
3. `npm install && npm run build` (with env vars injected from secrets)
4. Configure AWS credentials
5. `aws s3 sync dist/ → S3 --delete --exclude "files/*"`
6. CloudFront cache invalidation

> The `files/` folder (resume PDF) is excluded from S3 sync deletion to prevent the resume from being removed on each deploy.

---

## Lambda Functions

### sendContact

Handles contact form submissions. Validates input, rate-limits by IP (3 req/min), then sends:

1. A notification email to the site owner
2. An auto-reply to the sender

### sendResume

Accepts an email address and delivers a resume download link via SendGrid. Also called internally by the chatbot Lambda when a visitor requests the resume via chat.

### portfolio-chatbot

Agentic AI assistant. On each request:

1. Loads session from DynamoDB
2. Detects visitor type (recruiter, technical, interviewer, explorer)
3. Extracts skills and role mentioned in the message
4. Runs action detection (resume send, meeting booking, Calendly availability check)
5. If no hardcoded action matched — calls Claude API with session-aware system prompt
6. Extracts fit score from Claude response if JD was analyzed
7. Saves updated session to DynamoDB
8. Returns response with optional fit score

> **Deployed manually via AWS console** — not part of the CI/CD pipeline.

---

## Connect

- **LinkedIn:** [linkedin.com/in/arpitha-ramakrishnaiah](https://www.linkedin.com/in/arpitha-ramakrishnaiah/)
- **GitHub:** [github.com/ArpiRK](https://github.com/ArpiRK)
- **Email:** contact@arpitharamakrishnaiah.com