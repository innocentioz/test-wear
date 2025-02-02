import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col gap-6 items-center justify-center h-screen">
      <h1 className="text-6xl font-bold text-slate-800">Ошибка</h1>
      <p className="text-2xl text-gray-600">Страница не найдена</p>
      <Link href="/">
        <span className="mt-6 px-6 py-2 text-white bg-neutral-800 hover:bg-neutral-900 rounded-lg text-lg transition-all duration-300 ease-in-out">
          На главную
        </span>
      </Link>
    </div>
  );
}
