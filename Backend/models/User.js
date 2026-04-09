const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  resetToken: String,
resetTokenExpire: Date,
  phone: String, 
  role: {
    type: String,
    default: "user"
  },
  emergencyContacts: [
    {
       name: String,
       phone: String

    }
  ]

  
});

module.exports = mongoose.model("User", userSchema);