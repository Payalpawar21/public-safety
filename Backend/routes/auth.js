const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// EMAIL CONFIG
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
  }
});

// ================= USER REGISTER =================
router.post("/register", async (req, res) => {
  try {
    const existingUser = await User.findOne({
      email: req.body.email.toLowerCase()
    });

    if (existingUser) {
      return res.json({
        message: "Email already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(
      req.body.password,
      10
    );

    const user = new User({
      name: req.body.name,
      email: req.body.email.toLowerCase(),
      password: hashedPassword,
      phone: req.body.phone,
      role: "user"
    });

    await user.save();

    res.json({
      message: "User Registered"
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Registration Failed"
    });
  }
});

// ================= VOLUNTEER REGISTER =================
router.post("/volunteer-register", async (req, res) => {
  try {

    const existingVolunteer = await User.findOne({
      email: req.body.email.toLowerCase()
    });

    if (existingVolunteer) {
      return res.json({
        message: "Email already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(
      req.body.password,
      10
    );

    const volunteer = new User({
      name: req.body.name,
      email: req.body.email.toLowerCase(),
      password: hashedPassword,
      phone: req.body.phone,
      role: "volunteer"
    });

    await volunteer.save();

    res.json({
      message: "Volunteer Registered"
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Volunteer Registration Failed"
    });
  }
});

// ================= ADMIN REGISTER =================
router.post("/admin-register", async (req, res) => {
  try {

    const hashedPassword = await bcrypt.hash(
      req.body.password,
      10
    );

    const admin = new User({
      name: req.body.name,
      email: req.body.email.toLowerCase(),
      password: hashedPassword,
      phone: req.body.phone,
      role: "admin"
    });

    await admin.save();

    res.json({
      message: "Admin Registered"
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Admin Registration Failed"
    });
  }
});

// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {

    console.log("Login Request:", req.body);

    const user = await User.findOne({
      email: req.body.email.toLowerCase()
    });

    if (!user) {
      return res.json({
        message: "User not found"
      });
    }

    const isMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isMatch) {
      return res.json({
        message: "Wrong password"
      });
    }

    res.json({
      message: "Login Success",
      user
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Login Failed"
    });
  }
});

// ================= FORGOT PASSWORD =================
router.post("/forgot-password", async (req, res) => {
  try {

    const { email } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase()
    });

    if (!user) {
      return res.json({
        message: "User not found"
      });
    }

    const token = crypto
      .randomBytes(32)
      .toString("hex");

    user.resetToken = token;

    user.resetTokenExpire =
      Date.now() + 10 * 60 * 1000;

    await user.save();

    const resetLink =
`https://public-safety-cd66thkra-payalpawar21s-projects.vercel.app/reset-password/${token}`;

    await transporter.sendMail({
      to: email,
      subject: "Reset Password",
      html: `
        <h2>Password Reset</h2>

        <p>
          Click below link to reset password
        </p>

        <a href="${resetLink}">
          ${resetLink}
        </a>
      `
    });

    res.json({
      message: "Reset link sent to email"
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Failed to send reset email"
    });
  }
});

// ================= RESET PASSWORD =================
router.post("/reset-password/:token", async (req, res) => {
  try {

    const user = await User.findOne({
      resetToken: req.params.token,
      resetTokenExpire: {
        $gt: Date.now()
      }
    });

    if (!user) {
      return res.json({
        message: "Token Expired"
      });
    }

    const hashedPassword = await bcrypt.hash(
      req.body.password,
      10
    );

    user.password = hashedPassword;

    user.resetToken = undefined;
    user.resetTokenExpire = undefined;

    await user.save();

    res.json({
      message: "Password Updated Successfully"
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Password Reset Failed"
    });
  }
});

// ================= UPDATE PROFILE =================
router.put("/update/:id", async (req, res) => {
  try {

    const updatedUser =
      await User.findByIdAndUpdate(
        req.params.id,
        {
          name: req.body.name,
          phone: req.body.phone,
          emergencyContacts:
            req.body.emergencyContacts,
          photo: req.body.photo
        },
        {
          new: true
        }
      );

    res.json(updatedUser);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Profile Update Failed"
    });
  }
});

module.exports = router;