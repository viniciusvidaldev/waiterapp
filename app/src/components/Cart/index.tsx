import { useState } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import { api } from '../../services/api';

import { CartItem } from '../../types/CartItem';
import { Product } from '../../types/Product';
import { formatCurrency } from '../../utils/formatCurrency';
import { Button } from '../Button';
import { MinusCircle } from '../Icons/MinusCircle';
import { PlusCircle } from '../Icons/PlusCircle';
import { OrderConfirmedModal } from '../OrderConfirmedModal';
import { Text } from '../Text';

import * as S from './styles';

interface CartProps {
  cartItems: CartItem[];
  onAdd: (product: Product) => void;
  onDecrement: (product: Product) => void;
  onConfirmOrder: () => void;
  selectedTable: string;
}

export function Cart({ cartItems, onAdd, onDecrement, onConfirmOrder, selectedTable }: CartProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const total = cartItems.reduce((acc, cartItem) => {
    return acc + cartItem.quantity * cartItem.product.price;
  }, 0);

  function handleConfirmOrder() {
    const payload = {
      table: selectedTable,
      products: cartItems.map(cartItem => ({
        product: cartItem.product._id,
        quantity: cartItem.quantity
      }))
    };

    setIsLoading(true);

    api.post('/orders', payload);

    setIsLoading(true);
    setIsModalVisible(true);
  }

  function handleOk() {
    onConfirmOrder();
    setIsModalVisible(false);
  }

  return (
    <>
      {cartItems.length > 0 && (
        <FlatList
          data={cartItems}
          keyExtractor={cartItem => cartItem.product._id}
          showsVerticalScrollIndicator={false}
          style={{ marginBottom: 20, maxHeight: 140 }}
          renderItem={({ item: cartItem }) => (
            <S.Item>
              <S.ProductContainer>
                <S.Image
                  source={{
                    uri: `http://192.168.15.3:3001/uploads/${cartItem.product.imagePath}`
                  }}
                />

                <S.QuantityContainer>
                  <Text size={14} color="#666">{cartItem.quantity}x</Text>
                </S.QuantityContainer>

                <S.ProductDetails>
                  <Text size={14} weight="600">{cartItem.product.name}</Text>
                  <Text
                    size={14}
                    color="#666"
                    style={{ marginTop: 4 }}
                  >
                    {formatCurrency(cartItem.product.price)}
                  </Text>
                </S.ProductDetails>
              </S.ProductContainer>

              <S.Actions>
                <TouchableOpacity
                  onPress={() => onDecrement(cartItem.product)}
                >
                  <MinusCircle />
                </TouchableOpacity>

                <TouchableOpacity
                  style={{ marginLeft: 24 }}
                  onPress={() => onAdd(cartItem.product)}
                >
                  <PlusCircle />
                </TouchableOpacity>
              </S.Actions>
            </S.Item>
          )}
        />
      )}

      <S.Summary>
        <S.TotalContainer>
          {cartItems.length > 0 ? (
            <>
              <Text color="#666">Total</Text>
              <Text
                size={20}
                weight="600"
              >
                {formatCurrency(total)}
              </Text>
            </>
          ) : (
            <Text color="#666">Seu carrinho está vazio</Text>
          )}
        </S.TotalContainer>




        <Button
          disabled={cartItems.length === 0}
          onPress={handleConfirmOrder}
          loading={isLoading}
        >
          Confirmar pedido
        </Button>
      </S.Summary>

      <OrderConfirmedModal
        visible={isModalVisible}
        onOk={handleOk}
      />
    </>
  );
}
