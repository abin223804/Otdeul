const axios = require('axios');
const nodemailer = require('nodemailer');
const formData = require('form-data');

const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN;
const FAST2SMS_API_KEY = process.env.FAST2SMS_API_KEY;

// Configure Mailgun
const transporter = nodemailer.createTransport({
  service: 'Mailgun',
  auth: {
    user: `api:${MAILGUN_API_KEY}`,
    pass: MAILGUN_API_KEY
  }
});

// Function to send OTP via Mailgun (Email)
const sendEmailOTP = async (email, otp) => {
  const mailOptions = {
    from: 'no-reply@yourdomain.com',
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email OTP sent successfully');
  } catch (error) {
    console.error('Error sending email OTP:', error);
  }
};

// Function to send OTP via Fast2SMS (SMS)
const sendSMSOTP = async (phoneNumber, otp) => {
  const url = 'https://www.fast2sms.com/dev/bulkV2';
  const data = {
    route: 'v3',
    sender_id: 'TXTIND',
    message: `Your OTP code is ${otp}`,
    language: 'english',
    numbers: phoneNumber
  };

  const headers = {
    'authorization': FAST2SMS_API_KEY,
    'Content-Type': 'application/json'
  };

  try {
    await axios.post(url, data, { headers });
    console.log('SMS OTP sent successfully');
  } catch (error) {
    console.error('Error sending SMS OTP:', error);
  }
};

// Function to generate a 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

module.exports = {
  sendEmailOTP,
  sendSMSOTP,
  generateOTP
};
