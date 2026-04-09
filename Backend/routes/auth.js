const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
 auth: {
  user: process.env.EMAIL,
  pass: process.env.EMAIL_PASS
}
});
const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Register
router.post("/register", async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const user = new User({
    name: req.body.name,
   email: req.body.email.toLowerCase(),
    password: hashedPassword,
    phone: req.body.phone 
  });

  await user.save();
  res.json("User Registered");
});



router.post("/admin-login", async (req, res) => {
  console.log("Register Data:", req.body);
  const user = await User.findOne({
    email: req.body.email.toLowerCase()
  });

  if (!user) return res.json({ message: "Admin not found" });

  if (user.role !== "admin") {
    return res.json({ message: "Not an admin" });
  }

  const isMatch = await bcrypt.compare(req.body.password, user.password);

  if (!isMatch) return res.json({ message: "Wrong password" });

  res.json({ message: "Admin Login Success", user });
});

// Admin Login
router.post("/admin-login", (req, res) => {
  const { email, password } = req.body;

  if (
    email.toLowerCase() === "admin@gmail.com" &&
    password === "admin123"
  ) {
    return res.json({ success: true });
  }

  res.json({ success: false, message: "Invalid Admin Credentials" });
});

// Login
router.post("/login", async (req, res) => {

  console.log("Login Request:", req.body);

  const user = await User.findOne({ email: req.body.email });

  console.log("User Found:", user); // 🔥 ADD THIS

  if (!user) return res.json("User not found");

  const isMatch = await bcrypt.compare(req.body.password, user.password);

  console.log("Password Match:", isMatch); // 🔥 ADD THIS

  if (!isMatch) return res.json("Wrong password");

  res.json({ message: "Login Success", user });
});

const crypto = require("crypto");

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.json({ message: "User not found" });

  const token = crypto.randomBytes(32).toString("hex");

  user.resetToken = token;
  user.resetTokenExpire = Date.now() + 10 * 60 * 1000;

  await user.save();

  const resetLink = `http://localhost:3000/reset-password/${token}`;

  await transporter.sendMail({
    to: email,
    subject: "Reset Password",
    html: `
      <h3>Password Reset</h3>
      <p>Click below link to reset your password:</p>
      <a href="${resetLink}">${resetLink}</a>
    `
  });

  res.json({ message: "📧 Reset link sent to email" });
});

// 🔁 RESET PASSWORD


router.post("/reset-password/:token", async (req, res) => {
  const { password } = req.body;

  const user = await User.findOne({
    resetToken: req.params.token,
    resetTokenExpire: { $gt: Date.now() }
  });

  if (!user) return res.json({ message: "❌ Token expired" });

  const hashed = await bcrypt.hash(password, 10);

  user.password = hashed;
  user.resetToken = undefined;
  user.resetTokenExpire = undefined;

  await user.save();

  res.json({ message: "✅ Password updated successfully" });
});

// Admin Register
router.post("/admin-register", async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const admin = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
    phone: req.body.phone,
    role: "admin" // 🔥 important
  });

  await admin.save();
  res.json("Admin Registered");
});

// Admin Login
router.post("/admin-login", async (req, res) => {
  const user = await User.findOne({
    email: req.body.email.toLowerCase()
  });

  if (!user) return res.json({ message: "Admin not found" });

  if (user.role !== "admin") {
    return res.json({ message: "Not an admin" });
  }

  const isMatch = await bcrypt.compare(req.body.password, user.password);

  if (!isMatch) return res.json({ message: "Wrong password" });

  res.json({ message: "Admin Login Success", user });
});


// 🔥 Volunteer Register
router.post("/volunteer-register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const volunteer = new User({
      name: req.body.name,
      email: req.body.email.toLowerCase(),
      password: hashedPassword,
      phone: req.body.phone,
      role: "volunteer"
    });

    await volunteer.save();

    res.json("Volunteer Registered");
  } catch (err) {
    res.status(500).json("Error registering volunteer");
  }
});


router.put("/update/:id", async (req, res) => {
  try {
    console.log("BODY DATA:", req.body); // 🔥 check incoming data

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        phone: req.body.phone,
        emergencyContacts: req.body.emergencyContacts
      },
      { returnDocument: "after" }
    );

    console.log("UPDATED USER:", user); // 🔥 check saved data

    res.json(user);

  } catch (err) {
    console.log(err);
    res.status(500).json("Error updating user");
  }
});
module.exports = router;