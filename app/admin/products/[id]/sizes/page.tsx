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
        console.log(`Deleting size with ID: ${sizeId}`); 
        try {
            const res = await fetch(`/api/products/${productId}/sizes/${sizeId}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                const errorText = await res.text();  
                console.error('Failed to delete size: ', errorText);
                throw new Error(errorText);  
            }

            // Обновляем список после удаления
            setSizes((prev) => prev.filter((size) => size.id !== sizeId));
        } catch (error) {
            console.error('Failed to delete size:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Загрузка</p>;

    if (!sizes.length) return <p>Не найдено размеров для продукта</p>;

    return (
        <div>
            <h1>Manage Sizes</h1>
            <ul>
                {sizes.map((size) => (
                    <li key={size.id}>
                        {size.name} 
                        <button onClick={() => handleDeleteSize(size.id)}>Удалить</button>
                    </li>
                ))}
            </ul>
            <input
                type="text"
                value={newSize}
                onChange={(e) => setNewSize(e.target.value)}
                placeholder="New Size"
            />
            <button onClick={handleAddSize}>Добавить</button>
        </div>
    );
}
