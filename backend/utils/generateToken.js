const jwt = require("jsonwebtoken")
// Generate JWT token

const generateToken = (data) => {
    const token = jwt.sign( data, process.env.JWT_SECRET);
    return token;
    // return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  };

module.exports = generateToken