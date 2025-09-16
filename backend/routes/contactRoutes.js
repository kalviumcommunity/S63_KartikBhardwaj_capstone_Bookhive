const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

// Create transporter for sending emails
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Contact form submission route
router.post('/submit', async (req, res) => {
  try {
    const { name, email, message, subject } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required fields.'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    const transporter = createTransporter();

    // Email to admin (you)
    const adminMailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_USER,
      subject: `New Contact Form Submission: ${subject || 'General Inquiry'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #4a90e2; text-align: center; margin-bottom: 30px;">New Contact Form Submission</h2>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
            <h3 style="color: #333; margin-top: 0;">Contact Details:</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject || 'General Inquiry'}</p>
          </div>
          
          <div style="background-color: #fff; padding: 20px; border: 1px solid #eee; border-radius: 6px;">
            <h3 style="color: #333; margin-top: 0;">Message:</h3>
            <p style="line-height: 1.6; color: #555;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #888; font-size: 14px;">This message was sent from the BookHive contact form.</p>
          </div>
        </div>
      `
    };

    // Confirmation email to user
    const userMailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Thank you for contacting BookHive!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #4a90e2; text-align: center; margin-bottom: 30px;">Thank You for Reaching Out!</h2>
          
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://via.placeholder.com/100x100/4a90e2/ffffff?text=BH" alt="BookHive Logo" style="border-radius: 50%;">
          </div>
          
          <p style="font-size: 16px; line-height: 1.6; color: #333;">Hi ${name},</p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            Thank you for contacting BookHive! We've received your message and appreciate you taking the time to reach out to us.
          </p>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 6px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Your Message Summary:</h3>
            <p><strong>Subject:</strong> ${subject || 'General Inquiry'}</p>
            <p><strong>Message:</strong> ${message.substring(0, 100)}${message.length > 100 ? '...' : ''}</p>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            We typically respond to inquiries within 24-48 hours. If your message is urgent, please don't hesitate to follow up.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CLIENT_URL}" style="background-color: #4a90e2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Visit BookHive</a>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #888; font-size: 14px;">
              Best regards,<br>
              The BookHive Team
            </p>
          </div>
        </div>
      `
    };

    // Send emails
    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(userMailOptions);

    res.status(200).json({
      success: true,
      message: 'Your message has been sent successfully! We\'ll get back to you soon.'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Sorry, there was an error sending your message. Please try again later.'
    });
  }
});

// Get contact information route
router.get('/info', (req, res) => {
  res.json({
    success: true,
    data: {
      email: 'kbrupc2020@gmail.com',
      phone: '9917044xxx',
      address: 'Greater Noida sector - 1',
      socialMedia: {
        linkedin: 'https://www.linkedin.com/in/kartik-bhardwaj-0b82a8316/',
        github: 'https://github.com/kartikbhardwaj1111',
        portfolio: 'https://portfolio-website-lilac-xi-72.vercel.app/'
      }
    }
  });
});

module.exports = router;

