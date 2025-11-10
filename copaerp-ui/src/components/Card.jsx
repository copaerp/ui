import { useLocation, useNavigate } from "react-router-dom";

export default function Card({ order }) {
    const navigate = useNavigate();
    const location = useLocation();

    const handleOpenDetails = () => {
        const pathname = location.pathname;
        const segments = pathname.split("/").filter(Boolean);
        if (segments.length >= 3 && segments[0] === "orders") {
            segments.length = 2;
        }
        const base = `/${segments.join("/")}`;
        const target = `${base}/${order.display_id}`;
        if (target !== pathname) {
            navigate(target, { replace: false });
        }
    };

    const buttonColor = location.pathname.includes("dine-in")
        ? "bg-[#FF6A00]"
        : "bg-blue-600";

    return (
        <div className="shadow-md flex flex-col">
            <div className={`flex bg-white rounded-t-lg `}>
                <div className="flex flex-col p-3 justify-between font-semibold w-full gap-1">
                    <span className="font-bold text-lg">
                        {order.customer.full_name}
                    </span>
                    <ul className="text-sm text-gray-700 max-h-18 overflow-hidden">
                        {order.current_cart.map((item, i) => (
                            <li key={i}>
                                {item.amount}x {item.name}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="flex flex-col justify-between items-end">
                    <span className="bg-black rounded-tr-lg rounded-bl-lg px-2 py-1 text-sm font-bold text-white">
                        #{order.display_id}
                    </span>
                    <span className="text-sm text-gray-800 p-3">
                        {order.finished_at &&
                            new Date(order.finished_at).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                    </span>
                </div>
            </div>
            <button
                className={`${buttonColor} text-white rounded-b-md px-3 py-1 text-sm transition-all duration-200 cursor-pointer`}
                onClick={handleOpenDetails}
            >
                Ver detalhes
            </button>
        </div>
    );
}
