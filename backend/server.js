const app = require("./app");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDataBase = require("./config/database");
const cloudinary = require("cloudinary").v2;
const resetPayment = require ("./middleware/updatePayments");



//Handling uncaught exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shuting Down the Server due to Uncaught Exception");

  process.exit(1);
});

//config
dotenv.config({ path: "backend/config/config.env" });

//Connecting to DB
connectDataBase();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const server = app.listen(process.env.PORT, () => {
  console.log(`Server is run on http://localhost${process.env.PORT}`);
});
 resetPayment()
//unhandle promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to Undandle Promise Rejection");

  server.close(() => {
    process.exit(1);
  });
});  
