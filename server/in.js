const email = "sujibala7639@gmail.com";
const seed = "123456";
const crypto = require('crypto');
function encryptEmail(email, seed) {
  const key = crypto.createHash('sha256').update(seed).digest();
  const iv = Buffer.alloc(16, 0);

  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(email, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return encrypted;
}

const encryptedEmail = encryptEmail(email, seed); // from your tested function
const encodedEmail = encodeURIComponent(encryptedEmail);

// Now hit:
console.log(encodedEmail)
const url = `http://localhost:5000/api/user-by-email?email=${encodedEmail}&seed=${seed}`;
