import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import jsPDF from "jspdf";
import "jspdf-autotable";
import html2canvas from "html2canvas";
import domtoimage from "dom-to-image-more";
import toast from "react-hot-toast";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handlePrint = async (orders, clientDetails, storeName) => {
  try {
    // Create a container to hold the content
    const contentDiv = document.createElement("div");
    contentDiv.style.padding = "20px";
    contentDiv.style.backgroundColor = "#fff";
    contentDiv.style.fontFamily = "Arial, sans-serif";

    // Add the header
    contentDiv.innerHTML = `
      <div style="text-align:center; margin-bottom: 20px;">
        <h1 style="font-size: 24px; margin-bottom: 10px;">${storeName}</h1>
        <h2 style="font-size: 18px;">Receipt for ${
          clientDetails?.fullName || "Unknown"
        }</h2>
        <p>Total Price: ${orders
          .reduce((sum, order) => sum + order?.totalPrice, 0)
          .toFixed(2)} MAD</p>
      </div>
    `;

    // Add the orders table
    const table = document.createElement("table");
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";

    // Table header
    table.innerHTML = `
      <thead>
        <tr>
          <th style="border: 1px solid #000; padding: 8px;">Product Name</th>
          <th style="border: 1px solid #000; padding: 8px;">Quantity</th>
          <th style="border: 1px solid #000; padding: 8px;">Total Price</th>
          <th style="border: 1px solid #000; padding: 8px;">Order Date</th>
        </tr>
      </thead>
      <tbody>
        ${orders
          .map((order) => {
            const productNames = order?.purchasedItems
              .map((item) => item?.product?.name)
              .join(", ");
            const totalQuantity = order.purchasedItems
              .reduce((total, item) => total + item.quantity, 0)
              .toFixed(0);
            return `
              <tr>
                <td style="border: 1px solid #000; padding: 8px;">${productNames}</td>
                <td style="border: 1px solid #000; padding: 8px;">${totalQuantity}</td>
                <td style="border: 1px solid #000; padding: 8px;">${order.totalPrice.toFixed(
                  2
                )} MAD</td>
                <td style="border: 1px solid #000; padding: 8px;">${new Date(
                  order.createdAt
                ).toLocaleString()}</td>
              </tr>
            `;
          })
          .join("")}
      </tbody>
    `;

    // Append the table to the container
    contentDiv.appendChild(table);

    // Append the container to the body (hidden)
    document.body.appendChild(contentDiv);

    // Generate the image
    const imgData = await domtoimage.toPng(contentDiv, {
      quality: 1,
    });

    // Remove the container
    document.body.removeChild(contentDiv);

    // Generate the PDF
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${clientDetails?.fullName || "Unknown"}_Receipt.pdf`);

    toast.success("Receipt downloaded successfully!");
  } catch (error) {
    console.error("Error generating receipt:", error);
    toast.error("Failed to generate receipt.");
  }
};
