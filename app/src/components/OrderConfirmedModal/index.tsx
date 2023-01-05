import { StatusBar } from 'expo-status-bar';
import { Modal } from 'react-native';
import { CheckCircle } from '../Icons/CheckCircle';
import { Text } from '../Text';

import * as S from './styles';

type OrderConfirmedModalProps = {
  visible: boolean;
  onOk: () => void;
}

export function OrderConfirmedModal({ visible, onOk }: OrderConfirmedModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
    >
      <StatusBar style="light" />

      <S.Container>
        <CheckCircle />

        <Text
          size={20}
          weight="600"
          color="#fff"
          style={{ marginTop: 12 }}
        >
          Pedido confirmado
        </Text>

        <Text
          color="#fff"
          opacity={0.9}
          style={{ marginTop: 4 }}
        >
          O pedido já entrou na fila de produção!
        </Text>

        <S.OkButton onPress={onOk}>
          <Text color="#d73035">OK</Text>
        </S.OkButton>
      </S.Container>
    </Modal>
  );
}
