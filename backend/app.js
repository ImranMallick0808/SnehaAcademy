const express = require("express");
const errorHandler = require("./middleware/error");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();

const path = require("path");//this

const allowedOrigins = [
  "http://localhost:5173", // For development
  "https://snehaacademy.org", // Production
    "https://www.snehaacademy.org",
];
  // Configure CORS
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Allow the origin
    }else {
      console.error(`Blocked by CORS: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  credentials: true, // Allow credentials (cookies, authorization headers)
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));


app.options("*", cors(corsOptions));






//routes import
const provateRoutes = require("./routes/privateRoutes");
const publicRoutes = require("./routes/publicRoutes");

app.use("/api/v1", provateRoutes);
app.use("/api/v1", publicRoutes);

if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../frontend/build");
  app.use(express.static(frontendPath));

  // Handle React routing, return all requests to React app
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
  //  res.sendFile(path.join(frontendPath, "index.html"));
  });
}


//middleware for error
app.use(errorHandler);
module.exports = app;
