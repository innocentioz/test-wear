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
        <div className="min-h-screen bg-white px-4 py-12 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl sm:text-4xl font-bold text-black mb-8 text-center">
                    Админ Панель Заказов
                </h1>

                {loading && (
                    <div className="flex justify-center my-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 montserrat">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div>
                                    <h3 className="text-sm font-medium text-neutral-500 mb-2">Информация о клиенте</h3>
                                    <p className="text-sm mb-1"><span className="font-medium">Имя:</span> {order.customerName}</p>
                                    <p className="text-sm mb-1"><span className="font-medium">Телефон:</span> {order.phone}</p>
                                    <p className="text-sm"><span className="font-medium">Адрес:</span> {order.address}</p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-neutral-500 mb-2">Информация о заказе</h3>
                                    <p className="text-sm mb-1"><span className="font-medium">Способ оплаты:</span> {(order.paymentMethod === "card" ? "Карта" : "Наличные")}</p>
                                    <p className="text-sm mb-1"><span className="font-medium">Сумма:</span> {order.totalPrice} ₽</p>
                                    <div className="mt-2">
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                                            className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-300 focus:border-black focus:ring-1 focus:ring-black transition duration-200 outline-none"
                                        >
                                            {Object.keys(statusOptions).map((key) => (
                                                <option key={key} value={key}>
                                                    {statusOptions[key]}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="lg:col-span-1">
                                    <h3 className="text-sm font-medium text-neutral-500 mb-2">Товары</h3>
                                    <div className="space-y-4">
                                        {order.items.map((item) => (
                                            <div key={item.id} className="flex items-center gap-4">
                                                {item.product.imageUrl && (
                                                    <div className="relative w-16 h-16 flex-shrink-0">
                                                        <Image
                                                            src={item.product.imageUrl}
                                                            alt={item.product.name}
                                                            fill
                                                            className="object-cover rounded-lg"
                                                        />
                                                    </div>
                                                )}
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium">{item.product.name}</span>
                                                    <span className="text-xs text-neutral-500">
                                                        Количество: {item.quantity}
                                                        {item.size && ` • Размер: ${item.size}`}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
