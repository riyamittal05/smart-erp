const Sale = require("../models/Sale");
const Product = require("../models/Product");
const Business = require("../models/Business");
const Counter = require("../models/Counter");
const Customer = require("../models/Customer");
const PDFDocument = require("pdfkit");

const createSale = async (req, res) => {
  try {
    const { customer, items, paymentStatus = "Paid" } = req.body;

    const existingCustomer = await Customer.findOne({
      _id: customer,
      business: req.user.businessId,
    });

    if (!existingCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    let saleItems = [];
    let grandTotal = 0;
    let totalProfit = 0;
    let totalDiscount = 0;

    for (const item of items) {
      const existingProduct = await Product.findOne({
        _id: item.product,
        business: req.user.businessId,
        isActive: true,
      });

      if (!existingProduct) {
        return res.status(404).json({ message: `${item.product} not found` });
      }

      if (existingProduct.quantity < item.quantity) {
        return res.status(400).json({
          message: `${existingProduct.name} has insufficient stock`,
        });
      }

      const mrp = Number(existingProduct.sellingPrice);
      const purchaseCost = Number(existingProduct.purchasePrice);

      const price =
        item.price !== undefined && item.price !== null && item.price !== ""
          ? Number(item.price)
          : mrp;

      if (price < 0) {
        return res.status(400).json({ message: "Price cannot be negative" });
      }

      const quantity = Number(item.quantity);
      const total = price * quantity;
      const profit = (price - purchaseCost) * quantity;
      const discount = (mrp - price) * quantity;

      grandTotal += total;
      totalProfit += profit;
      totalDiscount += discount;

      existingProduct.quantity -= quantity;
      await existingProduct.save();

      saleItems.push({
        product: existingProduct._id,
        quantity,
        mrp,
        price,
        purchaseCost,
        total,
        profit,
        discount,
      });
    }

    const counter = await Counter.findOneAndUpdate(
      { name: "invoice", business: req.user.businessId },
      { $inc: { sequence: 1 } },
      { returnDocument: "after", upsert: true }
    );

    const sale = await Sale.create({
      business: req.user.businessId,
      invoiceNumber: counter.sequence,
      customer,
      items: saleItems,
      grandTotal,
      totalProfit,
      totalDiscount,
      paymentStatus,
    });

    res.status(201).json({
      message: "Sale created successfully",
      sale,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const getAllSales = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const sales = await Sale.find({ business: req.user.businessId })
      .populate("customer", "name email")
      .populate({ path: "items.product", select: "name category sellingPrice" })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Sale.countDocuments({ business: req.user.businessId });

    res.status(200).json({
      sales,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalSales: total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findOne({
      _id: req.params.id,
      business: req.user.businessId,
    })
      .populate("customer", "name email")
      .populate({ path: "items.product", select: "name category sellingPrice" });

    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    res.status(200).json(sale);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const generateInvoice = async (req, res) => {
  try {
    const { saleId } = req.params;

    const sale = await Sale.findOne({
      _id: saleId,
      business: req.user.businessId,
    })
      .populate("customer", "name email phone address")
      .populate({
        path: "items.product",
        select: "name category sellingPrice",
      });

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: "Sale not found",
      });
    }

    const business = await Business.findOne({
      _id: req.user.businessId,
    });

    const invoiceNumber = `${business?.invoicePrefix || "INV"}-${String(
      sale.invoiceNumber
    ).padStart(4, "0")}`;

    const currencySymbol =
      business?.currency === "₹"
        ? "Rs."
        : business?.currency || "Rs.";

    const formatCurrency = (amount) =>
      `${currencySymbol} ${Number(amount || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;

    const doc = new PDFDocument({
      margin: 0,
      size: "A4",
      bufferPages: true,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename=${invoiceNumber}.pdf`
    );

    doc.pipe(res);

    // =====================================================
    // COLORS
    // =====================================================

    const INK = "#14213D";
    const ACCENT = "#F5A623";
    const ACCENT_DARK = "#D4890F";
    const SUCCESS = "#1F7A4D";
    const MUTED = "#6B7280";
    const LINE = "#E4E6ED";
    const TINT = "#FBF3E3";

    // =====================================================
    // PAGE SETTINGS
    // =====================================================

    const PAGE_WIDTH = 595;
    const PAGE_HEIGHT = 842;

    const MARGIN = 46;
    const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

    // =====================================================
    // TABLE COLUMNS
    // =====================================================

    const colProduct = MARGIN;

    const colQty = MARGIN + 220;

    const colMrp = MARGIN + 270;

    const colPrice = MARGIN + 345;

    // AMOUNT COLUMN
    // Wider + right padding for better appearance

    const amountWidth = 115;

    const amountRightPadding = 10;

    const colTotal =
      MARGIN +
      CONTENT_WIDTH -
      amountWidth -
      amountRightPadding;

    // =====================================================
    // TABLE HEADER
    // =====================================================

    const drawTableHeader = (yy) => {
      doc
        .rect(
          MARGIN,
          yy,
          CONTENT_WIDTH,
          26
        )
        .fill(INK);

      doc
        .fillColor("#fff")
        .font("Helvetica-Bold")
        .fontSize(9);

      // PRODUCT

      doc.text(
        "PRODUCT",
        colProduct + 16,
        yy + 9,
        {
          lineBreak: false,
        }
      );

      // QTY

      doc.text(
        "QTY",
        colQty,
        yy + 9,
        {
          width: 40,
          align: "right",
          lineBreak: false,
        }
      );

      // MRP

      doc.text(
        "MRP",
        colMrp,
        yy + 9,
        {
          width: 60,
          align: "right",
          lineBreak: false,
        }
      );

      // PRICE

      doc.text(
        "PRICE",
        colPrice,
        yy + 9,
        {
          width: 60,
          align: "right",
          lineBreak: false,
        }
      );

      // AMOUNT

      doc.text(
        "AMOUNT",
        colTotal,
        yy + 9,
        {
          width: amountWidth,
          align: "right",
          lineBreak: false,
        }
      );

      doc.fillColor("#000");

      return yy + 26;
    };

    // =====================================================
    // HEADER
    // =====================================================

    doc
      .rect(
        0,
        0,
        PAGE_WIDTH,
        8
      )
      .fill(ACCENT);

    // SHOP NAME

    doc
      .font("Helvetica-Bold")
      .fontSize(28)
      .fillColor(INK)
      .text(
        business?.shopName || "Smart ERP",
        MARGIN,
        34,
        {
          width: CONTENT_WIDTH,
          align: "center",
        }
      );

    // ADDRESS

    doc
      .font("Helvetica")
      .fontSize(9.5)
      .fillColor(MUTED)
      .text(
        business?.address || "",
        MARGIN,
        68,
        {
          width: CONTENT_WIDTH,
          align: "center",
        }
      );

    // CONTACT DETAILS

    let contactLine = "";

    if (business?.phone) {
      contactLine += `Phone: ${business.phone}`;
    }

    if (business?.email) {
      contactLine += `   •   Email: ${business.email}`;
    }

    if (business?.gstNumber) {
      contactLine += `   •   GSTIN: ${business.gstNumber}`;
    }

    doc.text(
      contactLine,
      MARGIN,
      82,
      {
        width: CONTENT_WIDTH,
        align: "center",
      }
    );

    // HEADER LINE

    doc
      .moveTo(
        MARGIN,
        108
      )
      .lineTo(
        MARGIN + CONTENT_WIDTH,
        108
      )
      .strokeColor(ACCENT)
      .lineWidth(2)
      .stroke();

    // TAX INVOICE

    doc
      .font("Helvetica-Bold")
      .fontSize(13)
      .fillColor(ACCENT_DARK)
      .text(
        "TAX INVOICE",
        MARGIN,
        120,
        {
          width: CONTENT_WIDTH,
          align: "center",
        }
      );

    // =====================================================
    // CUSTOMER / INVOICE DETAILS
    // =====================================================

    let y = 155;

    // BILL TO

    doc
      .font("Helvetica-Bold")
      .fontSize(9)
      .fillColor(MUTED)
      .text(
        "BILL TO",
        MARGIN,
        y
      );

    doc
      .font("Helvetica-Bold")
      .fontSize(13)
      .fillColor(INK)
      .text(
        sale.customer?.name || "N/A",
        MARGIN,
        y + 15
      );

    let detailY = y + 33;

    doc
      .font("Helvetica")
      .fontSize(9.5)
      .fillColor(MUTED);

    if (sale.customer?.phone) {
      doc.text(
        `Phone: ${sale.customer.phone}`,
        MARGIN,
        detailY
      );

      detailY += 13;
    }

    if (sale.customer?.email) {
      doc.text(
        `Email: ${sale.customer.email}`,
        MARGIN,
        detailY
      );

      detailY += 13;
    }

    if (sale.customer?.address) {
      doc.text(
        sale.customer.address,
        MARGIN,
        detailY,
        {
          width: 260,
        }
      );
    }

    // =====================================================
    // INVOICE META
    // =====================================================

    const metaX = MARGIN + 300;

    // INVOICE NUMBER

    doc
      .font("Helvetica-Bold")
      .fontSize(9)
      .fillColor(MUTED)
      .text(
        "INVOICE NO",
        metaX,
        y
      );

    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .fillColor(INK)
      .text(
        invoiceNumber,
        metaX,
        y + 13
      );

    // DATE

    doc
      .font("Helvetica-Bold")
      .fontSize(9)
      .fillColor(MUTED)
      .text(
        "DATE",
        metaX,
        y + 35
      );

    doc
      .font("Helvetica")
      .fontSize(11)
      .fillColor(INK)
      .text(
        new Date(
          sale.createdAt
        ).toLocaleDateString("en-IN"),
        metaX,
        y + 48
      );

    // STATUS

    doc
      .font("Helvetica-Bold")
      .fontSize(9)
      .fillColor(MUTED)
      .text(
        "STATUS",
        metaX,
        y + 70
      );

    const isPaid =
      sale.paymentStatus === "Paid";

    doc
      .roundedRect(
        metaX,
        y + 82,
        90,
        22,
        4
      )
      .fill(
        isPaid
          ? "#E7F5EC"
          : "#FEF3D9"
      );

    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .fillColor(
        isPaid
          ? SUCCESS
          : ACCENT_DARK
      )
      .text(
        sale.paymentStatus.toUpperCase(),
        metaX,
        y + 88,
        {
          width: 90,
          align: "center",
          lineBreak: false,
        }
      );

    y += 135;

    // =====================================================
    // TABLE
    // =====================================================

    y = drawTableHeader(y);

    doc
      .font("Helvetica")
      .fontSize(9.5);

    // =====================================================
    // ITEMS
    // =====================================================

    sale.items.forEach((item, idx) => {
      const rowHeight = 28;

      // NEW PAGE

      if (y + rowHeight > 760) {
        doc.addPage();

        y = 40;

        y = drawTableHeader(y);
      }

      // ALTERNATE ROW BACKGROUND

      if (idx % 2 === 0) {
        doc
          .rect(
            MARGIN,
            y,
            CONTENT_WIDTH,
            rowHeight
          )
          .fill(TINT);
      }

      // PRODUCT

      doc
        .font("Helvetica-Bold")
        .fontSize(9.5)
        .fillColor(INK)
        .text(
          item.product?.name || "-",
          colProduct + 16,
          y + 9,
          {
            width: 195,
            lineBreak: false,
          }
        );

      // QTY

      doc
        .font("Helvetica")
        .fillColor(INK)
        .text(
          String(item.quantity),
          colQty,
          y + 9,
          {
            width: 40,
            align: "right",
            lineBreak: false,
          }
        );

      // MRP

      doc
        .fillColor(MUTED)
        .text(
          formatCurrency(item.mrp),
          colMrp,
          y + 9,
          {
            width: 60,
            align: "right",
            lineBreak: false,
          }
        );

      // PRICE

      doc
        .fillColor(INK)
        .text(
          formatCurrency(item.price),
          colPrice,
          y + 9,
          {
            width: 60,
            align: "right",
            lineBreak: false,
          }
        );

      // AMOUNT

      doc
        .font("Helvetica-Bold")
        .fillColor(INK)
        .text(
          formatCurrency(item.total),
          colTotal,
          y + 9,
          {
            width: amountWidth,
            align: "right",
            lineBreak: false,
          }
        );

      y += rowHeight;
    });

    // TABLE BOTTOM LINE

    doc
      .moveTo(
        MARGIN,
        y
      )
      .lineTo(
        MARGIN + CONTENT_WIDTH,
        y
      )
      .strokeColor(LINE)
      .stroke();

    y += 20;

    // =====================================================
    // SUMMARY
    // =====================================================

    if (y > 650) {
      doc.addPage();

      y = 40;
    }

    const boxWidth = 240;

    const boxX =
      MARGIN +
      CONTENT_WIDTH -
      boxWidth;

    // TOTAL MRP

    const totalMrp =
      sale.items.reduce(
        (sum, it) =>
          sum +
          Number(it.mrp || 0) *
            Number(it.quantity || 0),
        0
      );

    const totalDiscount =
      Number(
        sale.totalDiscount || 0
      );

    // SUBTOTAL

    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor(MUTED)
      .text(
        "Subtotal (MRP)",
        boxX,
        y,
        {
          width: 140,
        }
      );

    doc
      .fillColor(INK)
      .text(
        formatCurrency(totalMrp),
        boxX + 140,
        y,
        {
          width: 100,
          align: "right",
          lineBreak: false,
        }
      );

    y += 20;

    // DISCOUNT

    if (totalDiscount > 0) {
      doc
        .fillColor(MUTED)
        .text(
          "Discount Given",
          boxX,
          y,
          {
            width: 140,
          }
        );

      doc
        .fillColor(SUCCESS)
        .text(
          `- ${formatCurrency(
            totalDiscount
          )}`,
          boxX + 140,
          y,
          {
            width: 100,
            align: "right",
            lineBreak: false,
          }
        );

      y += 20;
    }

    // EXTRA CHARGED

    else if (totalDiscount < 0) {
      doc
        .fillColor(MUTED)
        .text(
          "Extra Charged",
          boxX,
          y,
          {
            width: 140,
          }
        );

      doc
        .fillColor(INK)
        .text(
          formatCurrency(
            -totalDiscount
          ),
          boxX + 140,
          y,
          {
            width: 100,
            align: "right",
            lineBreak: false,
          }
        );

      y += 20;
    }

    y += 6;

    // =====================================================
    // GRAND TOTAL
    // =====================================================

    doc
      .roundedRect(
        boxX,
        y,
        boxWidth,
        40,
        6
      )
      .fill(INK);

    doc
      .font("Helvetica-Bold")
      .fontSize(11)
      .fillColor(ACCENT)
      .text(
        "GRAND TOTAL",
        boxX + 16,
        y + 13
      );

    doc
      .font("Helvetica-Bold")
      .fontSize(15)
      .fillColor("#fff")
      .text(
        formatCurrency(
          sale.grandTotal
        ),
        boxX,
        y + 11,
        {
          width: boxWidth - 16,
          align: "right",
          lineBreak: false,
        }
      );

    y += 56;

    // =====================================================
    // SAVINGS MESSAGE
    // =====================================================

    if (totalDiscount > 0) {
      doc
        .font("Helvetica-Oblique")
        .fontSize(9.5)
        .fillColor(SUCCESS)
        .text(
          `You saved ${formatCurrency(
            totalDiscount
          )} on this order!`,
          MARGIN,
          y,
          {
            width: CONTENT_WIDTH,
            align: "right",
            lineBreak: false,
          }
        );

      y += 20;
    }

    // =====================================================
    // FOOTER
    // =====================================================

    y = Math.max(
      y + 30,
      700
    );

    if (y > 780) {
      doc.addPage();

      y = 700;
    }

    // FOOTER LINE

    doc
      .moveTo(
        MARGIN,
        y
      )
      .lineTo(
        MARGIN + CONTENT_WIDTH,
        y
      )
      .strokeColor(ACCENT)
      .lineWidth(1.5)
      .stroke();

    y += 16;

    // FOOTER MESSAGE

    doc
      .font("Helvetica-Bold")
      .fontSize(11)
      .fillColor(INK)
      .text(
        business?.invoiceFooter ||
          "Thank you for your business!",
        MARGIN,
        y,
        {
          width: CONTENT_WIDTH,
          align: "center",
        }
      );

    y += 16;

    // GENERATED MESSAGE

    doc
      .font("Helvetica")
      .fontSize(8)
      .fillColor(MUTED)
      .text(
        "This is a computer generated invoice and does not require a signature.",
        MARGIN,
        y,
        {
          width: CONTENT_WIDTH,
          align: "center",
        }
      );

    // =====================================================
    // FINISH PDF
    // =====================================================

    doc.end();

  } catch (error) {
    console.error(
      "Invoice generation error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Error generating invoice",
      error: error.message,
    });
  }
};
const markSaleAsPaid = async (req, res) => {
  try {
    const sale = await Sale.findOneAndUpdate(
      {
        _id: req.params.id,
        business: req.user.businessId,
        paymentStatus: "Pending",
      },
      { paymentStatus: "Paid" },
      { new: true }
    );

    if (!sale) {
      return res.status(404).json({
        message: "Pending sale not found",
      });
    }

    res.status(200).json({
      message: "Sale marked as paid",
      sale,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = { createSale, getAllSales, getSaleById, generateInvoice, markSaleAsPaid };