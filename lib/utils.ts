import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Purchase } from "@prisma/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generatePDF = (order: Purchase, storeName: string) => {
  const doc = new jsPDF();

  // Add watermark
  doc.setFontSize(50);
  doc.setTextColor(240, 240, 240);
  doc.text(storeName, 50, 150, { angle: 45 });

  // Add order details
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text(`Order Details`, 14, 20);
  doc.text(`Client Name: ${order?.client?.name || "Unknown"}`, 14, 30);
  doc.text(`Order Date: ${new Date(order.createdAt).toLocaleString()}`, 14, 40);
  doc.text(`Payment Status: ${order.paymentStatus}`, 14, 50);

  // Add table for purchased items
  const tableColumn = ["Product Name", "Price", "Quantity", "Total"];
  const tableRows = order?.purchasedItems.map((item: any) => [
    item.product.name,
    `${item.price.toFixed(2)} MAD`,
    item.quantity,
    `${(item.price * item.quantity).toFixed(2)} MAD`,
  ]);

  doc?.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 60,
  });

  // Add total price
  doc.text(
    `Total: ${order.totalPrice.toFixed(2)} MAD`,
    14,
    doc?.lastAutoTable.finalY + 10
  );

  // Save or print the document
  doc.save(`order_${order.id}.pdf`);
};
