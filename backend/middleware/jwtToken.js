const jwt = require("jsonwebtoken");
const Merchant = require("../src/models/merchantModel");


const jwtToken = async (req, res, next) => {
  let token = req.cookies.token;
  console.log(token);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).send({
        error: "Not authorized, token failed"
      });
    }
    const userData = await Merchant.findById(decoded.id)
    if (!userData) {
      return res.status(404).send({
        error: "User not found",
      });
    }
    if(!userData.isActive) return res.status(403).json({error: "you are blocked by admin."})
    req.user = userData;
    next();
  } catch (err) {
    return res.status(401).send({
      error: "Not authorized, token failed"
    });
  }
};

module.exports = jwtToken;
