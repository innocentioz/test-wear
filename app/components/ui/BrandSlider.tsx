"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const brands = [
  { id: 1, name: "Nike", image: "/brands/nike.png" },
  { id: 2, name: "Vetements", image: "/brands/vetements.png" },
  { id: 3, name: "Louis Vuitton", image: "/brands/lv.png" },
  { id: 4, name: "Givenchy", image: "/brands/givenchy.png" },
  { id: 5, name: "Moncler", image: "/brands/versace.jpg" },
  { id: 6, name: "Gucci", image: "/brands/gucci.png" },
  { id: 7, name: "New Balance", image: "/brands/newbalance.png" },
  { id: 8, name: "Lacoste", image: "/brands/lacoste.png" },
  { id: 9, name: "Dior", image: "/brands/dior.png" },
  { id: 10, name: "Balenciaga", image: "/brands/balenciaga.png" },
  { id: 11, name: "Saint Laurent", image: "/brands/saintlaurent.png" },
];

const BrandSlider = () => {
  const [position, setPosition] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition((prev) => (prev - 1) % (brands.length * 200));
    }, 50); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full overflow-hidden bg-white py-8">
      <div 
        className="relative whitespace-nowrap"
        style={{
          transform: `translateX(${position}px)`,
          transition: 'transform 0.05s linear'
        }}
      >
        {[...brands, ...brands, ...brands].map((brand, index) => (
          <div
            key={`${brand.id}-${index}`}
            className="inline-block w-[200px] px-3"
          >
            <div className="relative h-16 w-full bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-2">
              <Image
                src={brand.image}
                alt={brand.name}
                fill
                className="object-contain p-1"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandSlider; 