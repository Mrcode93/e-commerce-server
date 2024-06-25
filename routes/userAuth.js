const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
router.post("/login", (req, res) => {
  const { email = "admin", password = "admin" } = req.body;

  if (email === "admin" && password === "admin") {
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Set the token in a cookie

    res.cookie("token", token, { httpOnly: true });
    res.status(200).json({ message: "Logged in successfully", token });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
});

module.exports = router;
