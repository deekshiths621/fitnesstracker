const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const UserRoutes = require("./routes/User.js");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true })); // for form data

app.use("/api/user/", UserRoutes);
// error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  
  // Log error details for debugging
  console.error(`[ERROR] Status: ${status}`);
  console.error(`[ERROR] Message: ${message}`);
  if (process.env.NODE_ENV !== "production") {
    console.error(`[ERROR] Stack: ${err.stack}`);
  }
  
  return res.status(status).json({
    success: false,
    status,
    message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
});

app.get("/", async (req, res) => {
  res.status(200).json({
    message: "Hello developers from GFG",
  });
});

const connectDB = () => {
  mongoose.set("strictQuery", true);
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => console.log("Connected to Mongo DB"))
    .catch((err) => {
      console.error("failed to connect with mongo");
      console.error(err);
    });
};

const startServer = async () => {
  try {
    connectDB();
    app.listen(8080, () => console.log("Server started on port 8080"));
  } catch (error) {
    console.log(error);
  }
};

startServer();
