import logo from "@/assets/copa-logo-mini-transparent.png";
import Column from "@/components/Column.jsx";
import KanbanTypeSlider from "@/components/KanbanTypeSlider.jsx";
import OrderCheckModal from "@/components/OrderCheckModal.jsx";
import CreateOrderModal from "@/components/CreateOrderModal.jsx";
import api from "@/utils/axios";
import {
    WHATSAPP_CHANNEL_ID,
    SITE_CHANNEL_ID,
    ORDER_POST_CHECKOUT_STATUS_CONFIRMED,
    ORDER_POST_CHECKOUT_STATUS_PREPARING,
    ORDER_POST_CHECKOUT_STATUS_DONE,
    BUSINESS_ID,
} from "@/utils/constants";
import { Bell, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function DeliveryOrdersPage({ type }) {
    const [orders, setOrders] = useState({
        confirmed: [],
        preparing: [],
        done: [],
    });
    const [createOrderOpen, setCreateOrderOpen] = useState(false);
    const navigate = useNavigate();
    const { orderId } = useParams();

    const open = !!orderId;
    const setOpen = (value) => {
        if (!value) {
            navigate(`/orders/${type}`, { replace: false });
        }
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await api.get(`/orders/${BUSINESS_ID}`);
                console.log(data);

                const filteredOrders =
                    data?.filter((order) => {
                        if (type === "delivery") {
                            return order.channel_id === WHATSAPP_CHANNEL_ID;
                        } else if (type === "dine-in") {
                            return order.channel_id === SITE_CHANNEL_ID;
                        }
                        return false;
                    }) || [];

                // Separar pedidos por status
                const confirmedOrders = filteredOrders.filter(
                    (order) =>
                        order.post_checkout_status ===
                            ORDER_POST_CHECKOUT_STATUS_CONFIRMED ||
                        !order.post_checkout_status
                );
                const preparingOrders = filteredOrders.filter(
                    (order) =>
                        order.post_checkout_status ===
                        ORDER_POST_CHECKOUT_STATUS_PREPARING
                );
                const doneOrders = filteredOrders.filter(
                    (order) =>
                        order.post_checkout_status ===
                        ORDER_POST_CHECKOUT_STATUS_DONE
                );

                setOrders({
                    confirmed: confirmedOrders,
                    preparing: preparingOrders,
                    done: doneOrders,
                });
            } catch (err) {
                console.error("Erro ao carregar pedidos:", err);
            }
        };

        fetchOrders();
    }, [type]);

    const handleOrderCreated = () => {
        // Recarregar pedidos quando um novo for criado
        const fetchOrders = async () => {
            try {
                const { data } = await api.get(`/orders/${BUSINESS_ID}`);
                console.log(data);

                const filteredOrders =
                    data?.filter((order) => {
                        if (type === "delivery") {
                            return order.channel_id === WHATSAPP_CHANNEL_ID;
                        } else if (type === "dine-in") {
                            return order.channel_id === SITE_CHANNEL_ID;
                        }
                        return false;
                    }) || [];

                const confirmedOrders = filteredOrders.filter(
                    (order) =>
                        order.post_checkout_status ===
                            ORDER_POST_CHECKOUT_STATUS_CONFIRMED ||
                        !order.post_checkout_status
                );
                const preparingOrders = filteredOrders.filter(
                    (order) =>
                        order.post_checkout_status ===
                        ORDER_POST_CHECKOUT_STATUS_PREPARING
                );
                const doneOrders = filteredOrders.filter(
                    (order) =>
                        order.post_checkout_status ===
                        ORDER_POST_CHECKOUT_STATUS_DONE
                );

                setOrders({
                    confirmed: confirmedOrders,
                    preparing: preparingOrders,
                    done: doneOrders,
                });
            } catch (err) {
                console.error("Erro ao carregar pedidos:", err);
            }
        };
        fetchOrders();
    };

    const allOrders = [
        ...orders.confirmed,
        ...orders.preparing,
        ...orders.done,
    ];
    const currentOrder = allOrders.find(
        (o) => String(o.display_id) === String(orderId)
    );

    return (
        <div className="min-h-screen bg-zinc-400 p-4">
            <div className="flex justify-between items-center mb-6">
                <KanbanTypeSlider defaultValue={type} />
                <div className="absolute left-1/2 transform -translate-x-1/2">
                    <img
                        src={logo}
                        alt="Logo"
                        className="h-12 w-auto select-none"
                    />
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow hover:shadow-md transition">
                        <Bell className="w-5 h-5" /> ALERTAS
                    </button>
                    <button
                        onClick={() => setCreateOrderOpen(true)}
                        className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow hover:shadow-md transition"
                    >
                        <Plus className="w-5 h-5" /> NOVO PEDIDO
                    </button>
                </div>
            </div>
            <div className="flex gap-4">
                <Column
                    title="CONFIRMADOS"
                    color="bg-gray-300"
                    orders={orders.confirmed}
                />
                <Column
                    title="PREPARANDO"
                    color="bg-yellow-200"
                    orders={orders.preparing}
                />
                <Column
                    title="PRONTOS"
                    color="bg-green-200"
                    orders={orders.done}
                />
            </div>
            <OrderCheckModal
                open={open}
                setOpen={setOpen}
                order={currentOrder}
            />
            <CreateOrderModal
                open={createOrderOpen}
                setOpen={setCreateOrderOpen}
                onOrderCreated={handleOrderCreated}
            />
        </div>
    );
}
