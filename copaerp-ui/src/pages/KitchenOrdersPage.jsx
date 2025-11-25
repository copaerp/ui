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

            // Ordenar por data (mais antigo primeiro)
            const sortedData = data?.sort((a, b) => {
                return new Date(a.finished_at) - new Date(b.finished_at);
            });

            // Separar pedidos por status
            const confirmedOrders =
                sortedData?.filter(
                    (order) =>
                        order.post_checkout_status ===
                            ORDER_POST_CHECKOUT_STATUS_CONFIRMED ||
                        !order.post_checkout_status
                ) || [];
            const preparingOrders =
                sortedData?.filter(
                    (order) =>
                        order.post_checkout_status ===
                        ORDER_POST_CHECKOUT_STATUS_PREPARING
                ) || [];
            const doneOrders =
                sortedData?.filter(
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
        <div className={`rounded-lg ${color} flex-1 flex overflow-hidden`}>
            <div className="flex items-center flex-shrink-0">
                <div className="bg-black text-white px-3 py-1 rounded-l-lg font-semibold text-sm w-16 h-full flex justify-center items-center">
                    <div className="rotate-270 text-2xl whitespace-nowrap">
                        {title}
                    </div>
                </div>
            </div>
            <div className="flex flex-nowrap gap-3 h-full p-3 overflow-x-auto items-stretch w-full">
                {orders.map((order) => (
                    <OrderCard
                        key={order.id}
                        order={order}
                        onUpdateOrderStatus={onUpdateOrderStatus}
                    />
                ))}
                {orders.length === 0 && (
                    <div className="text-zinc-600 italic whitespace-nowrap flex items-center">
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
        <div className="relative bg-white shadow-lg rounded-xl p-4 min-w-[300px] w-auto border border-gray-200 h-full flex flex-col flex-shrink-0">
            {/* ID do pedido */}
            <div className="absolute top-0 left-0 bg-black text-white text-xs px-3 py-1 rounded-br-lg rounded-tl-lg font-bold z-10">
                #{order.display_id}
            </div>

            {/* Horário */}
            <div className="absolute top-0 right-0 bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-bl-lg rounded-tr-xl font-medium z-10">
                {new Date(order.finished_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                })}
            </div>

            {/* Container do botão superior */}
            {canMoveUp() && (
                <div className="absolute top-7 left-0 right-0 flex justify-end pr-2 z-10">
                    <button
                        onClick={handleMoveUp}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded-full shadow-md transition-colors cursor-pointer"
                        title="Mover para status anterior"
                    >
                        <ChevronUp size={16} />
                    </button>
                </div>
            )}

            {/* Container do botão inferior */}
            {canMoveDown() && (
                <div className="absolute bottom-2 left-0 right-0 flex justify-end pr-2 z-10">
                    <button
                        onClick={handleMoveDown}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded-full shadow-md transition-colors cursor-pointer"
                        title="Avançar para próximo status"
                    >
                        <ChevronDown size={16} />
                    </button>
                </div>
            )}

            {/* Conteúdo principal */}
            <div className="mt-6 flex-1 flex flex-col min-h-0">
                {/* Itens do carrinho */}
                <div className="bg-gray-50 rounded-lg p-3 flex-1 flex flex-col flex-wrap gap-x-6 gap-y-2 content-start">
                    {order.current_cart?.map((item, idx) => (
                        <div key={idx} className="space-y-1 w-48 break-words">
                            <div className="text-sm text-gray-800 flex justify-between items-start gap-2">
                                <span className="font-medium leading-tight">
                                    {item.name}
                                </span>
                                <div className="text-xs text-gray-600 flex-shrink-0">
                                    <span className="bg-blue-100 px-2 py-0.5 rounded font-semibold">
                                        {item.amount || "1"}x
                                    </span>
                                </div>
                            </div>
                            {item.notes && (
                                <div className="text-xs text-gray-600 italic ml-2 leading-tight">
                                    {item.notes}
                                </div>
                            )}
                        </div>
                    )) || (
                        <div className="text-sm text-gray-500 italic">
                            Nenhum item encontrado
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
