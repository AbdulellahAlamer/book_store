// i think this api rounte is for sending the invocie
import puppeteer from "puppeteer";
import { NextResponse, NextRequest } from "next/server";
import dotenv from "dotenv";
dotenv.config();

interface Item {
  title: string;
  author: string;
  price: number;
}

const generate_html = (data: Item[]) => {
  // Calculate the quantity for each unique item and the total price
  const itemCounts = data.reduce(
    (counts: { [key: string]: { item: Item; quantity: number } }, item) => {
      const key = `${item.title}-${item.author}-${item.price}`;
      if (!counts[key]) {
        counts[key] = { item, quantity: 0 };
      }
      counts[key].quantity += 1;
      return counts;
    },
    {}
  );

  const uniqueItems = Object.values(itemCounts); // Extract unique items with quantities
  const total = uniqueItems.reduce(
    (sum, { item, quantity }) => sum + item.price * quantity,
    0
  ); // Calculate total price

  // Current date and time
  const now = new Date();
  const formattedDate = `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const formattedTime = `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes()
  ).padStart(2, "0")}`;

  return `<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice</title>
    <style>
        /*! Tailwind CSS v3.0.12 | MIT License */
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0; }
        .container { padding: 20px; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .header img { max-width: 120px; }
        .header .details { text-align: right; }
        .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .table th { background-color: #f4f4f4; }
        .footer { margin-top: 20px; text-align: right; }
        .notes, .terms { margin-top: 10px; font-size: 0.9rem; color: #555; }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header Section -->
        <div class="header">
            <div>
                <img src=${process.env.LOGO_LINK} alt="Logo">
                <p><strong>The Best Book Store</strong></p>
            </div>
            <div class="details">
                <h2>Invoice</h2>
                <p>Invoice #: 35245432</p>
                <p>Date: ${formattedDate}</p>
                <p>Time: ${formattedTime}</p>
            </div>
        </div>

        <!-- Table Section -->
        <table class="table">
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Author</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                ${uniqueItems
                  .map(
                    ({ item, quantity }) => `
                    <tr>
                        <td>${item.title}</td>
                        <td>${item.author}</td>
                        <td style="text-align: center;">${quantity}</td>
                        <td style="text-align: right;">$${item.price.toFixed(
                          2
                        )}</td>
                        <td style="text-align: right;">$${(
                          item.price * quantity
                        ).toFixed(2)}</td>
                    </tr>
                    `
                  )
                  .join("")}
            </tbody>
        </table>

        <!-- Total Amount -->
        <div class="footer">
            <p><strong>Total: $${total.toFixed(2)}</strong></p>
        </div>

        <!-- Notes Section -->
        <div class="notes">
            <p><strong>Notes:</strong></p>
            <p>Thanks for being an awesome customer!</p>
        </div>

        <!-- Terms Section -->
        <div class="terms">
            <p><strong>Terms:</strong></p>
            <p>This invoice is auto-generated at the time of delivery. If there are any issues, please contact the provider.</p>
        </div>
    </div>
</body>
</html>`;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { data } = body;

    const html = generate_html(data);

    // Launch Puppeteer to create the PDF
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html);

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    // Create the response with the PDF buffer and headers
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=invoice.pdf",
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
