const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    seenBy: [
      {
        type: String,
        required: false,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", NotificationSchema);
