import { parsePhoneNumberFromString } from "libphonenumber-js";
import { useEffect, useState } from "react";
import ReactModal from "react-modal";
import api from "@/utils/axios";
import { UNIT_ID } from "@/utils/constants";

export default function OrderCheckModal({
    open,
    setOpen,
    order,
    onOrderUpdated,
}) {
    const [loading, setLoading] = useState(false);

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

    const handleCancelOrder = async () => {
        if (!order || !order.id) {
            alert("Pedido inválido");
            return;
        }

        const confirmCancel = window.confirm(
            `Tem certeza que deseja cancelar o pedido #${order.display_id}?`
        );

        if (!confirmCancel) return;

        setLoading(true);
        try {
            const now = new Date().toISOString();
            const orderData = {
                ...order,
                canceled_at: now,
            };

            await api.post(`/orders/${UNIT_ID}`, orderData);

            alert("Pedido cancelado com sucesso!");
            setOpen(false);

            // Callback para atualizar a lista de pedidos
            if (onOrderUpdated) {
                onOrderUpdated();
            }
        } catch (err) {
            console.error("Erro ao cancelar pedido:", err);
            alert("Erro ao cancelar pedido. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    if (!open || !order) return null;

    return (
        <ReactModal
            isOpen={open}
            onRequestClose={() => setOpen(false)}
            appElement={document.getElementById("root")}
            style={{
                content: {
                    position: "static", // permite que o flex do overlay centralize
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
                    padding: "2rem", // garante espaço em telas menores
                },
            }}
            shouldCloseOnOverlayClick={true}
            preventScroll={true}
        >
            <div className="relative bg-white rounded-2xl shadow-lg w-[860px] max-w-[94vw] p-10 flex flex-col gap-6 text-sm leading-relaxed">
                {/* Badge ID */}
                <span className="absolute top-0 right-0 bg-black text-white font-bold text-sm px-4 py-2 rounded-bl-xl rounded-tr-2xl">
                    #{order.display_id}
                </span>
                {/* Título */}
                <h2 className="text-xl font-bold">
                    {order.customer?.full_name || `Mesa ${order.table_number}`}
                </h2>
                {/* Colunas */}
                <div className={`flex gap-6`}>
                    {/* Coluna esquerda - Itens */}
                    <div className="flex-1 flex flex-col gap-6 min-w-0">
                        <div>
                            <h3 className="font-semibold mb-4 text-lg tracking-wide">
                                Itens do Pedido
                            </h3>
                            <ul className="space-y-3 text-[13px]">
                                {order.current_cart?.map((item, i) => (
                                    <li key={i} className="leading-snug">
                                        <span className="font-semibold">
                                            {item.amount}x{" "}
                                        </span>
                                        <span className="font-semibold">
                                            {item.name.split(" ")[0]}{" "}
                                            {item.name
                                                .split(" ")
                                                .slice(1)
                                                .join(" ")}
                                        </span>
                                        {item.notes && (
                                            <div className="mt-1 text-[12px] text-gray-600 italic">
                                                <p>{item.notes}</p>
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {order.customer && (
                        <>
                            {/* Divider */}
                            <div className="w-px bg-zinc-300" />

                            {/* Coluna direita - Dados do cliente */}
                            <div className="flex-1 flex flex-col gap-8">
                                <div>
                                    <h3 className="font-semibold mb-6 text-lg tracking-wide">
                                        Dados do Cliente
                                    </h3>
                                    <div className="space-y-3 text-[13px]">
                                        <div>
                                            <p className="font-semibold mb-1">
                                                Telefone/Celular:
                                            </p>
                                            {order.customer.phone ? (
                                                <a
                                                    href={`https://web.whatsapp.com/send?phone=${order.customer.phone}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="whitespace-pre-line text-blue-600 border-b border-dotted border-blue-600 hover:border-blue-800 hover:text-blue-800"
                                                >
                                                    {parsePhoneNumberFromString(
                                                        order.customer.phone,
                                                        "BR"
                                                    )?.formatInternational() ||
                                                        order.customer.phone}
                                                </a>
                                            ) : (
                                                <p className="text-gray-500 italic">
                                                    Não informado
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-semibold mb-1">
                                                Endereço:
                                            </p>
                                            <p className="whitespace-pre-line">
                                                {order.address}
                                            </p>
                                        </div>
                                        {order.payment_method && (
                                            <div>
                                                <p className="font-semibold mb-1">
                                                    Forma de Pagamento:
                                                </p>
                                                <p>{order.payment_method}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Acoes */}
                <button
                    onClick={handleCancelOrder}
                    disabled={loading}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 w-fit cursor-pointer transition text-white font-medium rounded-md px-5 py-2 text-sm flex items-center gap-2"
                >
                    {loading && (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    )}
                    Cancelar Pedido
                </button>
            </div>
        </ReactModal>
    );
}
