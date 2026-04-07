import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm'

const ssm = new SSMClient({ region: process.env.AWS_REGION ?? 'us-east-1' })

// ── Rate limiter (in-memory, per Lambda instance) ──────────────────────────
const rateLimitMap = new Map()
const RATE_LIMIT_MAX = 3        // max requests
const RATE_LIMIT_WINDOW_MS = 60_000  // per 60 seconds

function tryConsume(ip) {
  const now = Date.now()
  const entry = rateLimitMap.get(ip) ?? { count: 0, windowStart: now }
  if (now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    entry.count = 0
    entry.windowStart = now
  }
  entry.count++
  rateLimitMap.set(ip, entry)
  return entry.count <= RATE_LIMIT_MAX
}

// ── Email validation ────────────────────────────────────────────────────────
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function isValidEmail(email) {
  return EMAIL_REGEX.test(email)
}

function maskEmail(email) {
  if (!email?.includes('@')) return 'invalid'
  const [local, domain] = email.split('@')
  return local.length <= 1 ? `*@${domain}` : `${local[0]}***@${domain}`
}

// ── Fetch SendGrid key from Parameter Store ─────────────────────────────────
let cachedApiKey = null
async function getApiKey() {
  if (cachedApiKey) return cachedApiKey
  const cmd = new GetParameterCommand({
    Name: '/portfolio/sendgrid-api-key',
    WithDecryption: true,
  })
  const res = await ssm.send(cmd)
  cachedApiKey = res.Parameter.Value
  return cachedApiKey
}

// ── CORS headers ────────────────────────────────────────────────────────────
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST,OPTIONS',
}

function respond(statusCode, body) {
  return { statusCode, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
}

// ── Handler ─────────────────────────────────────────────────────────────────
export const handler = async (event) => {
  // Preflight
  if (event.httpMethod === 'OPTIONS') return respond(200, {})

  const clientIp = event.requestContext?.identity?.sourceIp ?? 'unknown'
  const timestamp = new Date().toISOString()

  let email
  try {
    const body = JSON.parse(event.body ?? '{}')
    email = body.email?.trim()
  } catch {
    return respond(400, { success: false, message: 'Invalid request body.' })
  }

  // Validation
  if (!email)
    return respond(400, { success: false, message: 'Email is required.' })
  if (email.length > 200)
    return respond(400, { success: false, message: 'Email must be 200 characters or fewer.' })
  if (!isValidEmail(email))
    return respond(400, { success: false, message: 'Invalid email format.' })

  // Rate limit
  if (!tryConsume(clientIp))
    return respond(429, { success: false, message: 'Too many requests. Please try again later.' })

  // Send via SendGrid
  try {
    const apiKey = await getApiKey()

    const payload = {
      personalizations: [{ to: [{ email }] }],
      from: { email: 'contact@arpitharamakrishnaiah.com', name: 'Arpitha Ramakrishnaiah' },
      subject: 'Here is my resume — Arpitha Ramakrishnaiah',
      content: [
        {
          type: 'text/html',
          value: `
            <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
              <h2 style="color:#10b981">Hi there,</h2>
              <p>Thanks for your interest! Please find my resume at the link below.</p>
              <p>
                <a href="https://arpitharamakrishnaiah.com/files/Arpitha_Resume.pdf"
                   style="background:#10b981;color:#000;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;display:inline-block">
                  Download Resume (PDF)
                </a>
              </p>
              <p style="color:#666;font-size:0.9rem">
                Feel free to reach out at 
                <a href="mailto:contact@arpitharamakrishnaiah.com">contact@arpitharamakrishnaiah.com</a>
                if you have any questions.
              </p>
              <hr style="border:none;border-top:1px solid #eee;margin:2rem 0"/>
              <p style="color:#999;font-size:0.8rem">Arpitha Ramakrishnaiah · Senior .NET Engineer · Chicago, IL</p>
            </div>
          `,
        },
      ],
    }

    const sgRes = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!sgRes.ok) {
      const err = await sgRes.text()
      console.error(`SendGrid error ${sgRes.status}: ${err}`)
      return respond(500, { success: false, message: 'Unable to send resume right now. Please try again shortly.' })
    }

    console.log(`Resume sent at ${timestamp} to ${maskEmail(email)} from ${clientIp}`)
    return respond(200, { success: true, message: 'Sent' })

  } catch (err) {
    console.error('Unexpected error:', err)
    return respond(500, { success: false, message: 'Unable to send resume right now. Please try again shortly.' })
  }
}
