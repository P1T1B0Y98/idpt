const crypto = require('crypto');

const IV_LENGTH = 16; // AES block size
function encrypt(text) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-128-cbc', Buffer.from(process.env.SECRET_KEY), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return Buffer.concat([iv, encrypted]).toString('base64');  // Base64 encode the combined buffer
}

function decrypt(text) {
    const input = Buffer.from(text, 'base64');  // Base64 decode the input
    const iv = input.slice(0, IV_LENGTH);
    const encryptedText = input.slice(IV_LENGTH);
    const decipher = crypto.createDecipheriv('aes-128-cbc', Buffer.from(process.env.SECRET_KEY), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString('utf-8'); // Specify UTF-8 encoding
}

module.exports = {
    encrypt,
    decrypt
};
