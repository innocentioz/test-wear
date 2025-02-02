"use client";

import { Listbox } from "@headlessui/react";
import { ChevronDown } from "lucide-react";

const sortOptions = [
  { id: "nameAsc", label: "Название (А-Я, A-Z)" },
  { id: "nameDesc", label: "Назание (Я-А, Z-A)" },
  { id: "priceAsc", label: "Цена (по возрастанию)" },
  { id: "priceDesc", label: "Цена (по убыванию)" },
];

type SortDropdownProps = {
  sortOption: string;
  setSortOption: (value: string) => void;
};

export default function SortDropdown({ sortOption, setSortOption }: SortDropdownProps) {
  const selectedOption = sortOptions.find((option) => option.id === sortOption) || sortOptions[0];

  return (
    <Listbox value={selectedOption} onChange={(value) => setSortOption(value.id)}>
      <div className="relative w-60 montserrat">
        <Listbox.Button className="w-full flex items-center justify-between bg-white text-black border border-neutral-300 rounded-2xl px-4 py-2 text-sm font-medium shadow-sm hover:bg-neutral-100 focus:outline-none transition-duration-300">
          {selectedOption.label}
          <ChevronDown size={18} />
        </Listbox.Button>

        <Listbox.Options className="absolute mt-1 w-full bg-white border border-neutral-300 rounded-2xl shadow-lg text-sm font-medium">
          {sortOptions.map((option) => (
            <Listbox.Option
              key={option.id}
              value={option}
              className={({ active }) =>
                `p-3 cursor-pointer ${
                  active ? "bg-black text-white first:rounded-tl-2xl first:rounded-tr-2xl last:rounded-bl-2xl last:rounded-br-2xl" : "text-black"
                }`
              }
            >
              {option.label}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  );
}
