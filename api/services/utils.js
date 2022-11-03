const mysql = require('mysql2')
const connection = mysql.createConnection(process.env.DATABASE_URL)
const crypto = require('crypto');


const algorithm = 'aes-256-ctr';
const ENCRYPTION_KEY = Buffer.from('FoCKvdLslUuB4y3EZlKate7XGottHski1LmyqJHvUhs=', 'base64');
const IV_LENGTH = 16;

/**
 * Takes a plain text string and encrypts it.
 * @param {string} text - Plain text to encrypt.
 */
function encrypt(text) {
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv(algorithm, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

/**
 * Takes a encrypted text string and decrypts it.
 * @param {string} text - Encrypted  text to decrypt.
 */
function decrypt(text) {
    let textParts = text.split(':');
    let iv = Buffer.from(textParts.shift(), 'hex');
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

const createUserTableSql = `CREATE TABLE users (
    id INT AUTO_INCREMENT,
    PRIMARY KEY (id),
    email VARCHAR(240) UNIQUE,
    password VARCHAR(240),
    firstname VARCHAR(240),
    lastname VARCHAR(240)
)`

async function createUserTable(){
    let result = await connection.promise().query(createUserTableSql)
    console.log("Database created", result)
}


module.exports = {
    connection, createUserTable, encrypt, decrypt
}