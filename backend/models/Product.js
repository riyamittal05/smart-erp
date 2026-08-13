const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    business: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Business",
  required: true,
  index: true,
},

    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: 100,
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      maxlength: 50,
    },

    purchasePrice: {
      type: Number,
      required: [true, "Purchase price is required"],
      min: 0,
    },

    sellingPrice: {
      type: Number,
      required: [true, "Selling price is required"],
      min: 0,
    },

    quantity: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    supplier: {
      type: String,
      required: [true, "Supplier is required"],
      trim: true,
      maxlength: 100,
    },

    productCode: {
      type: String,
      required: [true, "Product code is required"],
      trim: true,
      uppercase: true,
    },

    reorderLevel: {
      type: Number,
      default: 5,
      min: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

// Product Code should be unique per user
productSchema.index({ business: 1, productCode: 1 }, { unique: true });

// Dashboard Helper
productSchema.virtual("stockStatus").get(function () {
  if (this.quantity === 0) return "Out of Stock";

  if (this.quantity <= this.reorderLevel) {
    return "Low Stock";
  }

  return "In Stock";
});

module.exports = mongoose.model("Product", productSchema);