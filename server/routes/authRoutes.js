// routes/authRoute.js
// authRoute 只负责分发auth routes，不负责处理逻辑
const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");

// Q2
router.post("/register", register);

// Q3
router.post("/login", login);

module.exports = router;
