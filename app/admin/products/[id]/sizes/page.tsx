"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface ProductSize {
    id: number;
    name: string;
}

export default function ProductSizesPage() {
    const [sizes, setSizes] = useState<ProductSize[]>([]);
    const [newSize, setNewSize] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const { id } = useParams();
    const productId = id && typeof id === 'string' ? parseInt(id, 10) : null;
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status !== 'loading' && (!session || !['admin', 'moderator'].includes(session.user.role))) {
            router.push('/');
        }
    }, [session, status, router]);

    useEffect(() => {
        if (!productId) return;

        async function fetchSizes() {
            setLoading(true);
            try {
                const res = await fetch(`/api/products/${productId}/sizes`);
                const data = await res.json();
                setSizes(data);
            } catch (error) {
                console.error('Failed to fetch sizes:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchSizes();
    }, [productId]);

    if (status === 'loading') return null;
    if (!session || !['admin', 'moderator'].includes(session.user.role)) return <p>У вас нет доступа к этой странице</p>;

    const handleAddSize = async () => {
        if (!newSize) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/products/${productId}/sizes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ size: newSize }),
            });
            const newSizeData = await res.json();
            setSizes((prev) => [...prev, newSizeData]);
            setNewSize('');
        } catch (error) {
            console.error('Failed to add size:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSize = async (sizeId: number) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/products/${productId}/sizes/${sizeId}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                const errorText = await res.text();
                console.error('Failed to delete size: ', errorText);
                throw new Error(errorText);
            }

            setSizes((prev) => prev.filter((size) => size.id !== sizeId));
        } catch (error) {
            console.error('Failed to delete size:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white px-4 py-12 sm:px-6 lg:px-8 mb-24">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl sm:text-4xl font-bold text-black mb-8 text-center">
                    Управление размерами
                </h1>

                <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 sm:p-8 montserrat">
                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                        <input
                            type="text"
                            value={newSize}
                            onChange={(e) => setNewSize(e.target.value)}
                            placeholder="Новый размер"
                            className="flex-1 px-4 py-3 rounded-lg border border-neutral-300 focus:border-black focus:ring-1 focus:ring-black transition duration-200 outline-none"
                        />
                        <button 
                            onClick={handleAddSize}
                            className="px-6 py-3 bg-black text-white hover:bg-neutral-800 transition-all duration-300 rounded-lg sm:w-auto w-full"
                        >
                            Добавить
                        </button>
                    </div>

                    {!sizes.length ? (
                        <p className="text-center text-neutral-500">Не найдено размеров для продукта</p>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {sizes.map((size) => (
                                <div 
                                    key={size.id}
                                    className="relative group bg-neutral-50 rounded-lg p-4 hover:bg-neutral-100 transition-all duration-200"
                                >
                                    <div className="text-center text-lg font-medium mb-2">{size.name}</div>
                                    <button 
                                        onClick={() => handleDeleteSize(size.id)}
                                        className="w-full px-3 py-2 text-sm bg-black text-white opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 rounded-lg hover:bg-neutral-800"
                                    >
                                        Удалить
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
