import { parsePhoneNumberFromString } from "libphonenumber-js";
import { useEffect, useState } from "react";
import ReactModal from "react-modal";
import api from "@/utils/axios";
import { UNIT_ID } from "@/utils/constants";

export default function AlertsModal({ open, setOpen, alerts }) {
    const [loading, setLoading] = useState(null);

    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    const handleFinishAlert = async (order) => {
        if (!order || !order.id) {
            alert("Pedido inválido");
            return;
        }

        const confirmFinish = window.confirm(
            `Tem certeza que deseja finalizar o alerta do pedido #${order.display_id}?`
        );

        if (!confirmFinish) return;

        setLoading(order.id);
        try {
            const now = new Date().toISOString();
            const orderData = {
                ...order,
                finished_at: now,
            };

            await api.post(`/orders/${UNIT_ID}`, orderData);

            alert("Alerta finalizado com sucesso!");
        } catch (err) {
            console.error("Erro ao finalizar alerta:", err);
            alert("Erro ao finalizar alerta. Tente novamente.");
        } finally {
            setLoading(null);
        }
    };

    if (!open) return null;

    return (
        <ReactModal
            isOpen={open}
            onRequestClose={() => setOpen(false)}
            appElement={document.getElementById("root")}
            style={{
                content: {
                    position: "static",
                    inset: "unset",
                    padding: 0,
                    background: "transparent",
                    border: "none",
                },
                overlay: {
                    backgroundColor: "rgba(0,0,0,0.45)",
                    zIndex: 50,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "2rem",
                },
            }}
            shouldCloseOnOverlayClick={true}
            preventScroll={true}
        >
            <div className="relative bg-white rounded-2xl shadow-lg w-[900px] max-w-[94vw] max-h-[85vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold">
                        Alertas de Usuários com Problemas
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                        {alerts?.length || 0}{" "}
                        {alerts?.length === 1 ? "pedido" : "pedidos"} com
                        alertas
                    </p>
                </div>

                {/* Lista de alertas */}
                <div className="overflow-y-auto flex-1 p-6">
                    {!alerts || alerts.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <p className="text-lg font-medium">
                                Nenhum alerta no momento
                            </p>
                            <p className="text-sm mt-2">
                                Todos os pedidos estão em dia!
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {alerts.map((order) => (
                                <div
                                    key={order.id}
                                    className="border border-gray-300 rounded-lg p-5 hover:shadow-md transition bg-white"
                                >
                                    {/* Header do pedido */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3">
                                                <span className="bg-black text-white font-bold text-sm px-3 py-1 rounded">
                                                    #{order.display_id}
                                                </span>
                                                <h3 className="font-bold text-lg">
                                                    {order.customer
                                                        ?.full_name ||
                                                        `Mesa ${order.table_number}`}
                                                </h3>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Grid com informações */}
                                    <div className="grid grid-cols-2 gap-6 mb-4">
                                        {/* Itens do pedido */}
                                        <div>
                                            <h4 className="font-semibold text-sm mb-2 text-gray-700">
                                                Itens do Pedido
                                            </h4>
                                            <ul className="space-y-1 text-sm">
                                                {order.current_cart?.map(
                                                    (item, i) => (
                                                        <li
                                                            key={i}
                                                            className="text-gray-800"
                                                        >
                                                            <span className="font-semibold">
                                                                {item.amount}x{" "}
                                                            </span>
                                                            {item.name}
                                                            {item.notes && (
                                                                <span className="block text-xs text-gray-600 italic ml-6 mt-0.5">
                                                                    {item.notes}
                                                                </span>
                                                            )}
                                                        </li>
                                                    )
                                                ) || (
                                                    <li className="text-gray-500 italic text-sm">
                                                        Sem itens
                                                    </li>
                                                )}
                                            </ul>
                                        </div>

                                        {/* Dados do cliente */}
                                        {order.customer && (
                                            <div>
                                                <h4 className="font-semibold text-sm mb-2 text-gray-700">
                                                    Dados do Cliente
                                                </h4>
                                                <div className="space-y-2 text-sm">
                                                    {order.customer.phone && (
                                                        <div>
                                                            <p className="text-xs text-gray-600 mb-0.5">
                                                                Telefone:
                                                            </p>
                                                            <p className="font-medium">
                                                                {parsePhoneNumberFromString(
                                                                    order
                                                                        .customer
                                                                        .phone,
                                                                    "BR"
                                                                )?.formatInternational() ||
                                                                    order
                                                                        .customer
                                                                        .phone}
                                                            </p>
                                                        </div>
                                                    )}
                                                    {order.address && (
                                                        <div>
                                                            <p className="text-xs text-gray-600 mb-0.5">
                                                                Endereço:
                                                            </p>
                                                            <p className="font-medium">
                                                                {order.address}
                                                            </p>
                                                        </div>
                                                    )}
                                                    {order.payment_method && (
                                                        <div>
                                                            <p className="text-xs text-gray-600 mb-0.5">
                                                                Pagamento:
                                                            </p>
                                                            <p className="font-medium">
                                                                {
                                                                    order.payment_method
                                                                }
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Ações */}
                                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                                        {order.customer?.phone && (
                                            <a
                                                href={`https://web.whatsapp.com/send?phone=${order.customer.phone}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-green-600 hover:bg-green-700 transition text-white font-medium rounded-md px-4 py-2 text-sm flex items-center gap-2"
                                            >
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                                </svg>
                                                Abrir WhatsApp
                                            </a>
                                        )}
                                        <button
                                            onClick={() =>
                                                handleFinishAlert(order)
                                            }
                                            disabled={loading === order.id}
                                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition text-white font-medium rounded-md px-4 py-2 text-sm flex items-center gap-2"
                                        >
                                            {loading === order.id && (
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            )}
                                            Finalizar Alerta
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200">
                    <button
                        onClick={() => setOpen(false)}
                        className="bg-gray-200 hover:bg-gray-300 transition text-gray-800 font-medium rounded-md px-6 py-2 text-sm"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </ReactModal>
    );
}
