import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Search, User, Menu } from 'lucide-react';
import MobileMenu from './mobile-menu';
import { useSession } from "next-auth/react";

export default function Header() {

  const { data: session } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  console.log(session);

  useEffect(() => { 
    setIsClient(true);

    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isMobileMenuOpen]);

  return (
    <header className="flex justify-around items-center w-full mt-4">
      <h1 className="gaoel">
        <Link href="/" className='text-2xl'>Limitless <br /> Wear</Link>
      </h1>

      <nav className='hidden lg:flex'>
        <ul className='motivasans flex gap-8'>
          <li>
            <Link href="/category/clothing">Одежда</Link>
          </li>

          <li>
            <Link href="/category/accessories">Аксессуары</Link>
          </li>

          <li>
            <Link href="/category/shoes">Обувь</Link>
          </li>
          
          <li>
            <Link href="/category/collections">Коллекции</Link>
          </li>

          <li className='relative' 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >

            <span className='cursor-pointer' onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              Информация
            </span>
          
            {isClient && (
              <ul className={`absolute left-0 mt-6 flex flex-col gap-4 bg-white overflow-hidden transition-all duration-300 ease-in-out origin-top 
                ${isDropdownOpen ? 'max-h-96 opacity-100 scale-y-100' : 'max-h-0 opacity-0 scale-y-0'}`}
                style={{ transitionProperty: 'max-height, opacity, transform' }}>
                <li>
                  <Link href='/information/about'>
                    О нас
                  </Link>
                </li>

                <li>
                  <Link href='/information/contacts'>
                    Контакты
                  </Link>
                </li>

                <li>
                  <Link href='/information/payment'>
                    Оплата
                  </Link>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </nav>

      <nav className='lg:static fixed bottom-0 max-[1024px]:w-full flex justify-center bg-white '>
        <ul className={`flex gap-6 max-[1024px]:py-6 max-[1024px]:gap-24
          max-[430px]:gap-16
          ${isMobileMenuOpen ? 'hidden' : ''}`}>
          <li>
            <Link href='/wishlist'>
              <Heart />
            </Link>
          </li>

          <li>
            <Link href='/search'>
              <Search />
            </Link>
          </li>

          <li>
            {session ? (
              <Link href="/profile">
                <User />
              </Link>
            ) : (
              <Link href="/login">
                <User />
              </Link>
            )}
          </li>

          <li>
            <Link href='/cart'>
              <ShoppingCart />
            </Link>
          </li>
        </ul>
      </nav>

      <button
        className="lg:hidden flex items-center"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu size={40} />
      </button>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </header>
  );
}
