import crypto from "crypto";

/**
 * Hashes a password using PBKDF2 with a random salt.
 * Returns the hash in the format `salt:hash`.
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

/**
 * Verifies a password against a stored `salt:hash` string.
 */
export function verifyPassword(password: string, storedValue: string): boolean {
  try {
    const [salt, originalHash] = storedValue.split(":");
    if (!salt || !originalHash) return false;
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
    return hash === originalHash;
  } catch (error) {
    return false;
  }
}
