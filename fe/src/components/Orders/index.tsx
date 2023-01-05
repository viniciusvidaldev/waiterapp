import { useEffect, useState } from 'react';
import socketIo from 'socket.io-client';

import { api } from '../../services/api';
import { Order } from '../../types/Order';
import { OrdersBoard } from '../OrdersBoard';

import * as S from './styles';

export function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const socket = socketIo('http://localhost:3001', {
      transports: ['websocket']
    });

    socket.on('orders@new', (order) => {
      setOrders(prevState => prevState.concat(order))
    })
  }, []);

  useEffect(() => {
    api.get('/orders').then(response => {
      setOrders(response.data);
    })
  }, []);

  const waitingOrders = orders.filter(order => order.status === 'WAITING');
  const inProductionOrders = orders.filter(order => order.status === 'IN_PRODUCTION');
  const doneOrders = orders.filter(order => order.status === 'DONE');

  function handleCancelOrder(orderId: string) {
    setOrders(prevState => prevState.filter(order => order._id !== orderId))
  }

  function handleOrderStatusChange(orderId: string, status: Order['status']) {
    setOrders(prevState => prevState.map(order => (
      order._id === orderId
        ? { ...order, status }
        : order
    )));
  }

  return (
    <S.Container>
      <OrdersBoard
        icon="🕑"
        title="Fila de espera"
        orders={waitingOrders}
        onCancelOrder={handleCancelOrder}
        onChangeOrderStatus={handleOrderStatusChange}
      />

      <OrdersBoard
        icon="👩‍🍳"
        title="Fila de espera"
        orders={inProductionOrders}
        onCancelOrder={handleCancelOrder}
        onChangeOrderStatus={handleOrderStatusChange}
      />

      <OrdersBoard
        icon="✅"
        title="Pronto!"
        orders={doneOrders}
        onCancelOrder={handleCancelOrder}
        onChangeOrderStatus={handleOrderStatusChange}
      />

    </S.Container>
  )
}
