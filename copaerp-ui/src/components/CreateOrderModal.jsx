import { useState, useEffect } from "react";
import { X, Plus, Minus, ShoppingCart } from "lucide-react";
import ReactModal from "react-modal";
import api from "@/utils/axios";
import { BUSINESS_ID, SITE_CHANNEL_ID } from "@/utils/constants";

export default function CreateOrderModal({ open, setOpen, onOrderCreated }) {
    const [menu, setMenu] = useState([]);
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);
    const [menuLoading, setMenuLoading] = useState(false);

    // Fetch menu quando o modal abre
    useEffect(() => {
        if (open) {
            fetchMenu();
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    const fetchMenu = async () => {
        setMenuLoading(true);
        try {
            const { data } = await api.get(`/menu/${BUSINESS_ID}`);
            setMenu(data || []);
        } catch (err) {
            console.error("Erro ao carregar cardápio:", err);
        } finally {
            setMenuLoading(false);
        }
    };

    const addToCart = (product) => {
        setCart((prev) => {
            const existingItem = prev.find((item) => item.id === product.id);
            if (existingItem) {
                return prev.map((item) =>
                    item.id === product.id
                        ? { ...item, amount: item.amount + 1 }
                        : item
                );
            }
            return [...prev, { ...product, amount: 1 }];
        });
    };

    const removeFromCart = (productId) => {
        setCart((prev) => {
            const existingItem = prev.find((item) => item.id === productId);
            if (existingItem && existingItem.amount > 1) {
                return prev.map((item) =>
                    item.id === productId
                        ? { ...item, amount: item.amount - 1 }
                        : item
                );
            }
            return prev.filter((item) => item.id !== productId);
        });
    };

    const getItemQuantity = (productId) => {
        const item = cart.find((item) => item.id === productId);
        return item?.amount || 0;
    };

    const getTotalPrice = () => {
        return cart.reduce(
            (total, item) =>
                total + parseFloat(item.brl_price || 0) * item.amount,
            0
        );
    };

    const handleCreateOrder = async () => {
        if (cart.length === 0) {
            alert("Adicione pelo menos um item ao pedido");
            return;
        }

        setLoading(true);
        try {
            const orderData = {
                channel_id: SITE_CHANNEL_ID, // Sempre dine-in
                current_cart: cart.map((item) => ({
                    id: item.id,
                    name: item.name,
                    brl_price: item.brl_price,
                    amount: item.amount,
                })),
                total_price: getTotalPrice(),
                finished_at: new Date().toISOString(),
                post_checkout_status: "confirmed",
            };

            await api.post(`/orders/${BUSINESS_ID}`, orderData);

            // Limpar carrinho e fechar modal
            setCart([]);
            setOpen(false);

            // Callback para atualizar a lista de pedidos
            if (onOrderCreated) {
                onOrderCreated();
            }
        } catch (err) {
            console.error("Erro ao criar pedido:", err);
            alert("Erro ao criar pedido. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setCart([]);
        setOpen(false);
    };

    if (!open) return null;

    return (
        <ReactModal
            isOpen={open}
            onRequestClose={handleClose}
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
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Novo Pedido
                    </h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="flex h-[calc(90vh-140px)]">
                    {/* Menu Section */}
                    <div className="flex-1 p-6 overflow-y-auto border-r">
                        <h3 className="text-lg font-semibold mb-4">Cardápio</h3>

                        {menuLoading ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                <p className="mt-2 text-gray-600">
                                    Carregando cardápio...
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {menu.map((product) => (
                                    <div
                                        key={product.id}
                                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                                    >
                                        <h4 className="font-semibold text-gray-900">
                                            {product.name}
                                        </h4>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {product.description}
                                        </p>
                                        <div className="flex items-center justify-between mt-3">
                                            <span className="font-bold text-green-600">
                                                R${" "}
                                                {parseFloat(
                                                    product.brl_price || 0
                                                ).toFixed(2)}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() =>
                                                        removeFromCart(
                                                            product.id
                                                        )
                                                    }
                                                    disabled={
                                                        getItemQuantity(
                                                            product.id
                                                        ) === 0
                                                    }
                                                    className="bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white p-1 rounded-full transition-colors"
                                                >
                                                    <Minus size={16} />
                                                </button>
                                                <span className="w-8 text-center font-semibold">
                                                    {getItemQuantity(
                                                        product.id
                                                    )}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        addToCart(product)
                                                    }
                                                    className="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded-full transition-colors"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Cart Section */}
                    <div className="w-80 p-6 bg-gray-50">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <ShoppingCart size={20} />
                            Carrinho
                        </h3>

                        {cart.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">
                                Carrinho vazio
                            </p>
                        ) : (
                            <>
                                <div className="space-y-3 max-h-96 overflow-y-auto">
                                    {cart.map((item) => (
                                        <div
                                            key={item.id}
                                            className="bg-white rounded-lg p-3 shadow-sm"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-sm">
                                                        {item.name}
                                                    </h4>
                                                    <p className="text-green-600 font-semibold text-sm">
                                                        R${" "}
                                                        {parseFloat(
                                                            item.brl_price || 0
                                                        ).toFixed(2)}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2 ml-2">
                                                    <button
                                                        onClick={() =>
                                                            removeFromCart(
                                                                item.id
                                                            )
                                                        }
                                                        className="bg-red-500 hover:bg-red-600 text-white p-1 rounded-full transition-colors"
                                                    >
                                                        <Minus size={12} />
                                                    </button>
                                                    <span className="w-6 text-center font-semibold text-sm">
                                                        {item.amount}
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            addToCart(item)
                                                        }
                                                        className="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded-full transition-colors"
                                                    >
                                                        <Plus size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="text-right text-sm font-semibold text-gray-800 mt-2">
                                                Subtotal: R${" "}
                                                {(
                                                    parseFloat(
                                                        item.brl_price || 0
                                                    ) * item.amount
                                                ).toFixed(2)}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-4 pt-4 border-t">
                                    <div className="text-xl font-bold text-center mb-4">
                                        Total: R$ {getTotalPrice().toFixed(2)}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t bg-white flex justify-end gap-3">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleCreateOrder}
                        disabled={loading || cart.length === 0}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                        {loading && (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        )}
                        Criar Pedido
                    </button>
                </div>
            </div>
        </ReactModal>
    );
}
