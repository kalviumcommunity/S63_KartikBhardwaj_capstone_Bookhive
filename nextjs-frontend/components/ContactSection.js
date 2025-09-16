const ContactSection = () => {
  return (
    <section className="contact-section">
      <h2 className="section-title">Contact Us</h2>
      
      <div className="contact-container">
        <div className="contact-info">
          <h3>Get in Touch</h3>
          <p>Have questions or suggestions? We'd love to hear from you!</p>
          <div className="contact-details">
            <div className="contact-item">
              <span className="contact-icon">📧</span>
              <span>kbrupc2020@gmail.com</span>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📱</span>
              <span>9917044xxx</span>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📍</span>
              <span>Greater Noida sector - 1</span>
            </div>
          </div>
          
          {/* Social Media Links */}
          <div className="social-media-section">
            <h4>Follow Us</h4>
            <div className="social-links">
              <a href="https://www.linkedin.com/in/kartik-bhardwaj-0b82a8316/" target="_blank" rel="noopener noreferrer" title="LinkedIn">
                LinkedIn
              </a>
              <a href="https://github.com/kartikbhardwaj1111" target="_blank" rel="noopener noreferrer" title="GitHub">
                GitHub
              </a>
              <a href="https://portfolio-website-lilac-xi-72.vercel.app/" target="_blank" rel="noopener noreferrer" title="Portfolio">
                Portfolio
              </a>
            </div>
          </div>
        </div>
        
        <form className="contact-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" placeholder="Your name" />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="Your email" />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea id="message" placeholder="Your message" rows="5"></textarea>
          </div>
          <button type="submit" className="submit-button">Send Message</button>
        </form>
      </div>
    </section>
  );
};

export default ContactSection;