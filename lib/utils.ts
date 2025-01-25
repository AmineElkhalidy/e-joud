import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Purchase } from "@prisma/client";
import html2canvas from "html2canvas";
import toast from "react-hot-toast";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handlePrint = async (
  orders: any,
  clientDetails: any,
  storeName: string
) => {
  try {
    const doc = new jsPDF("p", "mm", "a4"); // Portrait mode, millimeters, A4 size
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Watermark setup
    const watermarkText = storeName;
    const watermarkFontSize = 60;
    const watermarkAngle = 45;
    const watermarkX = pageWidth / 2;
    const watermarkY = pageHeight / 2;

    // Add watermark as big text in the background
    doc.setFontSize(watermarkFontSize);
    doc.setTextColor(240, 240, 240); // Light gray color for watermark
    doc.text(watermarkText, watermarkX, watermarkY, {
      angle: watermarkAngle,
      align: "center",
    });

    // Generate content dynamically
    const contentDiv = document.createElement("div");
    contentDiv.style.padding = "20px";

    // Client Information
    const clientInfo = `
      <h1 style="text-align:center; font-size:18px; margin-bottom: 20px;">
        Receipt for ${clientDetails?.fullName || "Unknown"}
      </h1>
      <p><strong>Total Price:</strong> ${orders
        .reduce((sum: any, order: any) => sum + order?.totalPrice, 0)
        .toFixed(2)} MAD</p>
      <hr style="margin: 10px 0;">
      <h3>Order Details:</h3>
    `;
    contentDiv.innerHTML = clientInfo;

    // Add orders table
    const ordersTable = document.createElement("table");
    ordersTable.style.width = "100%";
    ordersTable.style.borderCollapse = "collapse";

    // Table header
    const headerRow = `
      <tr>
        <th style="border: 1px solid #ddd; padding: 8px;">Product Name</th>
        <th style="border: 1px solid #ddd; padding: 8px;">Quantity</th>
        <th style="border: 1px solid #ddd; padding: 8px;">Total Price</th>
        <th style="border: 1px solid #ddd; padding: 8px;">Order Date</th>
      </tr>
    `;
    ordersTable.innerHTML = headerRow;

    // Table body
    orders.forEach((order: any) => {
      const productNames = order?.purchasedItems
        .map((item: any) => item?.product?.name)
        .join(", ");
      const quantities = order.purchasedItems
        .reduce((total: any, item: any) => total + item.quantity, 0)
        .toFixed(0);

      const orderRow = `
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;">${productNames}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${quantities}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${order.totalPrice.toFixed(
            2
          )} MAD</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${new Date(
            order.createdAt
          ).toLocaleString()}</td>
        </tr>
      `;
      ordersTable.innerHTML += orderRow;
    });

    // Append table to the content div
    contentDiv.appendChild(ordersTable);

    // Convert content to canvas for PDF rendering
    const canvas = await html2canvas(contentDiv, {
      scale: 2, // Increase scale for better resolution
    });
    const imgData = canvas.toDataURL("image/png");

    // Add the content image to PDF
    doc.addImage(imgData, "PNG", 10, 10, pageWidth - 20, pageHeight - 20);

    // Save PDF
    doc.save(`${clientDetails?.fullName || "Unknown"}_Receipt.pdf`);
    toast.success("Receipt downloaded successfully!");
  } catch (error) {
    console.error("Error generating receipt:", error);
    toast.error("Failed to generate receipt.");
  }
};
