const express = require('express');
const { Resend } = require('resend');
const router = express.Router();

const resend = new Resend(process.env.RESEND_API_KEY); 

router.post('/send-message', async (req, res) => {
  const { name, email, phone, service, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  try {
    const data = await resend.emails.send({
      from: 'Future Forge <onboarding@resend.dev>', 
      to: ['futureforge.official.work@gmail.com'],  
      subject: `New Contact Form Submission: ${service || 'General'}`,
      html: `
        <h2>📨 New Message Received</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
        <p><strong>Service:</strong> ${service || 'Not Specified'}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    return res.status(200).json({ success: true, message: 'Message sent successfully!', data });
  } catch (err) {
    console.error('Resend email error:', err);
    return res.status(500).json({ error: 'Failed to send message via Resend.' });
  }
});

module.exports = router;