const nodemailer = require('nodemailer');
require('dotenv').config();

const sendStatusUpdateEmail = async (user, company, detailedStatus) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'mersalkishore79@gmail.com',
    subject: `🧾 Status Update for ${user.name} - ${company.name}`,
    html: `
      <h2>📝 Detailed Status Update</h2>

      <h3>👤 User Information</h3>
      <ul>
        <li><strong>Token No:</strong> ${user.tokenNo}</li>
        <li><strong>Name:</strong> ${user.name}</li>
        <li><strong>Email:</strong> ${user.email}</li>
        <li><strong>Contact:</strong> ${user.contact}</li>
        <li><strong>Batch:</strong> ${user.batch}</li>
        <li><strong>Location:</strong> ${user.location}</li>
        <li><strong>Skillset:</strong> ${user.skillset}</li>
        <li><strong>Experience:</strong> ${user.experience}</li>
        <li><strong>CTC:</strong> ${user.ctc}</li>
      </ul>

      <h3>🏢 Company Assigned</h3>
      <ul>
        <li><strong>Name:</strong> ${company.name}</li>
        <li><strong>Role:</strong> ${company.role}</li>
        <li><strong>Description:</strong> ${company.description}</li>
      </ul>

      <h3>📌 Detailed Status</h3>
      <p><strong>${detailedStatus}</strong></p>

      <p><strong>Message from User:</strong> ${user.message}</p>

      <hr/>
      <p>This is an automated notification from NEC Alumni Job Portal.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Admin status email sent.");
  } catch (error) {
    console.error("❌ Email failed:", error);
  }
};

module.exports = {
  sendStatusUpdateEmail
};
