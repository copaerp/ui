import { Bell, Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import logo from '../assets/copa-logo-mini-transparent.png';
import Column from "../components/Column.jsx";
import KanbanTypeSlider from "../components/KanbanTypeSlider.jsx";
import OrderCheckModal from "../components/OrderCheckModal.jsx";
import ordersMock from "../mocks/ordersMock.js";

export default function DeliveryOrdersPage() {
    const [orders] = useState(ordersMock);
    const navigate = useNavigate();
    const { orderId } = useParams();

    // Abre o modal se houver orderId na URL
    const open = !!orderId;
    const setOpen = (value) => {
        if (!value) {
            // Fechar modal: remover o orderId mantendo possível query/hash
            navigate('/orders/delivery', { replace: false });
        }
    };

    // Localiza o pedido atual (procura em todos os status)
    const allOrders = [...orders.confirmed, ...orders.preparing, ...orders.ready];
    const currentOrder = allOrders.find(o => String(o.id) === String(orderId));

    return (
        <div className="min-h-screen bg-zinc-400 p-4">
            <div className="flex justify-between items-center mb-6">
                <KanbanTypeSlider defaultValue="delivery" />
                <div className="absolute left-1/2 transform -translate-x-1/2">
                    <img src={logo} alt="Logo" className="h-12 w-auto select-none" />
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow hover:shadow-md transition">
                        <Bell className="w-5 h-5" /> ALERTAS
                    </button>
                    <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow hover:shadow-md transition">
                        <Plus className="w-5 h-5" /> NOVO PEDIDO
                    </button>
                </div>
            </div>
            <div className="flex gap-4">
                <Column title="CONFIRMADOS" color="bg-gray-300" orders={orders.confirmed} />
                <Column title="PREPARANDO" color="bg-yellow-200" orders={orders.preparing} />
                <Column title="PRONTOS" color="bg-green-200" orders={orders.ready} />
            </div>
            <OrderCheckModal open={open} setOpen={setOpen} order={currentOrder} />
        </div>
    );
}
