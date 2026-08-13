const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
   business: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Business",
  required: true,
  index: true,
},

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Customer", customerSchema);