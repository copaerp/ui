import { useEffect, useState } from "react";
import api from "@/utils/axios";
import {
    ORDER_POST_CHECKOUT_STATUS_CONFIRMED,
    ORDER_POST_CHECKOUT_STATUS_PREPARING,
    ORDER_POST_CHECKOUT_STATUS_DONE,
    UNIT_ID,
} from "@/utils/constants";
import { Check, X, ChevronUp, ChevronDown } from "lucide-react";

export default function KitchenOrdersPage() {
    const [orders, setOrders] = useState({
        confirmed: [],
        preparing: [],
        done: [],
    });

    const updateOrderStatus = async (order, newStatus) => {
        try {
            // Criar uma cópia do pedido com o novo status
            const updatedOrder = {
                ...order,
                post_checkout_status: newStatus,
            };

            // Enviar o objeto completo via POST
            await api.post(`/orders/${UNIT_ID}`, updatedOrder);

            // Recarregar pedidos após atualização
            fetchOrders();
        } catch (err) {
            console.error("Erro ao atualizar status do pedido:", err);
        }
    };

    const fetchOrders = async () => {
        try {
            const { data } = await api.get(`/orders/${UNIT_ID}`);

            // Separar pedidos por status
            const confirmedOrders =
                data?.filter(
                    (order) =>
                        order.post_checkout_status ===
                            ORDER_POST_CHECKOUT_STATUS_CONFIRMED ||
                        !order.post_checkout_status
                ) || [];
            const preparingOrders =
                data?.filter(
                    (order) =>
                        order.post_checkout_status ===
                        ORDER_POST_CHECKOUT_STATUS_PREPARING
                ) || [];
            const doneOrders =
                data?.filter(
                    (order) =>
                        order.post_checkout_status ===
                        ORDER_POST_CHECKOUT_STATUS_DONE
                ) || [];

            setOrders({
                confirmed: confirmedOrders,
                preparing: preparingOrders,
                done: doneOrders,
            });
        } catch (err) {
            console.error("Erro ao carregar pedidos:", err);
        }
    };

    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="h-screen bg-zinc-400 p-4 flex flex-col gap-4">
            <KitchenColumn
                title="CONFIRMADOS"
                color="bg-gray-300"
                orders={orders.confirmed}
                onUpdateOrderStatus={updateOrderStatus}
            />
            <KitchenColumn
                title="PREPARANDO"
                color="bg-yellow-200"
                orders={orders.preparing}
                onUpdateOrderStatus={updateOrderStatus}
            />
            <KitchenColumn
                title="PRONTO"
                color="bg-green-200"
                orders={orders.done}
                onUpdateOrderStatus={updateOrderStatus}
            />
        </div>
    );
}

function KitchenColumn({ title, color, orders, onUpdateOrderStatus }) {
    return (
        <div className={`rounded-lg ${color} flex-1 flex`}>
            <div className="flex items-center">
                <div className="bg-black text-white px-3 py-1 rounded-l-lg font-semibold text-sm w-16 h-full flex justify-center items-center">
                    <div className="rotate-270 text-2xl">{title}</div>
                </div>
            </div>
            <div className="flex flex-wrap gap-3 h-full p-3">
                {orders.map((order) => (
                    <OrderCard
                        key={order.id}
                        order={order}
                        onUpdateOrderStatus={onUpdateOrderStatus}
                    />
                ))}
                {orders.length === 0 && (
                    <div className="text-zinc-600 italic">
                        Sem pedidos neste estágio
                    </div>
                )}
            </div>
        </div>
    );
}

function OrderCard({ order, onUpdateOrderStatus }) {
    const currentStatus =
        order.post_checkout_status || ORDER_POST_CHECKOUT_STATUS_CONFIRMED;

    const canMoveUp = () => {
        return (
            currentStatus === ORDER_POST_CHECKOUT_STATUS_PREPARING ||
            currentStatus === ORDER_POST_CHECKOUT_STATUS_DONE
        );
    };

    const canMoveDown = () => {
        return (
            currentStatus === ORDER_POST_CHECKOUT_STATUS_CONFIRMED ||
            currentStatus === ORDER_POST_CHECKOUT_STATUS_PREPARING
        );
    };

    const handleMoveUp = () => {
        if (currentStatus === ORDER_POST_CHECKOUT_STATUS_PREPARING) {
            onUpdateOrderStatus(order, ORDER_POST_CHECKOUT_STATUS_CONFIRMED);
        } else if (currentStatus === ORDER_POST_CHECKOUT_STATUS_DONE) {
            onUpdateOrderStatus(order, ORDER_POST_CHECKOUT_STATUS_PREPARING);
        }
    };

    const handleMoveDown = () => {
        if (currentStatus === ORDER_POST_CHECKOUT_STATUS_CONFIRMED) {
            onUpdateOrderStatus(order, ORDER_POST_CHECKOUT_STATUS_PREPARING);
        } else if (currentStatus === ORDER_POST_CHECKOUT_STATUS_PREPARING) {
            onUpdateOrderStatus(order, ORDER_POST_CHECKOUT_STATUS_DONE);
        }
    };

    return (
        <div className="relative bg-white shadow-lg rounded-xl p-4 w-64 border border-gray-200 h-full">
            {/* ID do pedido */}
            <div className="absolute top-0 left-0 bg-black text-white text-xs px-3 py-1 rounded-br-lg rounded-tl-lg font-bold">
                #{order.display_id}
            </div>

            {/* Container do botão superior */}
            {canMoveUp() && (
                <div className="absolute top-2 left-0 right-0 flex justify-end pr-2">
                    <button
                        onClick={handleMoveUp}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded-full shadow-md transition-colors"
                        title="Mover para status anterior"
                    >
                        <ChevronUp size={16} />
                    </button>
                </div>
            )}

            {/* Container do botão inferior */}
            {canMoveDown() && (
                <div className="absolute bottom-2 left-0 right-0 flex justify-end pr-2">
                    <button
                        onClick={handleMoveDown}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded-full shadow-md transition-colors"
                        title="Avançar para próximo status"
                    >
                        <ChevronDown size={16} />
                    </button>
                </div>
            )}

            {/* Conteúdo principal */}
            <div className="mt-6 space-y-3">
                {/* Horário - hierarquia secundária */}
                <div className="flex items-center gap-2">
                    <div className="bg-gray-100 px-2 py-1 rounded text-sm font-medium text-gray-700">
                        {new Date(order.finished_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </div>
                </div>

                {/* Itens do carrinho - hierarquia terciária */}
                <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
                        Itens do Pedido
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                        {order.current_cart?.map((item, idx) => (
                            <div
                                key={idx}
                                className="text-sm text-gray-800 flex justify-between items-center"
                            >
                                <span className="font-medium">{item.name}</span>
                                <div className="text-xs text-gray-600">
                                    <span className="bg-blue-100 px-2 py-1 rounded font-semibold">
                                        {item.amount}x
                                    </span>
                                </div>
                            </div>
                        )) || (
                            <div className="text-sm text-gray-500 italic">
                                Nenhum item encontrado
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
