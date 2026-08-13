require("dotenv").config();
const mongoose = require("mongoose");

const clear = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected. Clearing all data...");

  await mongoose.connection.collection("products").deleteMany({});
  await mongoose.connection.collection("customers").deleteMany({});
  await mongoose.connection.collection("sales").deleteMany({});
  await mongoose.connection.collection("counters").deleteMany({});
  await mongoose.connection.collection("businesses").deleteMany({});
  await mongoose.connection.collection("users").deleteMany({});

  console.log("Done! All data cleared — database is completely fresh.");
  process.exit(0);
};

clear();