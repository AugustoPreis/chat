const bcrypt = require('bcrypt');
const crypto = require('crypto');

function hash(value) {
  return bcrypt.hashSync(value, 10);
}

function encrypt(decrypted) {
  const iv = random(8);
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    process.env.AES_256_CBC_KEY,
    iv,
  );

  const encrypted = cipher
    .update(decrypted, 'utf8', 'hex')
    .concat(cipher.final('hex'));

  return { encrypted, decrypted, iv };
}

function decrypt(encrypted, iv) {
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    process.env.AES_256_CBC_KEY,
    iv,
  );

  return decipher
    .update(encrypted, 'hex', 'utf8')
    .concat(decipher.final('utf8'));
}

function compare(decrypted, encrypted) {
  return bcrypt.compareSync(decrypted, encrypted);
}

function random(length = 10) {
  return crypto.randomBytes(length).toString('hex');
}

module.exports = { hash, encrypt, decrypt, compare, random }; 