"use client";

import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ItemSection from "@/components/ItemSection";
import { useState } from "react";
import { Item } from "@/lib/Item";

export default function Home() {
  const [cart, setCart] = useState<Item[]>([]);

  return (
    <div>
      <Header cart={cart} />
      <HeroSection />
      <ItemSection setCart={setCart} />
    </div>
  );
}
