"use client";

import { useState, useRef, ReactNode } from "react";

interface AccordionProps {
  title: string;
  children: ReactNode;
}

function Accordion({ title, children }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className={`border-b border-neutral-200 rounded-lg overflow-hidden mb-4 montserrat ${ isOpen ? "border border-neutral-400 rounded-lg" : "" }`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex justify-between items-center p-4 transition ${ isOpen ? "bg-neutral-800 text-white" : "" } `}
      >
        <span className="font-medium">{title}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 transform transition-transform duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div
        className="transition-all duration-300 overflow-hidden"
        style={{
          maxHeight: isOpen
            ? `${contentRef.current?.scrollHeight || 0}px` 
            : "0px",
        }}
        ref={contentRef}
      >
        <div className="p-4 bg-white">{children}</div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <div className="max-w-lg mx-auto p-4 flex flex-col gap-4">
      <Accordion title="Способы возврата">
        <p className="text-sm">
        *Если вы считаете, что вам пришел товар с браком или товар ненадлежащего качества, 
        свяжитесь с нами по почте SUPPORT@STEPANBATALOV.COM. Приложите к обращению фото и подробное 
        описание вашей проблемы, наша команда свяжется с вами и мы обязательно решим этот вопрос в частном 
        порядке *Обмен товара производится исключительно через возврат и оформление нового заказа
        </p>
      </Accordion>
      <Accordion title="Способы оплаты">
        <p className="text-sm">
        Мы также принимаем оплату банковскими картами: Visa, Mastercard, МИР. СБП и др. Или наличными средствами.
        </p>
      </Accordion>
    </div>
  );
}
