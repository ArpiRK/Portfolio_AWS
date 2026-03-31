import './Contact.css'

function Contact() {
  return (
    <section className="contact" id="contact">
      <div className="section-label">Get In Touch</div>
      <h2 className="section-title">Lets Build Something Together</h2>
      <p className="contact-desc">
        Have a senior .NET engineering opportunity? I am actively looking
        for my next role and would love to connect.
      </p>
      <a href="mailto:arpitha.r1193@gmail.com" className="contact-email">
        arpitha.r1193@gmail.com
      </a>
      <div className="contact-buttons" style={{ marginTop: '2rem' }}>
        <a
          href="https://www.linkedin.com/in/arpitha-ramakrishnaiah/"
          target="_blank"
          rel="noreferrer"
          className="btn-primary"
        >
          LinkedIn
        </a>
        <a
          href="https://github.com/ArpiRK"
          target="_blank"
          rel="noreferrer"
          className="btn-secondary"
        >
          GitHub
        </a>
      </div>
      <div className="contact-footer">
        Built with React and Vite. Hosted on AWS S3 and CloudFront.
        Arpitha Ramakrishnaiah. Chicago, IL
      </div>
    </section>
  )
}

export default Contact