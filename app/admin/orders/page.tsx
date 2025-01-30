'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface Order {
    id: number;
    customerName: string;
    phone: string;
    address: string;
    paymentMethod: string;
    totalPrice: number; 
    status: string;
    createdAt: string;
    updatedAt: string;
    items: OrderItem[];
}

interface OrderItem {
    id: number;
    quantity: number;
    price: number;
    size: string | null;
    product: {
        id: number;
        name: string;
        imageUrl: string | null;
    };
}

const statusOptions: { [key: string]: string } = {
    "Обработан": "Обработан",
    "Отправлено": "Отправлено",
    "В пути": "В пути",
    "Доставлен": "Доставлен",
    "Отменен": "Отменен",
};

export default function AdminOrderPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (status !== 'loading' && (!session || !['admin', 'moderator'].includes(session.user.role))) {
            router.push('/');
        }
    }, [session, status, router]);

    useEffect(() => {
        async function fetchOrders() {
            setLoading(true);
            const res = await fetch('/api/orders');
            const data = await res.json();
            setOrders(data);
            setLoading(false);
        }
        fetchOrders();
    }, []);

    if (status === 'loading') return null;
    if (!session || !['admin', 'moderator'].includes(session.user.role)) return <p>У вас нет доступа к этой странице</p>;
  

    const handleUpdateStatus = async (id: number, newStatus: string) => {
        setLoading(true);
        try {
            await fetch(`/api/orders/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });
            setOrders((prev) =>
                prev.map((order) =>
                    order.id === id ? { ...order, status: newStatus } : order
                )
            );
        } catch (error) {
            console.error('Ошибка при обновлении статуса:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Админ Панель Заказов</h1>
            {loading && <p>Загрузка...</p>}
            <table>
                <thead>
                    <tr>
                        <th>Клиент</th>
                        <th>Телефон</th>
                        <th>Адрес</th>
                        <th>Оплата</th>
                        <th>Сумма</th>
                        <th>Статус</th>
                        <th>Товары</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id}>
                            <td>{order.customerName}</td>
                            <td>{order.phone}</td>
                            <td>{order.address}</td>
                            <td>{order.paymentMethod}</td>
                            <td>{order.totalPrice} ₽</td>
                            <td>
                                <select
                                    value={order.status}
                                    onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                                >
                                    {Object.keys(statusOptions).map((key) => (
                                        <option key={key} value={key}>
                                            {statusOptions[key]}
                                        </option>
                                    ))}
                                </select>
                            </td>
                            <td>
                                <ul>
                                {order.items.map((item) => (
                                    <li key={item.id} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                        {item.product.imageUrl && (
                                            <Image
                                                src={item.product.imageUrl}
                                                alt={item.product.name}
                                                width={250}
                                                height={250}
                                                style={{ borderRadius: "5px" }}
                                            />
                                        )}
                                        <span>
                                            {item.product.name} (x{item.quantity}) {item.size && `- ${item.size}`}
                                        </span>
                                    </li>
                                ))}
                                </ul>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
