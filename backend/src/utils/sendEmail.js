import nodemailer from 'nodemailer';

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD
    }
  });
};

// Send email function
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `${process.env.FROM_NAME || 'E-Commerce App'} <${process.env.FROM_EMAIL || process.env.SMTP_EMAIL}>`,
      to: options.email,
      subject: options.subject,
      html: options.html || options.message
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email sent: ', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Email templates
export const emailTemplates = {
  // Welcome email template
  welcome: (name) => ({
    subject: 'Welcome to Our E-Commerce Store!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome ${name}!</h2>
        <p>Thank you for joining our e-commerce platform. We're excited to have you as part of our community.</p>
        <p>You can now:</p>
        <ul>
          <li>Browse our extensive product catalog</li>
          <li>Add items to your cart and wishlist</li>
          <li>Track your orders</li>
          <li>Manage your profile and addresses</li>
        </ul>
        <p>Happy shopping!</p>
        <hr>
        <p style="font-size: 12px; color: #666;">
          If you have any questions, feel free to contact our support team.
        </p>
      </div>
    `
  }),

  // Email verification template
  emailVerification: (name, verificationUrl) => ({
    subject: 'Verify Your Email Address',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Email Verification</h2>
        <p>Hi ${name},</p>
        <p>Please click the button below to verify your email address:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #007bff; color: white; padding: 12px 30px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            Verify Email
          </a>
        </div>
        <p>Or copy and paste this link in your browser:</p>
        <p style="word-break: break-all; color: #007bff;">${verificationUrl}</p>
        <p>This link will expire in 24 hours.</p>
        <hr>
        <p style="font-size: 12px; color: #666;">
          If you didn't create an account, please ignore this email.
        </p>
      </div>
    `
  }),

  // Password reset template
  passwordReset: (name, resetUrl) => ({
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset</h2>
        <p>Hi ${name},</p>
        <p>You requested a password reset. Click the button below to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #dc3545; color: white; padding: 12px 30px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>Or copy and paste this link in your browser:</p>
        <p style="word-break: break-all; color: #dc3545;">${resetUrl}</p>
        <p>This link will expire in 10 minutes.</p>
        <hr>
        <p style="font-size: 12px; color: #666;">
          If you didn't request this, please ignore this email and your password will remain unchanged.
        </p>
      </div>
    `
  }),

  // Order confirmation template
  orderConfirmation: (name, orderNumber, orderTotal, items) => ({
    subject: `Order Confirmation - ${orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Order Confirmation</h2>
        <p>Hi ${name},</p>
        <p>Thank you for your order! Here are the details:</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Order #${orderNumber}</h3>
          <p><strong>Total: ₹${orderTotal}</strong></p>
        </div>

        <h4>Items Ordered:</h4>
        <ul>
          ${items.map(item => `
            <li>${item.name} - Quantity: ${item.quantity} - ₹${item.price}</li>
          `).join('')}
        </ul>

        <p>We'll send you another email when your order ships.</p>
        <hr>
        <p style="font-size: 12px; color: #666;">
          Thank you for shopping with us!
        </p>
      </div>
    `
  }),

  // Order status update template
  orderStatusUpdate: (name, orderNumber, status, trackingNumber = null) => ({
    subject: `Order Update - ${orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Order Status Update</h2>
        <p>Hi ${name},</p>
        <p>Your order #${orderNumber} status has been updated to: <strong>${status}</strong></p>
        
        ${trackingNumber ? `
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Tracking Number:</strong> ${trackingNumber}</p>
          </div>
        ` : ''}

        <p>You can track your order status in your account dashboard.</p>
        <hr>
        <p style="font-size: 12px; color: #666;">
          Thank you for shopping with us!
        </p>
      </div>
    `
  })
};

export default sendEmail;