const mongoose = require("mongoose");

const saleItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    mrp: {
      
      type: Number,
      required: true,
      min: 0,
    },
    price: {
      
      type: Number,
      required: true,
      min: 0,
    },
    purchaseCost: {
     
      type: Number,
      required: true,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    profit: {

      type: Number,
      required: true,
      default: 0,
    },
    discount: {
     
      type: Number,
      required: true,
      default: 0,
    },
  },
  { _id: false }
);

const saleSchema = new mongoose.Schema(
  {
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
      index: true,
    },
    invoiceNumber: {
      type: Number,
      index: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    items: {
      type: [saleItemSchema],
      required: true,
      validate: {
        validator: function (items) {
          return items.length > 0;
        },
        message: "At least one product is required.",
      },
    },
    grandTotal: {
      type: Number,
      required: true,
      min: 0,
    },
    totalProfit: {
      type: Number,
      required: true,
      default: 0,
    },
    totalDiscount: {
      type: Number,
      required: true,
      default: 0,
    },
    paymentStatus: {
      type: String,
      enum: ["Paid", "Pending"],
      default: "Paid",
    },
  },
  { timestamps: true }
);

saleSchema.index({ business: 1, invoiceNumber: 1 }, { unique: true });

module.exports = mongoose.model("Sale", saleSchema);