"use client";

import { Listbox } from "@headlessui/react";

type SizeOption = {
  id: number;
  name: string;
};

type SizeSelectProps = {
  sizes: SizeOption[];
  selectedSize: string;
  onSizeChange: (size: string) => void;
};

export default function SizeSelect({ sizes, selectedSize, onSizeChange }: SizeSelectProps) {
  const selectedOption = sizes.find((size) => size.name === selectedSize) || sizes[0];

  return (
    <div className="flex flex-col gap-3">
      <label htmlFor="size" className="block mt-4 text-xl font-medium text-gray-700 montserrat">
        Выберите размер:
      </label>
      <Listbox value={selectedOption} onChange={(selected) => onSizeChange(selected.name)}>
        <div className="relative mt-1">
        <Listbox.Button className="montserrat w-full flex items-center justify-between bg-white text-black border border-neutral-300 rounded-2xl px-4 py-2 text-sm font-medium shadow-sm hover:bg-neutral-100 focus:outline-none transition-duration-300">
            {selectedOption.name}
          </Listbox.Button>

          <Listbox.Options className="montserrat absolute mt-1 w-full bg-white border border-neutral-300 rounded-2xl shadow-lg text-sm font-medium">
            {sizes.map((size) => (
              <Listbox.Option
                key={size.id}
                value={size}
                className={({ active }) =>
                  `p-3 cursor-pointer ${
                    active ? "bg-black text-white first:rounded-tl-2xl first:rounded-tr-2xl last:rounded-bl-2xl last:rounded-br-2xl" : "text-black"
                  }`
                }
              >
                {size.name}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  );
}
