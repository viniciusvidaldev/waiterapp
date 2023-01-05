import { ReactNode } from 'react';
import { ActivityIndicator, TouchableOpacityProps } from 'react-native';
import { Text } from '../Text';
import * as S from './styles';

interface ButtonProps extends TouchableOpacityProps {
  children: ReactNode;
  loading?: boolean;
}

export function Button({ children, loading, ...rest }: ButtonProps) {
  const { disabled } = { ...rest };

  return (
    <S.Container {...rest} disabled={disabled || loading}>
      {!loading && (
        <Text weight="600" color="#fff">
          {children}
        </Text>
      )}

      {loading && (
        <ActivityIndicator color="#fff" />
      )}
    </S.Container>
  );
}
