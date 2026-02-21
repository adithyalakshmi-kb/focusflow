import nodemailer from 'nodemailer';

// Create transporter (configure with your email service)
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendVerificationEmail = async (email, verificationToken) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM || 'noreply@focusflow.com',
    to: email,
    subject: 'Email Verification - FocusFlow',
    html: `
      <h2>Welcome to FocusFlow!</h2>
      <p>Please verify your email to start using FocusFlow.</p>
      <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 5px;">
        Verify Email
      </a>
      <p>Or copy this link: ${verificationUrl}</p>
      <p>This link expires in 24 hours.</p>
    `,
  };

  return transporter.sendMail(mailOptions);
};

export const sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM || 'noreply@focusflow.com',
    to: email,
    subject: 'Password Reset - FocusFlow',
    html: `
      <h2>Password Reset Request</h2>
      <p>We received a request to reset your password. Click the link below to reset it.</p>
      <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 5px;">
        Reset Password
      </a>
      <p>Or copy this link: ${resetUrl}</p>
      <p>This link expires in 1 hour. If you didn't request this, ignore this email.</p>
    `,
  };

  return transporter.sendMail(mailOptions);
};

export const sendMotivationalEmail = async (email, message) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'noreply@focusflow.com',
    to: email,
    subject: 'Daily Motivation - FocusFlow',
    html: `
      <h2>Your Daily Motivation</h2>
      <p>"${message}"</p>
      <p>Keep up the great work! 💪</p>
    `,
  };

  return transporter.sendMail(mailOptions);
};

export default { sendVerificationEmail, sendPasswordResetEmail, sendMotivationalEmail };
