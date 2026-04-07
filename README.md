# Arpitha Ramakrishnaiah — Portfolio

Personal portfolio site for **Arpitha Ramakrishnaiah**, Senior .NET Engineer with 9+ years building enterprise financial platforms. Showcases work, skills, and a serverless contact form backed by AWS.

**Live site:** [arpitharamakrishnaiah.com](https://arpitharamakrishnaiah.com)

---

## Architecture

```
Browser
  └── CloudFront CDN
        └── S3 (static React build)

Contact / Resume Form
  └── API Gateway (REST)
        ├── /contact  → Lambda (sendContact)
        └── /resume   → Lambda (sendResume)
              └── SendGrid (email delivery)
                    API key stored in AWS Parameter Store
```

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 8 |
| Hosting | AWS S3 + CloudFront |
| Backend | AWS Lambda (Node.js 20, ES modules) |
| Email | SendGrid via AWS API Gateway |
| Secrets | AWS Systems Manager Parameter Store |
| CI/CD | GitHub Actions → S3 sync + CloudFront invalidation |

---

## Project Structure

```
Portfolio_AWS/
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD pipeline
├── lambda/
│   ├── sendContact/            # Lambda: contact form handler
│   │   └── index.mjs
│   └── sendResume/             # Lambda: resume email delivery
│       └── index.mjs
└── my-portfolio/               # React frontend (Vite)
    ├── src/
    │   ├── components/
    │   │   ├── Navbar/
    │   │   ├── Hero/
    │   │   ├── About/
    │   │   ├── Skills/
    │   │   ├── Experience/
    │   │   ├── Projects/
    │   │   └── Contact/
    │   ├── App.jsx
    │   └── main.jsx
    ├── public/
    └── index.html
```

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

The dev server starts at `http://localhost:5173`.

### Environment variable

Create `my-portfolio/.env` (not committed):

```
VITE_API_BASE_URL=https://<your-api-gateway-id>.execute-api.us-east-1.amazonaws.com
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

The pipeline: installs → builds → syncs to S3 → invalidates CloudFront cache.

---

## Lambda Functions

Both functions are deployed manually as `.zip` packages to AWS Lambda.

### sendContact

Handles contact form submissions. Validates input, rate-limits by IP (3 req/min), then sends:
1. A notification email to the site owner
2. An auto-reply to the sender

### sendResume

Accepts an email address and delivers a resume download link via SendGrid.

**SendGrid API key** is stored in AWS Parameter Store at `/portfolio/sendgrid-api-key` and fetched at runtime — it is never stored in code or environment variables.

---

## CI/CD Pipeline

```yaml
on:
  push:
    branches: [main]

steps:
  1. Checkout
  2. Setup Node.js 20
  3. npm install && npm run build
  4. Configure AWS credentials (from GitHub Secrets)
  5. aws s3 sync dist/ → S3
  6. CloudFront cache invalidation
```

---

## Connect

- **LinkedIn:** [linkedin.com/in/arpitha-ramakrishnaiah](https://www.linkedin.com/in/arpitha-ramakrishnaiah/)
- **GitHub:** [github.com/ArpiRK](https://github.com/ArpiRK)
- **Email:** contact@arpitharamakrishnaiah.com
