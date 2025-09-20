import { useState } from "react";
import { useNavigate } from 'react-router-dom';

export default function KanbanTypeSlider({ defaultValue = 'delivery' }) {
    const navigate = useNavigate();
    const [isDineIn, setIsDineIn] = useState(defaultValue === 'dine-in');

    const handleDeliveryClick = () => {
        console.log(isDineIn)
        const newValue = !isDineIn;
        setIsDineIn(newValue);
        // animação ~500ms e depois navega
        setTimeout(() => {
            navigate(`/orders/${newValue ? 'dine-in' : 'delivery'}`, { replace: true });
        }, 550);
    }

    return (
        <button
            onClick={handleDeliveryClick}
            className={`relative w-34 h-12 rounded-full p-1 transition-colors duration-500 ${isDineIn ? 'bg-[#FF6A00]' : 'bg-blue-600'} group`}
        >
            <span
                className={`absolute top-1 left-1 flex items-center h-10 justify-center px-3 text-black font-bold text-sm bg-white rounded-full transition-all duration-500 ${isDineIn ? 'translate-x-14' : 'translate-x-0'} group-hover:bg-gray-200 cursor-pointer`}
            >
                {isDineIn ? 'SALÃO' : 'DELIVERY'}
            </span>
        </button>

    )
}