const crypto = require("crypto");

// Encryption secret key (store securely, e.g., in environment variables)

const IV_LENGTH = 16; // Initialization vector length
// Function to encrypt data
const encrypt = (text) => {
  
  console.log("Crypto key:",  process.env.CRYPTO_ENCRYPTION_KEY);
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(process.env.CRYPTO_KEY, Buffer.from(process.env.CRYPTO_ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
};

// Function to decrypt data
const decrypt = (encryptedText) => {
  const [iv, encrypted] = encryptedText.split(":");
  const decipher = crypto.createDecipheriv(process.env.process.env.CRYPTO_KEY, Buffer.from(process.env.CRYPTO_ENCRYPTION_KEY), Buffer.from(iv, "hex"));
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

module.exports = {encrypt, decrypt}