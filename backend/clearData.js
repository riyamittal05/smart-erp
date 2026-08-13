require("dotenv").config();
const mongoose = require("mongoose");

const clear = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected. Clearing old data...");

  await mongoose.connection.collection("products").deleteMany({});
  await mongoose.connection.collection("customers").deleteMany({});
  await mongoose.connection.collection("sales").deleteMany({});
  await mongoose.connection.collection("counters").deleteMany({});

  console.log("Done! Old data cleared.");
  process.exit(0);
};

clear();