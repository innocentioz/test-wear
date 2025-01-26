import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-neutral-800 text-white text-sm py-8 montserrat hidden lg:flex">
      <div className="container mx-auto text-center flex flex-col gap-10">
        <div className='flex gap-24 justify-center'>
          <div className='flex flex-col items-center'>
            <h2 className='text-base'>
              Разделы
            </h2>

            <ul className='mt-4 flex flex-col gap-2'>
              <li>
                <Link href="" className='hover:text-slate-200'>
                  Обувь
                </Link>
              </li>

              <li>
                <Link href="" className='hover:text-slate-200'>
                  Одежда
                </Link>
              </li>

              <li>
                <Link href="" className='hover:text-slate-200'>
                  Аксессуары
                </Link>
              </li>

              <li>
                <Link href="" className='hover:text-slate-200'>
                  Коллекции
                </Link>
              </li>
            </ul>
          </div>

          <div className='flex flex-col items-center'>
            <h2 className='text-base'>
              Информация  
            </h2>

            <ul className='mt-4 flex flex-col gap-2'>
              <li>
                <Link href="/information/about" className='hover:text-slate-200'>
                  О нас
                </Link>
              </li>

              <li>
                <Link href="/information/contacts" className='hover:text-slate-200'>
                  Контакты
                </Link>
              </li>

              <li>
                <Link href="/information/payment" className='hover:text-slate-200'>
                  Оплата
                </Link>
              </li>

            </ul>
          </div>
        </div>
        <div className='flex justify-center'>
          <ul className='flex gap-6'>
            <li>
              <Link href='/information/policy' className='hover:text-slate-200'>
                Политика конфиденциальности
              </Link>
            </li>

            <li>
              <Link href='/information/agreement' className='hover:text-slate-200'>
                Пользовательское соглашение
              </Link>
            </li>

            <li>
              <Link href='/information/offer' className='hover:text-slate-200'>
                Договор оферты
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
  