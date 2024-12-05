const crypto = require("crypto");

const IV_LENGTH = 16;
const ENCRYPTION_ALGORITHM = 'aes-256-cbc'; // Define the algorithm

// Function to encrypt data
const encrypt = (text) => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    ENCRYPTION_ALGORITHM, 
    Buffer.from(process.env.CRYPTO_ENCRYPTION_KEY), 
    iv
  );
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
};

// Function to decrypt data
const decrypt = (encryptedText) => {
  const [iv, encrypted] = encryptedText.split(":");
  const decipher = crypto.createDecipheriv(
    ENCRYPTION_ALGORITHM, 
    Buffer.from(process.env.CRYPTO_ENCRYPTION_KEY), 
    Buffer.from(iv, "hex")
  );
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

module.exports = { encrypt, decrypt };