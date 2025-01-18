import React from "react";
import Image from "next/image";
import { Item } from "@/lib/Item";
import { Dispatch, SetStateAction } from "react";

interface ItemSectionProps {
  setCart: Dispatch<SetStateAction<Item[]>>; // Correctly type setCart
}

const ItemSection: React.FC<ItemSectionProps> = ({ setCart }) => {
  const items = [
    {
      id: 1,
      title: "The Story of Success",
      author: "By Arthur Gonzalez",
      price: 170.0,
      discountPrice: null,
      imageUrl: "/book_image.png", // Replace with actual image URL
    },
    {
      id: 2,
      title: "AI amd ML",
      author: "By Sabela Hupter",
      price: 99.0,
      discountPrice: "120.00",
      imageUrl: "/book_image.png", // Replace with actual image URL
    },
    {
      id: 3,
      title: "House of Sky and Breath",
      author: "By Gilberto Mills",
      price: 80.0,
      discountPrice: "90.00",
      imageUrl: "/book_image.png", // Replace with actual image URL
    },
  ];

  const itemObjects = items.map(
    (item) =>
      new Item(
        item.id,
        item.title,
        item.author,
        item.price,
        item.imageUrl,
        item.discountPrice ? parseFloat(item.discountPrice) : undefined
      )
  );

  const addToCart = (item: Item) => {
    setCart((prevCart) => [...prevCart, item]);
  };

  return (
    <div className="max-w-6xl mx-auto py-8">
      <h2 className="text-3xl font-bold mb-6 pl-4 sm:pl-0">
        Latest Collections
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {itemObjects.map((item) => (
          <div key={item.getId()} className="bg-white shadow-lg rounded-lg p-4">
            <div className="flex justify-center">
              <Image
                src={item.getImageUrl()}
                alt={item.getTitle()}
                className="mb-4 rounded"
                width={200}
                height={200}
              />
            </div>
            <div>
              <p className="text-gray-500">{item.getAuthor()}</p>
              <h3 className="text-lg font-semibold">{item.getTitle()}</h3>
              <div className="mt-2 mb-4">
                {item.getDiscountPrice() && (
                  <span className="line-through text-red-500 mr-2">
                    {item.getDiscountPrice()}
                  </span>
                )}
                <span className="text-blue-600 font-semibold">
                  $ {item.getPrice()}
                </span>
              </div>
              <button
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-all"
                onClick={() => addToCart(item)}
              >
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemSection;
