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
                {orders.length > 0 ? (
                    orders.map((order, i) => <Card order={order} key={i} />)
                ) : (
                    <div>
                        <p className="text-center text-gray-900 italic my-6">
                            Nenhum pedido nesta coluna ainda
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
