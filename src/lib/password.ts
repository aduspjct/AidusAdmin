/**
 * Password hashing utilities matching Flutter implementation
 * 
 * Flutter equivalent:
 * - generateSalt: Random.secure() + base64Url.encode
 * - hashPassword: SHA-256(password + salt) -> hex string
 */

/**
 * Generate a random salt using secure random bytes
 * @param length - Length of salt in bytes (default: 16)
 * @returns Base64Url encoded salt string
 */
export function generateSalt(length: number = 16): string {
  // Generate random bytes
  const saltBytes = new Uint8Array(length);
  crypto.getRandomValues(saltBytes);
  
  // Convert to base64Url (matching Flutter's base64Url.encode)
  // Base64Url uses - and _ instead of + and /, and no padding
  // Convert Uint8Array to string for btoa
  const binaryString = String.fromCharCode.apply(null, Array.from(saltBytes));
  let base64 = btoa(binaryString);
  // Convert to base64Url format
  base64 = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  
  return base64;
}

/**
 * Hash password using SHA-256 + salt
 * @param password - Plain text password
 * @param salt - Base64Url encoded salt
 * @returns Hexadecimal hash string
 */
export async function hashPassword(password: string, salt: string): Promise<string> {
  // Concatenate password + salt (matching Flutter: password + salt)
  const combined = password + salt;
  
  // Encode to UTF-8 bytes
  const encoder = new TextEncoder();
  const data = encoder.encode(combined);
  
  // Hash with SHA-256
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  
  // Convert to hex string (matching Flutter's digest.toString())
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
}
