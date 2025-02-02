"use client";

import { Listbox } from "@headlessui/react";
import { ChevronDown } from "lucide-react";

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
  const selectedOption = selectedSize 
    ? sizes.find((size) => size.name === selectedSize) 
    : sizes[0];

  if (!sizes.length) return null;

  return (
    <div className="flex flex-col gap-3">
      <label className="block text-xl font-medium text-gray-700 montserrat">
        Выберите размер:
      </label>
      <Listbox value={selectedOption} onChange={(selected) => onSizeChange(selected.name)}>
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full flex items-center justify-between bg-white text-black border border-neutral-300 rounded-2xl px-4 py-2 text-sm font-medium shadow-sm hover:bg-neutral-100 focus:outline-none transition-duration-300">
            <span>{selectedOption?.name || "Выберите размер"}</span>
            <ChevronDown size={18} />
          </Listbox.Button>

          <Listbox.Options className="absolute z-50 w-full mt-1 bg-white border border-neutral-300 rounded-2xl shadow-lg text-sm font-medium overflow-hidden">
            {sizes.map((size) => (
              <Listbox.Option
                key={size.id}
                value={size}
                className={({ active }) =>
                  `relative cursor-pointer select-none p-3 ${
                    active 
                      ? "bg-black text-white" 
                      : "text-black"
                  }`
                }
              >
                {({ selected }) => (
                  <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                    {size.name}
                  </span>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  );
}
