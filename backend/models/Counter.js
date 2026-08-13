const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema(
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
    },

    sequence: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Ek user ke liye ek hi counter name hoga
counterSchema.index({ business: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("Counter", counterSchema);