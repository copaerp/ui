import Card from "@/components/Card";

export default function Column({ title, color, orders }) {
    return (
        <div className={`flex-1 flex-col`}>
            <div className="bg-black text-white rounded-t-2xl px-3 py-2 font-bold text-center">
                {title}
            </div>
            <div
                className={`flex-1 rounded-b-2xl p-3 flex flex-col gap-3 ${color}`}
            >
                {orders.map((order, i) => (
                    <Card order={order} key={i} />
                ))}
            </div>
        </div>
    );
}
