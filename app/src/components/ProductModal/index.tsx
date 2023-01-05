import { FlatList, Modal } from 'react-native';
import { Product } from '../../types/Product';
import { formatCurrency } from '../../utils/formatCurrency';
import { Button } from '../Button';
import { Close } from '../Icons/Close';
import { Text } from '../Text';

import * as S from './styles';

interface ProductModalProps {
  visible: boolean;
  onClose: () => void;
  product: Product | null;
  onAddToCart: (product: Product) => void;
}

export function ProductModal({ visible, onClose, product, onAddToCart }: ProductModalProps) {
  if (!product) {
    return null;
  }

  function handleAddToCart() {
    onAddToCart(product!);
    onClose();
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <S.Image
        source={{
          uri: `http://192.168.15.3:3001/uploads/${product.imagePath}`
        }}
      >
        <S.CloseButton onPress={onClose}>
          <Close />
        </S.CloseButton>
      </S.Image>

      <S.ModalBody>
        <S.Header>
          <Text size={24} weight="600">{product.name}</Text>
          <Text
            color="#666"
            style={{ marginTop: 8 }}
          >
            {product.description}
          </Text>
        </S.Header>

        {product.ingredients.length > 0 && (
          <S.IngredientsContainer>
            <Text weight="600" color="#666">Ingredientes</Text>

            <FlatList
              data={product.ingredients}
              keyExtractor={ingredient => ingredient._id}
              showsVerticalScrollIndicator={false}
              style={{ marginTop: 16 }}
              renderItem={({ item: ingredient }) => (
                <S.Ingredient>
                  <Text>{ingredient.icon}</Text>
                  <Text
                    size={14}
                    color="#666"
                    style={{ marginLeft: 20 }}
                  >
                    {ingredient.name}
                  </Text>
                </S.Ingredient>
              )}
            />
          </S.IngredientsContainer>
        )}
      </S.ModalBody>

      <S.Footer>
        <S.FooterContainer>
          <S.PriceContainer>
            <Text color="#666">Preço</Text>
            <Text size={20} weight="600">{formatCurrency(product.price)}</Text>
          </S.PriceContainer>

          <Button onPress={handleAddToCart}>
            Adicionar ao pedido
          </Button>
        </S.FooterContainer>
      </S.Footer>
    </Modal>
  );
}
