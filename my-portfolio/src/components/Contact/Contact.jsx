import { useState } from 'react'
import './Contact.css'

const API_BASE = import.meta.env.VITE_API_BASE_URL

function Contact() {
  const [resumeEmail, setResumeEmail] = useState('')
  const [resumeStatus, setResumeStatus] = useState(null)
  const [resumeMsg, setResumeMsg] = useState('')
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [contactStatus, setContactStatus] = useState(null)
  const [contactMsg, setContactMsg] = useState('')

  async function handleResumeSubmit(e) {
    e.preventDefault()
    setResumeStatus('loading')
    try {
      const res = await fetch(`${API_BASE}/sendResume`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: resumeEmail }) })
      const data = await res.json()
      if (data.success) { setResumeStatus('success'); setResumeMsg('Resume sent! Check your inbox.'); setResumeEmail('') }
      else { setResumeStatus('error'); setResumeMsg(data.message ?? 'Something went wrong.') }
    } catch { setResumeStatus('error'); setResumeMsg('Network error. Please try again.') }
  }

  async function handleContactSubmit(e) {
    e.preventDefault()
    setContactStatus('loading')
    try {
      const res = await fetch(`${API_BASE}/sendContact`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await res.json()
      if (data.success) { setContactStatus('success'); setContactMsg("Thanks! I'll get back to you soon."); setForm({ name: '', email: '', message: '' }) }
      else { setContactStatus('error'); setContactMsg(data.message ?? 'Something went wrong.') }
    } catch { setContactStatus('error'); setContactMsg('Network error. Please try again.') }
  }

  return (
    <section className="contact" id="contact">
      <div className="section-label">Get In Touch</div>
      <h2 className="section-title">Let's Build Something Together</h2>
      <p className="contact-desc">Have a senior .NET engineering opportunity? I am actively looking for my next role and would love to connect.</p>
      <div className="contact-grid">
        <div className="contact-card">
          <h3 className="contact-card-title">Get My Resume</h3>
          <p className="contact-card-desc">Enter your email and I'll send it straight to your inbox.</p>
          <form onSubmit={handleResumeSubmit} className="contact-form">
            <input type="email" placeholder="your@email.com" value={resumeEmail} onChange={e => setResumeEmail(e.target.value)} required disabled={resumeStatus === 'loading'} className="contact-input" />
            <button type="submit" disabled={resumeStatus === 'loading'} className="btn-primary">{resumeStatus === 'loading' ? 'Sending…' : 'Send Resume'}</button>
            {resumeMsg && <p className={`contact-feedback ${resumeStatus}`}>{resumeMsg}</p>}
          </form>
        </div>
        <div className="contact-card">
          <h3 className="contact-card-title">Send a Message</h3>
          <p className="contact-card-desc">I'll reply from my domain email within 1–2 business days.</p>
          <form onSubmit={handleContactSubmit} className="contact-form">
            <input type="text" placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required disabled={contactStatus === 'loading'} className="contact-input" />
            <input type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required disabled={contactStatus === 'loading'} className="contact-input" />
            <textarea placeholder="Your message…" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required disabled={contactStatus === 'loading'} className="contact-input contact-textarea" rows={4} />
            <button type="submit" disabled={contactStatus === 'loading'} className="btn-primary">{contactStatus === 'loading' ? 'Sending…' : 'Send Message'}</button>
            {contactMsg && <p className={`contact-feedback ${contactStatus}`}>{contactMsg}</p>}
          </form>
        </div>
      </div>
      <div className="contact-social">
        <div className="contact-buttons">
          <a href="https://www.linkedin.com/in/arpitha-ramakrishnaiah/" target="_blank" rel="noreferrer" className="btn-primary">LinkedIn</a>
          <a href="https://github.com/ArpiRK" target="_blank" rel="noreferrer" className="btn-secondary">GitHub</a>
        </div>
      </div>
      <div className="contact-footer">Built with React and Vite. Hosted on AWS S3 and CloudFront. Chicago, IL</div>
    </section>
  )
}

export default Contact
