const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const CryptoJS = require('crypto-js');
const AES_KEY = process.env.AES_KEY


function verifyToken(req, res, next) {
  const token = req.header("authorization")
  
  if (!token || token === null)
    return res.status(400).json({ message: "Token is not provided" });

  const decodedToken = Buffer.from(token, 'base64').toString('utf-8');

  const decryptedBytes = CryptoJS.AES.decrypt(decodedToken, AES_KEY);

  if (!decryptedBytes) return res.status(400).json({ message: "..." });

  const jwtToken = decryptedBytes.toString(CryptoJS.enc.Utf8);

  jwt.verify(jwtToken, JWT_SECRET, (err, decoded) => {
    if (err)
      return res.status(401).json({ message: "Failed to authenticate token" });

    req.user = decoded;
    next();
  });
}

module.exports = verifyToken;
