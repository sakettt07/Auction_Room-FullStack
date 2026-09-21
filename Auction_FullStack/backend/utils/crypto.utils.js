import crypto from "crypto";

const ALGORITHM = "aes-256-cbc";
// Derive a 32-byte key from JWT_SECRET
const getSecretKey = () => {
  const secret = process.env.JWT_SECRET || "auctionspace_secure_recovery_key_32b!";
  return crypto.scryptSync(secret, "auction_salt_recovery", 32);
};

export const encryptPassword = (text) => {
  if (!text) return "";
  try {
    const iv = crypto.randomBytes(16);
    const key = getSecretKey();
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return `${iv.toString("hex")}:${encrypted}`;
  } catch (error) {
    console.error("Encryption failed:", error);
    return "";
  }
};

export const decryptPassword = (encryptedText) => {
  if (!encryptedText || !encryptedText.includes(":")) return null;
  try {
    const [ivHex, encrypted] = encryptedText.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const key = getSecretKey();
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
};
