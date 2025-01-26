"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

interface ProductSize {
    id: number;
    name: string;
}

export default function ProductSizesPage() {
    const [sizes, setSizes] = useState<ProductSize[]>([]);
    const [newSize, setNewSize] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const { id } = useParams(); // Получаем id из URL
    const productId = id && typeof id === 'string' ? parseInt(id, 10) : null; // Проверяем id на строку

    useEffect(() => {
        if (!productId) return;  // Если id некорректный, ничего не делаем

        async function fetchSizes() {
            setLoading(true);
            try {
                const res = await fetch(`/api/products/${productId}/sizes`);
                const data = await res.json();
                setSizes(data); // Убираем обработку ошибок для простоты
            } catch (error) {
                console.error('Failed to fetch sizes:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchSizes();
    }, [productId]);

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
        console.log(`Deleting size with ID: ${sizeId}`); // Логирование sizeId
        try {
            const res = await fetch(`/api/products/${productId}/sizes/${sizeId}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                const errorText = await res.text();  // Читаем текст ошибки
                console.error('Failed to delete size: ', errorText);
                throw new Error(errorText);  // Бросаем ошибку с подробным сообщением
            }

            // Обновляем список после удаления
            setSizes((prev) => prev.filter((size) => size.id !== sizeId));
        } catch (error) {
            console.error('Failed to delete size:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Loading...</p>;

    if (!sizes.length) return <p>No sizes found for this product</p>;

    return (
        <div>
            <h1>Manage Sizes</h1>
            <ul>
                {sizes.map((size) => (
                    <li key={size.id}>
                        {size.name} 
                        <button onClick={() => handleDeleteSize(size.id)}>Delete</button>
                    </li>
                ))}
            </ul>
            <input
                type="text"
                value={newSize}
                onChange={(e) => setNewSize(e.target.value)}
                placeholder="New Size"
            />
            <button onClick={handleAddSize}>Add Size</button>
        </div>
    );
}
