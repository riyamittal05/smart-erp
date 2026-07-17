const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    shopName: {
      type: String,
      required: true,
      trim: true,
    },

    ownerName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
     maxlength: 15,
minlength: 10,
    },

  email: {
  type: String,
  trim: true,
  lowercase: true,
},

    address: {
      type: String,
      required: true,
    },

    gstNumber: {
      type: String,
      default: "",
    },

    invoicePrefix: {
      type: String,
      default: "INV",
    },

    currency: {
      type: String,
      default: "₹",
    },

    logo: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Business", businessSchema);