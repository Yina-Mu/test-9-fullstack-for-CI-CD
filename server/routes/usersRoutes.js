// routes/userRoute.js
const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authenticate");
const { getAllSafeUsers } = require("../controllers/usersController");

router.get("/", authenticate, getAllSafeUsers);

module.exports = router;
