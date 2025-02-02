"use client";

import { Listbox } from "@headlessui/react";

type PaymentOption = {
  value: string;
  label: string;
};

type PaymentSelectProps = {
  paymentMethods: PaymentOption[];
  selectedPaymentMethod: string;
  onPaymentMethodChange: (method: string) => void;
};

export default function PaymentSelect({
  paymentMethods, // Получаем paymentMethods как пропс
  selectedPaymentMethod,
  onPaymentMethodChange,
}: PaymentSelectProps) {
  const selectedOption = paymentMethods.find((method) => method.value === selectedPaymentMethod) || paymentMethods[0];

  return (
    <div className="flex flex-col gap-3">
      <label htmlFor="paymentMethod" className="block mt-4 text-xl font-medium text-gray-700 montserrat">
        Выберите способ оплаты:
      </label>
      <Listbox value={selectedOption} onChange={(selected) => onPaymentMethodChange(selected.value)}>
        <div className="relative mt-1">
          <Listbox.Button className="montserrat w-full flex items-center justify-between bg-white text-black border border-neutral-300 rounded-2xl px-4 py-2 text-sm font-medium shadow-sm hover:bg-neutral-100 focus:outline-none transition-all duration-300">
            {selectedOption.label}
          </Listbox.Button>

          <Listbox.Options className="montserrat absolute mt-1 w-full bg-white border border-neutral-300 rounded-2xl shadow-lg text-sm font-medium">
            {paymentMethods.map((method) => (
              <Listbox.Option
                key={method.value}
                value={method}
                className={({ active }) =>
                  `p-3 cursor-pointer ${
                    active ? "bg-black text-white first:rounded-tl-2xl first:rounded-tr-2xl last:rounded-bl-2xl last:rounded-br-2xl" : "text-black"
                  }`
                }
              >
                {method.label}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  );
}
