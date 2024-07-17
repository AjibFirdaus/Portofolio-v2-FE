const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const verifyToken = require("../helper/verifyToken");
const CryptoJS = require("crypto-js");
const { limiterForLogin } = require("../helper/Limiter");

const prisma = new PrismaClient();
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;
const AES_KEY = process.env.AES_KEY;

// login
router.post("/login", limiterForLogin, async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ message: "please fill all fields" });

  try {
    const user = await prisma.admin.findUnique({
      where: { username: username },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign(
      {
        id: user.id,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    const encryptedToken = CryptoJS.AES.encrypt(token, AES_KEY).toString();

    const finalToken = Buffer.from(encryptedToken).toString("base64");

    res.json({
      token: finalToken,
      message: `Login successful, Welcome ${user.username}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Cek User token
router.get("/check-login", verifyToken, async (req, res) => {
  const { id } = req.user;
  
  res.status(200).json({ message: "✅", isLoggedIn: true });
});

module.exports = router;
