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
              └── Amazon SES (email delivery)
                    Delivered via IAM role, no API key needed
```

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 8 |
| Hosting | AWS S3 + CloudFront |
| Backend | AWS Lambda (Node.js 20, ES modules) |
| Email | Amazon SES via AWS API Gateway |
| Secrets | AWS Systems Manager Parameter Store |
| CI/CD | GitHub Actions → S3 sync + CloudFront invalidation |

---

## Project Structure

```
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD pipeline
├── lambda/
│   ├── sendContact/            # Lambda: contact form handler
│   │   └── index.mjs
│   └── sendResume/             # Lambda: resume email delivery
│       └── index.mjs
└── src/
    ├── components/
    │   ├── Navbar/
    │   ├── Hero/
    │   ├── About/
    │   ├── Skills/
    │   ├── Experience/
    │   ├── Projects/
    │   └── Contact/
    ├── App.jsx
    └── main.jsx
```

---

## Local Development

**Prerequisites:** Node.js 20+, npm

```bash
npm install
npm run dev
```

Dev server starts at `http://localhost:5173`.

Create a `.env` file (not committed):

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

Both functions are deployed as `.zip` packages to AWS Lambda.

### sendContact

Handles contact form submissions. Validates input, rate-limits by IP (3 req/min), then sends:
1. A notification email to the site owner
2. An auto-reply to the sender

### sendResume

<!-- Previous: "Accepts an email address and delivers a resume download link via SendGrid." / SendGrid API key stored in Parameter Store at `/portfolio/sendgrid-api-key` — migrated to Amazon SES -->
Accepts an email address and delivers a resume download link via Amazon SES.

Sent via the AWS SDK using the Lambda's IAM role — no API key to manage or rotate.

---

## Connect

- **LinkedIn:** [linkedin.com/in/arpitha-ramakrishnaiah](https://www.linkedin.com/in/arpitha-ramakrishnaiah/)
- **GitHub:** [github.com/ArpiRK](https://github.com/ArpiRK)
- **Email:** contact@arpitharamakrishnaiah.com
