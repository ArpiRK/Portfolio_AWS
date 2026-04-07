import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm'

const ssm = new SSMClient({ region: process.env.AWS_REGION ?? 'us-east-1' })

// ── Rate limiter ────────────────────────────────────────────────────────────
const rateLimitMap = new Map()
const RATE_LIMIT_MAX = 3
const RATE_LIMIT_WINDOW_MS = 60_000

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
  if (event.httpMethod === 'OPTIONS') return respond(200, {})

  const clientIp = event.requestContext?.identity?.sourceIp ?? 'unknown'

  let name, email, message
  try {
    const body = JSON.parse(event.body ?? '{}')
    name = body.name?.trim()
    email = body.email?.trim()
    message = body.message?.trim()
  } catch {
    return respond(400, { success: false, message: 'Invalid request body.' })
  }

  // Validation
  if (!name)
    return respond(400, { success: false, message: 'Name is required.' })
  if (!email || email.length > 200 || !isValidEmail(email))
    return respond(400, { success: false, message: 'A valid email address is required.' })
  if (!message)
    return respond(400, { success: false, message: 'Message is required.' })

  // Rate limit
  if (!tryConsume(clientIp))
    return respond(429, { success: false, message: 'Too many requests. Please try again later.' })

  try {
    const apiKey = await getApiKey()

    // Email to YOU — notification of new contact
    const notifyPayload = {
      personalizations: [{ to: [{ email: 'arpitha.r1193@gmail.com' }] }],
      from: { email: 'contact@arpitharamakrishnaiah.com', name: 'Portfolio Contact Form' },
      reply_to: { email, name },
      subject: `New contact from ${name} — Portfolio`,
      content: [
        {
          type: 'text/html',
          value: `
            <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
              <h2 style="color:#10b981">New message from your portfolio</h2>
              <table style="width:100%;border-collapse:collapse">
                <tr>
                  <td style="padding:8px;font-weight:600;width:80px">Name</td>
                  <td style="padding:8px">${name}</td>
                </tr>
                <tr style="background:#f9f9f9">
                  <td style="padding:8px;font-weight:600">Email</td>
                  <td style="padding:8px"><a href="mailto:${email}">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding:8px;font-weight:600;vertical-align:top">Message</td>
                  <td style="padding:8px;white-space:pre-wrap">${message}</td>
                </tr>
              </table>
              <p style="color:#999;font-size:0.8rem;margin-top:2rem">
                Sent from arpitharamakrishnaiah.com · IP: ${clientIp}
              </p>
            </div>
          `,
        },
      ],
    }

    // Auto-reply to sender
    const autoReplyPayload = {
      personalizations: [{ to: [{ email, name }] }],
      from: { email: 'contact@arpitharamakrishnaiah.com', name: 'Arpitha Ramakrishnaiah' },
      subject: `Thanks for reaching out, ${name}!`,
      content: [
        {
          type: 'text/html',
          value: `
            <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
              <h2 style="color:#10b981">Hi ${name},</h2>
              <p>Thanks for getting in touch! I've received your message and will get back to you within 1–2 business days.</p>
              <p>In the meantime, feel free to connect with me on 
                <a href="https://www.linkedin.com/in/arpitha-ramakrishnaiah/">LinkedIn</a>.
              </p>
              <hr style="border:none;border-top:1px solid #eee;margin:2rem 0"/>
              <p style="color:#999;font-size:0.8rem">Arpitha Ramakrishnaiah · Senior .NET Engineer · Chicago, IL</p>
            </div>
          `,
        },
      ],
    }

    // Send both in parallel
    const [notifyRes, autoReplyRes] = await Promise.all([
      fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(notifyPayload),
      }),
      fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(autoReplyPayload),
      }),
    ])

    if (!notifyRes.ok) {
      const err = await notifyRes.text()
      console.error(`SendGrid notify error ${notifyRes.status}: ${err}`)
      return respond(500, { success: false, message: 'Unable to send right now. Please try again shortly.' })
    }

    console.log(`Contact form submitted by ${maskEmail(email)} from ${clientIp}`)
    return respond(200, { success: true, message: "Thanks! I'll get back to you soon." })

  } catch (err) {
    console.error('Unexpected error:', err)
    return respond(500, { success: false, message: 'Unable to send right now. Please try again shortly.' })
  }
}
