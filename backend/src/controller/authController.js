const twilio = require('twilio');
const Customer = require('../model/customerModel');
const { encrypt, decrypt } = require('../../utils/cryptoFunc');
const generateToken = require('../../utils/generateToken');
require("dotenv").config();

// Twilio setup
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = 'VAc88ce2237bcc703dd46ed8c42c31e7c1';
const client = twilio(process.env.TWILIO_ACCOUNT_SID, authToken);

exports.sendOtp = async (req, res) => {
  console.log('=== Starting sendOtp function ===');
  const { phoneNumber } = req.body;
  console.log('Received phone number:', phoneNumber);

  if (!phoneNumber) {
    console.log('Error: Phone number missing in request');
    return res.status(400).json({ error: 'Phone number is required' });
  }

  try {
    console.log('Generating OTP for phone number:', phoneNumber);
    
    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('Generated OTP:', otp);

    // Encrypt the OTP
    const hashedOtp = encrypt(otp);
    console.log('OTP encrypted successfully');

    // Store encrypted OTP in cookie
    res.cookie('hashedOtp', hashedOtp, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 5 * 60 * 1000
    });
    console.log('Stored hashed OTP in cookie');

    // Store phone number in cookie
    res.cookie('phoneNumber', phoneNumber, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 5 * 60 * 1000
    });
    console.log('Stored phone number in cookie');

    // Send the generated OTP via Twilio
    console.log('Attempting to send OTP via Twilio...');
    const response = await client.messages.create({
      body: `Your Ejuzz verification OTP is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });
    console.log('Twilio response:', response);

    console.log('=== sendOtp function completed successfully ===');
    const token = await generateToken({hashedOtp, phoneNumber})
    return res.status(200).json({ message: 'OTP sent successfully', data:token }); // Optional: Expose OTP for testing in development
  } catch (error) {
    console.error('=== Error in sendOtp function ===');
    console.error('Error details:', error);
    return res.status(500).json({ error: 'Failed to send OTP', details: error.message });
  }
};


exports.verifyOtp = async (req, res) => {
  console.log('=== Starting verifyOtp function ===');
  const { otp } = req.body;

  let hashedOtp = req.cookies.hashedOtp;
  let phoneNumber = req.cookies.phoneNumber;

  if(!hashedOtp || !phoneNumber){
    const cookiesToken = req.headers['authorization'].split(' ')[1];
    const token = jwt.verify(cookiesToken, process.env.JWT_SECRET);
    hashedOtp = token.hashedOtp;
    phoneNumber = token.phoneNumber;

    if(!hashedOtp) return res.status(400).json({error: "Cookie not set"});
    if(!phoneNumber) return res.status(400).json({error: "Cookie not set"});

  }
  
  console.log('Received OTP:', otp);
  console.log('Cookie check - hashedOtp exists:', !!hashedOtp);
  console.log('Cookie check - phoneNumber exists:', !!phoneNumber);

  if (!otp || !hashedOtp || !phoneNumber) {
    console.log('Error: Missing required parameters');
    return res.status(400).json({ error: 'OTP and phone number are required' });
  }

  try {
    console.log('Attempting to decrypt stored OTP');
    const decryptedOtp = decrypt(hashedOtp);
    console.log('OTP decrypted successfully',);

    // Compare the OTPs
    console.log('Comparing OTPs...');
    if (otp === decryptedOtp) {
      console.log('OTP matched successfully');
      
      // Clear cookies
      res.clearCookie('hashedOtp');
      res.clearCookie('phoneNumber');
      console.log('Cleared OTP cookies');

      // Find or create customer
      console.log('Looking up customer with phone number:', phoneNumber);
      let customer = await Customer.findOne({ phoneNumber });
      
      if (!customer) {
        console.log('Customer not found, creating new customer');
        customer = await Customer.create({ 
          phoneNumber
        });
        console.log('New customer created:', customer._id);
      } else {
        console.log('Existing customer found:', customer._id);
      }

      // Generate JWT token
      console.log('Generating JWT token');
      const token = generateToken({ 
        id: customer._id,
        phoneNumber: customer.phoneNumber
      });
      console.log('JWT token generated successfully');

      // Set JWT cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000
      });
      console.log('JWT token stored in cookie');

      console.log('=== verifyOtp function completed successfully ===');
      return res.status(200).json({ 
        success: true, 
        message: 'OTP verified successfully',
        token,
        customer: {
          id: customer._id,
          phoneNumber: customer.phoneNumber
        }
      });
    } else {
      console.log('OTP verification failed - OTP mismatch');
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid OTP' 
      });
    }
  } catch (error) {
    console.error('=== Error in verifyOtp function ===');
    console.error('Error details:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to verify OTP', 
      details: error.message 
    });
  }
};
