const crypto = require('crypto');

function hash(value) {
  const salt = random(16);
  const hashValue = crypto
    .pbkdf2Sync(value, salt, 10000, 64, 'sha512')
    .toString('hex');

  return `${salt}:${hashValue}`;
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
  const [salt, hashValue] = encrypted.split(':');

  const hashDecrypted = crypto
    .pbkdf2Sync(decrypted, salt, 10000, 64, 'sha512')
    .toString('hex');

  return hashValue === hashDecrypted;
}

function random(length = 10) {
  return crypto.randomBytes(length).toString('hex');
}

module.exports = { hash, encrypt, decrypt, compare, random }; 