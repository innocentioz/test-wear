import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-neutral-800 text-white text-sm py-8 montserrat hidden lg:flex">
      <div className="container mx-auto text-center flex flex-col gap-10">
        <div className='flex gap-24 justify-center'>
          <div className='flex flex-col items-center'>
            <h2 className='text-base font-medium'>
              Разделы
            </h2>

            <ul className='mt-4 flex flex-col gap-2'>
              <li>
                <Link href="/category/shoes" className='hover:text-slate-200 transition-colors'>
                  Обувь
                </Link>
              </li>

              <li>
                <Link href="/category/clothes" className='hover:text-slate-200 transition-colors'>
                  Одежда
                </Link>
              </li>

              <li>
                <Link href="/category/accessories" className='hover:text-slate-200 transition-colors'>
                  Аксессуары
                </Link>
              </li>

              <li>
                <Link href="/category/collections" className='hover:text-slate-200 transition-colors'>
                  Коллекции
                </Link>
              </li>
            </ul>
          </div>

          <div className='flex flex-col items-center'>
            <h2 className='text-base font-medium'>
              Информация  
            </h2>

            <ul className='mt-4 flex flex-col gap-2'>
              <li>
                <Link href="/information/about" className='hover:text-slate-200 transition-colors'>
                  О нас
                </Link>
              </li>

              <li>
                <Link href="/information/contacts" className='hover:text-slate-200 transition-colors'>
                  Контакты
                </Link>
              </li>

              <li>
                <Link href="/information/payment" className='hover:text-slate-200 transition-colors'>
                  Оплата
                </Link>
              </li>

            </ul>
          </div>
        </div>
        <div className='flex justify-center'>
          <ul className='flex gap-6'>
            <li>
              <Link href='/information/policy' className='hover:text-slate-200 transition-colors'>
                Политика конфиденциальности
              </Link>
            </li>

            <li>
              <Link href='/information/agreement' className='hover:text-slate-200 transition-colors'>
                Пользовательское соглашение
              </Link>
            </li>

            <li>
              <Link href='/information/offer' className='hover:text-slate-200 transition-colors'>
                Договор оферты
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}