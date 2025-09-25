import { useEffect } from "react";
import ReactModal from "react-modal";

export default function OrderCheckModal({ open, setOpen, order }) {
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
                    #{order.id}
                </span>
                {/* Título */}
                <h2 className="text-xl font-bold">
                    {order.customer.full_name}
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
                                {order.current_cart.map((item, i) => (
                                    <li key={i} className="leading-snug">
                                        <span className="font-semibold">
                                            1x{" "}
                                        </span>
                                        <span className="font-semibold">
                                            {item.name.split(" ")[0]}{" "}
                                            {item.name
                                                .split(" ")
                                                .slice(1)
                                                .join(" ")}
                                        </span>
                                        {/* Placeholder de variações / observações - remover quando vier estruturado */}
                                        {/* <div className="mt-1 text-[12px] space-y-1">
                                            <p className="">
                                                Inteira Calabresa
                                            </p>
                                            <p className="">Borda Catupiry</p>
                                        </div> */}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

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
                                    <p className="whitespace-pre-line">
                                        {order.customer.phone}
                                    </p>
                                </div>
                                <div>
                                    <p className="font-semibold mb-1">
                                        Endereço:
                                    </p>
                                    <p className="whitespace-pre-line">
                                        precisamos dar alguns passos para trás
                                    </p>
                                </div>
                                <div>
                                    <p className="font-semibold mb-1">
                                        Forma de Pagamento:
                                    </p>
                                    <p>
                                        precisamos dar alguns passos para trás
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Ações */}
                <button
                    onClick={() => setOpen(false)}
                    className="bg-red-600 hover:bg-red-700 w-fit cursor-pointer  transition text-white font-medium rounded-md px-5 py-2 text-sm"
                >
                    Cancelar Pedido
                </button>
            </div>
        </ReactModal>
    );
}
