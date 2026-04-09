const router = require("express").Router();
const Alert = require("../models/Alert");

// 🔥 Twilio setup
const twilio = require("twilio");

const client = require("twilio")(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH
);

// 🚨 Send Alert + SMS
router.post("/send", async (req, res) => {
  const { userId, location } = req.body;

  try {
    // 🔥 Save alert in DB
    const alert = new Alert({
      userId,
      location
    });

    await alert.save();

    // 🔥 Populate user (name, phone)
    const populatedAlert = await alert.populate("userId");

    // 🔥 SOCKET EMIT (REAL-TIME)
    const io = req.app.get("io");
    io.emit("newAlert", populatedAlert);

    // 📲 Send SMS
    await client.messages.create({
  body: `🚨 EMERGENCY! I need help. My location: ${location}`,
  from: "+1XXXXXXXXXX", // Twilio number (IMPORTANT)
  to: "+919876543210"   // 👈 correct format
});

    res.json("Alert + SMS + Real-time Sent");

  } catch (err) {
    console.log(err);
    res.status(500).json("Error sending alert");
  }
});

router.post("/", async (req, res) => {
  const { userId, location } = req.body;

  // 🔥 If alert already exists → update
  let alert = await Alert.findOne({ userId });

  if (alert) {
    alert.location = location;
    alert.time = new Date();
    await alert.save();
  } else {
    alert = new Alert({ userId, location });
    await alert.save();
  }

  res.json({ message: "Location Updated" });
});



// GET all alerts
router.get("/", async (req, res) => {
  const alerts = await Alert.find()
   .populate("userId", "name phone email")
    .sort({ time: -1 });
  res.json(alerts);
});



module.exports = router;