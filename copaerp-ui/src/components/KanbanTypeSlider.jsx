import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function KanbanTypeSlider({ defaultValue = "delivery" }) {
    const navigate = useNavigate();
    const [isDineIn, setIsDineIn] = useState(defaultValue === "dine-in");

    const handleDeliveryClick = () => {
        const newValue = !isDineIn;
        setIsDineIn(newValue);
        setTimeout(() => {
            navigate(`/orders/${newValue ? "dine-in" : "delivery"}`, {
                replace: true,
            });
        }, 550);
    };

    return (
        <motion.button
            onClick={handleDeliveryClick}
            className={`flex w-40 h-12 rounded-full p-1 transition-colors duration-500 ${
                isDineIn ? "bg-[#FF6A00]" : "bg-blue-600"
            }`}
        >
            <motion.span
                initial={false}
                animate={{ x: isDineIn ? 80 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex items-center justify-center px-3 text-black font-bold text-sm bg-white rounded-full cursor-pointer"
            >
                {isDineIn ? "SALÃO" : "DELIVERY"}
            </motion.span>
        </motion.button>
    );
}
