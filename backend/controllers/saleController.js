const Sale = require("../models/Sale");
const Product = require("../models/Product");
const Business = require("../models/Business");
const Counter = require("../models/Counter");
const PDFDocument=require("pdfkit");
const createSale = async (req, res) => {
  try {
const { customer, items, paymentStatus = "Paid" } = req.body;

 let saleItems = [];
let grandTotal = 0;

for (const item of items) {

    const existingProduct = await Product.findOne({
        _id: item.product,
        user: req.user.id,
        isActive: true,
    });

    if (!existingProduct) {
        return res.status(404).json({
            message: `${item.product} not found`,
        });
    }

    if (existingProduct.quantity < item.quantity) {
        return res.status(400).json({
            message: `${existingProduct.name} has insufficient stock`,
        });
    }

    const price = Number(existingProduct.sellingPrice);

    const total = price * Number(item.quantity);

    grandTotal += total;

    existingProduct.quantity -= item.quantity;

    await existingProduct.save();

    saleItems.push({
        product: existingProduct._id,
        quantity: item.quantity,
        price,
        total,
    });
}

const counter = await Counter.findOneAndUpdate(
  {
    name: "invoice",
    user: req.user.id,
  },
  {
    $inc: { sequence: 1 },
  },
  {
     returnDocument: "after",
    upsert: true,
  }
);


const sale = await Sale.create({
  user: req.user.id,
  invoiceNumber: counter.sequence,
  customer,
  items: saleItems,
  grandTotal,
  paymentStatus,
});

    res.status(201).json({
      message: "Sale created successfully",
      sale,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// get all sale
const getAllSales = async (req, res) => {
  try {
    const sales = await Sale.find({
      user: req.user.id,
    })
      .populate("customer", "name email")
    .populate({
    path:"items.product",
    select:"name category sellingPrice"
})
      .sort({ createdAt: -1 });

    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

//get single sales
const getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findOne({
      _id: req.params.id,
      user: req.user.id,
    })
      .populate("customer", "name email")
.populate({
    path:"items.product",
    select:"name category sellingPrice"
})
    if (!sale) {
      return res.status(404).json({
        message: "Sale not found",
      });
    }

    res.status(200).json(sale);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


//generate invoice pdf

const generateInvoice = async (req, res) => {
  try {
    const { saleId } = req.params;

    const sale = await Sale.findById(saleId)
      .populate("customer", "name email phone address")
    .populate({
    path:"items.product",
    select:"name category sellingPrice"
});

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: "Sale not found",
      });
    }

    const business = await Business.findOne({
      user: req.user.id,
    });

const invoiceNumber = `${
  business?.invoicePrefix || "INV"
}-${String(sale.invoiceNumber).padStart(4, "0")}`;

const currency = business?.currency === "₹" ? "Rs." : (business?.currency || "Rs.");

const formatCurrency = (amount) =>
  `${currency} ${Number(amount).toLocaleString("en-IN")}`;

    const doc = new PDFDocument({
      margin: 50,
      size: "A4",
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename=${invoiceNumber}.pdf`
    );

    doc.pipe(res);

    // ===========================
    // Business Details
    // ===========================

   // =====================================================
// PROFESSIONAL HEADER
// =====================================================

doc
.rect(40, 40, 515, 100)
  .fill("#1E3A8A");

doc
  .fillColor("white")
  .font("Helvetica-Bold")
  .fontSize(24)
  .text(business?.shopName || "SMART ERP", 55, 55);

doc
  .fontSize(11)
  .font("Helvetica")
  .text(`Owner : ${business?.ownerName || "N/A"}`, 55, 85);

doc.text(`Phone : ${business?.phone || "N/A"}`, 55, 100);

doc.text(`Email : ${business?.email || "N/A"}`, 220, 100);

doc.text(`GST : ${business?.gstNumber || "N/A"}`, 55, 115);

doc.fillColor("black");

doc.moveDown(5);

// =====================================================
// INVOICE TITLE
// =====================================================

doc
  .fontSize(22)
  .font("Helvetica-Bold")
.text("TAX INVOICE", 0, 180, {
  width: 595,
  align: "center",
});


doc
  .fontSize(11)
  .font("Helvetica")
  .text(
    `Date : ${new Date(sale.createdAt).toLocaleDateString("en-IN")}`,
    380,
    185
  );

doc
  .font("Helvetica-Bold")
  .text(`Invoice No : ${invoiceNumber}`, 380, 207
  );

doc
  .moveTo(50, 230)
  .lineTo(545, 230)
  .stroke();

   // =====================================================
// BILL TO & INVOICE DETAILS
// =====================================================

// Left Box - Customer Details
doc
  .rect(50, 245, 240, 120)
  .stroke("#CFCFCF");

doc
  .font("Helvetica-Bold")
  .fontSize(13)
  .text("BILL TO", 60, 260);

doc
  .font("Helvetica")
  .fontSize(11)
  .text(sale.customer?.name || "N/A", 60, 285);

doc.text(`Email : ${sale.customer?.email || "N/A"}`, 60, 305);

doc.text(`Phone : ${sale.customer?.phone || "N/A"}`, 60, 325);

doc.text(`Address : ${sale.customer?.address || "N/A"}`, 60, 345, {
  width: 210,
});

// Right Box - Invoice Details
doc
  .rect(315, 245, 230, 140)
  .stroke("#CFCFCF");

doc
  .font("Helvetica-Bold")
  .fontSize(13)
  .text("INVOICE DETAILS", 325, 260);

doc
  .font("Helvetica")
  .fontSize(11)
  .text(`Invoice No : ${invoiceNumber}`, 325, 285);

doc.text(
  `Invoice Date : ${new Date(sale.createdAt).toLocaleDateString("en-IN")}`,
  325,
  305
);

// Payment Status
doc
  .font("Helvetica")
  .fontSize(11)
  .fillColor("black")
  .text("Status :", 325, 325);

// Green PAID Badge
doc
  .roundedRect(385, 320, 70, 22, 5)
  .fill("#16A34A");

doc
  .fillColor("white")
  .font("Helvetica-Bold")
  .fontSize(10)
.text(
  sale.paymentStatus.toUpperCase(),
  400,
  327
);

doc.fillColor("black");

doc.text(
  `Currency : Rs.`,
  325,
  345
);
doc.text(
  `Payment Mode : Cash`,
  325,
  365
);

// Move Cursor
doc.y = 385;
// =====================================================
// PRODUCT TABLE
// =====================================================

const tableTop = 420;

const itemX = 55;
const categoryX = 220;
const qtyX = 340;
const priceX = 390;
const amountX = 475;

// Header Background
doc
  .rect(50, tableTop, 495, 28)
  .fill("#1E3A8A");

doc.fillColor("white");

doc.font("Helvetica-Bold").fontSize(11);

doc.text("Product", itemX, tableTop + 8);

doc.text("Category", categoryX, tableTop + 8);

doc.text("Qty", qtyX, tableTop + 8);

doc.text("Price", priceX, tableTop + 8);

doc.text("Amount", amountX, tableTop + 8);
doc.fillColor("black");

let rowY = tableTop + 43;

doc
  .rect(
    50,
    tableTop + 28,
    495,
    sale.items.length * 30 + 15
  )
  .stroke("#D1D5DB");

doc.font("Helvetica").fontSize(11);

sale.items.forEach((item) => {

  doc.text(
    item.product?.name || "-",
    itemX,
    rowY
  );

  doc.text(
    item.product?.category || "-",
    categoryX,
    rowY
  );

  doc.text(
    String(item.quantity),
    qtyX,
    rowY
  );

  doc.text(
    formatCurrency(item.price),
    priceX,
    rowY
  );

  doc.text(
    formatCurrency(item.total),
    amountX,
    rowY
  );

  rowY += 30;

});

doc.y = rowY + 20;
// =====================================================
// TOTAL SUMMARY
// =====================================================

const summaryTop =
tableTop +
sale.items.length * 30 +
40;

// Summary Box
doc
  .rect(335, summaryTop, 210, 90)
  .stroke("#D1D5DB");

// Sub Total
doc
  .font("Helvetica")
  .fontSize(11)
  .text("Sub Total", 350, summaryTop + 15);

doc.text(
  formatCurrency(sale.grandTotal),
  455,
  summaryTop + 15,
  {
    width: 60,
    align: "right",
  }
);

// GST
doc.text("GST", 350, summaryTop + 38);

doc.text(
  formatCurrency(0),
  455,
  summaryTop + 38,
  {
    width: 60,
    align: "right",
  }
);

// Divider
doc
  .moveTo(345, summaryTop + 60)
  .lineTo(535, summaryTop + 60)
  .stroke();

// Grand Total
doc
  .font("Helvetica-Bold")
  .fontSize(13)
  .text("GRAND TOTAL", 350, summaryTop + 68);

doc.text(
  formatCurrency(sale.grandTotal),
  430,
  summaryTop + 68,
  {
    width: 85,
    align: "right",
  }
);

// =====================================================
// FOOTER
// =====================================================

doc
.moveTo(50, summaryTop + 120)
.lineTo(545, summaryTop + 120)
  .strokeColor("#D1D5DB")
  .stroke();

doc
  .fillColor("#1E3A8A")
  .font("Helvetica-Bold")
  .fontSize(15)
  .text("Thank You For Your Business!", 50, summaryTop + 135, {
    align: "center",
  });

doc
  .fillColor("black")
  .font("Helvetica")
  .fontSize(10)
  .text(
    "This is a computer generated invoice and does not require a signature.",
    50,
  summaryTop + 160,
    {
      align: "center",
    }
  );

doc
  .font("Helvetica")
  .fontSize(10)
  .text(
    `Generated by ${business?.shopName || "Smart ERP"}`,
    50,
   summaryTop + 178,
    {
      align: "center",
    }
  );

doc.end();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error generating invoice",
      error: error.message,
    });
  }
};
module.exports={createSale,getAllSales,getSaleById,generateInvoice,};