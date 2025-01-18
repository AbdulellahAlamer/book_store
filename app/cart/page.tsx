"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Item } from "@/lib/Item";

const Page = () => {
  const handleGeneratePDF = async (data: object) => {
    try {
      const response = await fetch("/api/invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: data }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "invoice.pdf");
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        console.error("Failed to generate PDF");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const searchParams = useSearchParams();
  const cartParams = searchParams.getAll("cart")[0];

  // Parse the JSON string into an array of CartItem
  const cartData: Item[] = JSON.parse(cartParams).map(
    (item: {
      id: number;
      title: string;
      author: string;
      price: number;
      imageUrl: string;
      discountPrice?: number;
    }) =>
      new Item(
        item.id,
        item.title,
        item.author,
        item.price,
        item.imageUrl,
        item.discountPrice
      )
  );

  // Count the quantity of each item
  const itemCounts = cartData.reduce(
    (counts: { [id: number]: number }, item) => {
      counts[item.getId()] = (counts[item.getId()] || 0) + 1;
      return counts;
    },
    {}
  );

  // Remove duplicates for displaying in the table
  const uniqueItems = cartData.filter(
    (item, index, self) =>
      index === self.findIndex((t) => t.getId() === item.getId())
  );

  const totalPrice: number = cartData.reduce(
    (sum, el) => el.getPrice() + sum,
    0
  );

  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Cart Items</h1>

      {/* Cart Items Table */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-200 px-4 py-2 text-left">
                Image
              </th>
              <th className="border border-gray-200 px-4 py-2 text-left">
                Name
              </th>
              <th className="border border-gray-200 px-4 py-2 text-left">
                Author
              </th>
              <th className="border border-gray-200 px-4 py-2 text-right">
                Price
              </th>
              <th className="border border-gray-200 px-4 py-2 text-center">
                Quantity
              </th>
              <th className="border border-gray-200 px-4 py-2 text-right">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {uniqueItems.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border border-gray-200 px-4 py-2">
                  <Image
                    src={item.getImageUrl()}
                    alt={item.getTitle()}
                    width={50}
                    height={50}
                    className="rounded"
                  />
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  {item.getTitle()}
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  {item.getAuthor()}
                </td>
                <td className="border border-gray-200 px-4 py-2 text-right">
                  ${item.getPrice().toFixed(2)}
                </td>
                <td className="border border-gray-200 px-4 py-2 text-center">
                  {itemCounts[item.getId()]}
                </td>
                <td className="border border-gray-200 px-4 py-2 text-right">
                  ${(item.getPrice() * itemCounts[item.getId()]).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Total Price */}
      <div className="mt-4 text-right text-xl font-bold">
        Total: ${totalPrice.toFixed(2)}
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-col gap-4 items-center">
        {/* <button className="px-16 py-4 text-xl font-bold bg-stone-300 rounded-md">
          CheckOut
        </button> */}
        <button
          className="px-16 py-4 text-xl font-bold bg-stone-200 rounded-md"
          onClick={() => handleGeneratePDF(cartData)}
        >
          Get Invoice (PDF)
        </button>
      </div>
    </div>
  );
};

export default Page;
