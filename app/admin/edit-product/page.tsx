'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Product {
    id: number;
    name: string;
    price: number;
    sizes: string[];
}

export default function AdminPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Загружаем все продукты при монтировании компонента
    useEffect(() => {
        async function fetchProducts() {
            const res = await fetch('/api/products');
            const data = await res.json();
            setProducts(data);
        }
        fetchProducts();    
    }, []);

    // Обновление продукта
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
        <div>
            <h1>Admin Panel</h1>
            {loading && <p>Loading...</p>}
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Sizes</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td>
                                <input
                                    type="text"
                                    defaultValue={product.name}
                                    onBlur={(e) =>
                                        handleUpdate(product.id, { name: e.target.value })
                                    }
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    defaultValue={product.price}
                                    onBlur={(e) =>
                                        handleUpdate(product.id, { price: parseInt(e.target.value) })
                                    }
                                />
                            </td>
                            <td>
                                <ul>
                                    {(product.sizes || []).map((size) => (
                                        <li key={size}>
                                            {size} 
                                        </li>
                                    ))}
                                </ul>
                                <button onClick={() => router.push(`/admin/products/${product.id}/sizes`)}>
                                    Edit Sizes
                                </button>
                            </td>
                            <td>
                                <button onClick={() => handleDelete(product.id)}>Delete Product</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
