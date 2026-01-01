import PDFDocument from "pdfkit";

export const generateInvoicePDF = (order, res) => {
  const doc = new PDFDocument({ margin: 50 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=invoice_${order._id}.pdf`,
  );
  doc.pipe(res);

  //Header
  doc.fontSize(20).text("Invoice", { align: "center" });
  doc.moveDown();

  doc.fontSize(10).text(`Invoice ID: ${order._id}`);
  doc.text(`Date: ${new Date(order.createdAt).toDateString()}`);
  doc.text(`Status: ${order.status}`);
  doc.moveDown();

  //Customer Details
  doc.fontSize(12).text("BILL TO:");
  doc
    .fontSize(10)
    .text(order.customer.name)
    .text(order.customer.email || "")
    .text(order.customer.phone || "")
    .moveDown();

  //Table Header
  doc.fontSize(10);
  doc.text("Product", 50, doc.y, { continued: true });
  doc.text("Quantity", 250, doc.y, { continued: true });
  doc.text("Price", 300, doc.y, { continued: true });
  doc.text("Tax", 360, doc.y, { continued: true });
  doc.text("Total", 420, doc.y);
  doc.moveDown();

  //Table Row
  order.lines.forEach((line) => {
    const lineTotal = line.quantity * line.price + line.tax;

    doc.text(line.product.name, 50, doc.y, { continued: true });
    doc.text(line.quantity, 250, doc.y, { continued: true });
    doc.text(line.price, 300, doc.y, { continued: true });
    doc.text(line.tax, 360, doc.y, { continued: true });
    doc.text(lineTotal, 420, doc.y);
    doc.moveDown();
  });
  doc.moveDown();
  doc.fontSize(12).text(`Grand Total: ₹${order.total}`, {
    align: "right",
  });

  doc.end();
};
