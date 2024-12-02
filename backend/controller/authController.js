const twilio = require('twilio');
const Customer = require('../model/customerModel'); // Update the path as necessary
require("dotenv").config()

// Twilio setup
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = 'VAc88ce2237bcc703dd46ed8c42c31e7c1'; // Your Verify Service SID
console.log('process.env.TWILIO_ACCOUNT_SID', process.env.TWILIO_ACCOUNT_SID);
const client = twilio(process.env.TWILIO_ACCOUNT_SID, authToken);

exports.sendOtp = async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  try {
    console.log(`Starting sendOtp for phone number: ${phoneNumber}`);

    // Trigger OTP via Twilio Verify v2 API
    const response = await client.verify.v2.services(verifyServiceSid)
      .verifications
      .create({ to: phoneNumber, channel: 'sms' });

    res.status(200).json({ message: 'OTP sent successfully', response });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ error: 'Failed to send OTP', details: error.message });
  }
};


exports.verifyOtp = async (req, res) => {
    const { phoneNumber, otp } = req.body;
  
    if (!phoneNumber || !otp) {
      return res.status(400).json({ error: 'Phone number and OTP are required' });
    }
  
    try {
      console.log(`Verifying OTP for phone number: ${phoneNumber}`);
  
      const response = await client.verify.v2.services(verifyServiceSid)
      .verificationChecks.create({ to: phoneNumber, code: otp });
  
  
  
      if (response.status === 'approved') {
        // Check if user already exists
        let customer = await Customer.findOne({ phoneNumber });
  
        if (!customer) {
          // Create a new user
          customer = await Customer.create({ phoneNumber, isVerified: true });
        } else {
          // Update user verification status if needed
          customer.isVerified = true;
          await customer.save();
        }
  
        res.status(200).json({ message: 'OTP verified successfully', customer });
      } else {
        res.status(400).json({ error: 'Invalid OTP' });
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      res.status(500).json({ error: 'Failed to verify OTP', details: error.message });
    }
  };
  ;
