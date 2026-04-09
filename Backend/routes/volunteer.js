const router = require("express").Router();
const Alert = require("../models/Alert");

// GET pending alerts
router.get("/alerts", async (req, res) => {
  try {
    const alerts = await Alert.find()
      .populate("userId", "name phone")
      .sort({ createdAt: -1 });

    res.json(alerts);

  } catch (err) {
    res.status(500).json({
      message: "Error fetching alerts"
    });
  }
});

// ACCEPT alert
router.post("/accept/:id", async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);

    if (!alert) return res.status(404).json("Alert not found");

    alert.status = "accepted";
    alert.responderId = req.body.volunteerId;

    await alert.save();

    res.json("Alert Accepted");
  } catch (err) {
    res.status(500).json("Error accepting alert");
  }
});

// COMPLETE alert
router.post("/complete/:id", async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);

    if (!alert) return res.status(404).json("Alert not found");

    alert.status = "completed";

    await alert.save();

    res.json("Alert Completed");
  } catch (err) {
    res.status(500).json("Error completing alert");
  }
});

module.exports = router;