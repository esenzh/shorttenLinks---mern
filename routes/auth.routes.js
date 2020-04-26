const { Router } = require("express");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const router = Router();

// /api/auth
router.post(
  "/register",
  [
    check("email", "Invalid type of email").isEmail(),
    check("password", "Minimum symbol of password is 6").isLength({ min: 6 }),
  ],

  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Invalid inputs during registration",
        });
      }

      const { email, password } = req.body;

      const candidate = await User.findOne({ email });
      if (candidate) {
        return res.status(400).json({ message: "This user exist" });
      }
      const hashedPassword = await bcrypt.hash(password, 5);
      const user = new User({ email, password: hashedPassword });
      await user.save();

      res.status(201).json({ message: "User created" });
    } catch (e) {
      res.status(500).json({ message: "Something went wrong, try again" });
    }
  }
);

router.post(
  "/login",
  [
    check("email", "Please, enter valid email").normalizeEmail().isEmail(),
    check("password", "Enter password").exists(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Invalid inputs during sign in",
        });
      }
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid password, try again" });
      }

      const token = jwt.sign
      (
          { userId: user._id },
          config.get('jwtSecretKey'),
          {expiresIn: '1h'}
      )

      res.json({token, userId: user._id})

    } catch (e) {
      res.status(500).json({ message: "Something went wrong, try again" });
    }
  }
);

module.exports = router;
