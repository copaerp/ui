import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DeliveryOrdersPage from './pages/DeliveryOrders.jsx';
import DineInOrdersPage from './pages/DineInOrders.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/orders/delivery/:orderId?" element={<DeliveryOrdersPage />} />
  <Route path="/orders/dine-in/:orderId?" element={<DineInOrdersPage />} />
        <Route path="/orders" element={<Navigate to="/orders/delivery" replace />} />
        <Route path="/" element={<Navigate to="/orders/delivery" replace />} />
        <Route path="*" element={<div className="p-8">Página não encontrada</div>} />
      </Routes>
    </BrowserRouter>
  );
}
