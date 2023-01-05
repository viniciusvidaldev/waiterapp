import { useState } from 'react';
import { toast } from 'react-toastify';

import { api } from '../../services/api';
import { Order } from '../../types/Order';
import { OrderModal } from '../OrderModal';
import * as S from './styles';

interface OrdersBoardProps {
  icon: string;
  title: string;
  orders: Order[];
  onCancelOrder: (orderId: string) => void;
  onChangeOrderStatus: (orderId: string, status: Order['status']) => void;
}

export function OrdersBoard({ icon, title, orders, onCancelOrder, onChangeOrderStatus }: OrdersBoardProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function handleOpenModal(order: Order) {
    setIsModalVisible(true);
    setSelectedOrder(order);
  }

  function handleCloseModal() {
    setIsModalVisible(false);
    setSelectedOrder(null);
  }

  async function handeChangeOrderStatus() {
    setIsLoading(true);

    const newStatus = selectedOrder?.status === 'WAITING'
      ? 'IN_PRODUCTION'
      : 'DONE'

    await api.patch(`/orders/${selectedOrder?._id}`, { status: newStatus });

    setIsLoading(false)
    onChangeOrderStatus(selectedOrder?._id!, newStatus);
    setIsModalVisible(false);

    toast.success(`O pedido da mesa ${selectedOrder?.table} teve o status alterado!`)
  }

  async function handleCancelOrder() {
    setIsLoading(true);

    await api.delete(`/orders/${selectedOrder?._id}`)

    setIsLoading(false)
    onCancelOrder(selectedOrder?._id!);
    setIsModalVisible(false);

    toast.success(`O pedido da mesa ${selectedOrder?.table} foi cancelado`)
  }

  return (
    <>
      <S.Board>
        <header>
          <span>{icon}</span>
          <strong>{title}</strong>
          <span>({orders.length})</span>
        </header>

        {orders.length > 0 && (
          <S.OrdersContainer>
            {orders.map(order => (
              <button type="button" key={order._id} onClick={() => handleOpenModal(order)}>
                <strong>Mesa {order.table}</strong>
                <span>{order.products.length} itens</span>
              </button>
            ))}
          </S.OrdersContainer>
        )}
      </S.Board>

      <OrderModal
        isVisible={isModalVisible}
        order={selectedOrder}
        onClose={handleCloseModal}
        onCancelOrder={handleCancelOrder}
        onChangeOrderStatus={handeChangeOrderStatus}
        isLoading={isLoading}
      />
    </>
  )
}
