const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
counterSchema.index({ user: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("Counter", counterSchema);