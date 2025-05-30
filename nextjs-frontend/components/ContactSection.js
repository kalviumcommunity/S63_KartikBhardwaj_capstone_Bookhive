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
              <span>info@bookhive.com</span>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📱</span>
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📍</span>
              <span>123 Book Street, Reading, CA 94321</span>
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