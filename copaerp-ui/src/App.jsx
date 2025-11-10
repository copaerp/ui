import OrdersPage from "@/pages/Orders.jsx";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import KitchenOrdersPage from "./pages/KitchenOrdersPage";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/orders/delivery/:orderId?"
                    element={<OrdersPage type="delivery" />}
                />
                <Route
                    path="/orders/dine-in/:orderId?"
                    element={<OrdersPage type="dine-in" />}
                />
                <Route path="/orders/kitchen" element={<KitchenOrdersPage />} />
                <Route
                    path="/orders"
                    element={<Navigate to="/orders/delivery" replace />}
                />
                <Route
                    path="/"
                    element={<Navigate to="/orders/delivery" replace />}
                />
                <Route
                    path="*"
                    element={<div className="p-8">Página não encontrada</div>}
                />
            </Routes>
        </BrowserRouter>
    );
}
