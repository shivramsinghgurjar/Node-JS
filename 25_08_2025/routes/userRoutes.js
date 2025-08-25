const express = require("express");
const router = express.Router();
const { registerUser } = require("../controller/userController");
const rateLimiter = require("../middlewares/rateLimiter");

// Apply rate limiter on this route
router.post("/register", rateLimiter, registerUser);

module.exports = router;
