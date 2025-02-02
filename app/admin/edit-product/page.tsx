'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface Product {
    id: number;
    name: string;
    price: number;
    sizes: string[];
}

export default function AdminPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status !== 'loading' && (!session || !['admin', 'moderator'].includes(session.user.role))) {
            router.push('/');
        }
    }, [session, status, router]);

    useEffect(() => {
        async function fetchProducts() {
            const res = await fetch('/api/products');
            const data = await res.json();
            setProducts(data);
        }
        fetchProducts();    
    }, []);

    if (status === 'loading') return null;
    if (!session || !['admin', 'moderator'].includes(session.user.role)) return <p>У вас нет доступа к этой странице</p>;  

    const handleUpdate = async (id: number, updatedProduct: Partial<Product>) => {
        setLoading(true);
        try {
            await fetch(`/api/products/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedProduct),
            });
            setProducts((prev) =>
                prev.map((product) =>
                    product.id === id ? { ...product, ...updatedProduct } : product
                )
            );
        } catch (error) {
            console.error('Failed to update product:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        setLoading(true);
        try {
            await fetch(`/api/products/${id}`, { method: 'DELETE' });
            setProducts((prev) => prev.filter((product) => product.id !== id));
        } catch (error) {
            console.error('Failed to delete product:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white px-2 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-10 lg:py-12 mb-24">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-4 sm:mb-6 md:mb-8 text-center">
                    Управление товарами
                </h1>

                {loading && (
                    <div className="flex justify-center my-4 sm:my-6 md:my-8">
                        <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-black"></div>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-4 montserrat">
                    {products.map((product) => (
                        <div key={product.id} className="bg-white rounded-xl shadow-sm border border-neutral-200 p-4 hover:bg-neutral-50 transition-colors duration-200">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-neutral-500">Название</label>
                                    <input
                                        type="text"
                                        defaultValue={product.name}
                                        onBlur={(e) => handleUpdate(product.id, { name: e.target.value })}
                                        className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-300 focus:border-black focus:ring-1 focus:ring-black transition duration-200 outline-none"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-neutral-500">Цена</label>
                                    <input
                                        type="number"
                                        defaultValue={product.price}
                                        onBlur={(e) => handleUpdate(product.id, { price: parseInt(e.target.value) })}
                                        className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-300 focus:border-black focus:ring-1 focus:ring-black transition duration-200 outline-none"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-neutral-500">Размеры</label>
                                    <div className="flex flex-wrap gap-1 mb-2">
                                        {(product.sizes || []).map((size) => (
                                            <span key={size} className="px-2 py-1 bg-neutral-100 rounded-full text-xs">
                                                {size}
                                            </span>
                                        ))}
                                    </div>
                                    <button 
                                        onClick={() => router.push(`/admin/products/${product.id}/sizes`)}
                                        className="w-full text-sm py-2 border border-black text-black hover:bg-black hover:text-white transition-all duration-300 rounded-full"
                                    >
                                        Изменить размеры
                                    </button>
                                </div>

                                <div className="flex items-end">
                                    <button 
                                        onClick={() => handleDelete(product.id)}
                                        className="w-full text-sm 3 py-2 bg-black text-white hover:bg-neutral-800 transition-all duration-300 rounded-full"
                                    >
                                        Удалить
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
