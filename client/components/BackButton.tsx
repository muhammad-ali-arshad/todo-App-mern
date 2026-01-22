import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

type Props = {
  color?: string;
  size?: number;
  style?: ViewStyle;
};

const BackButton = ({ color = '#000', size = 24, style }: Props) => {
  const router = useRouter();

  const handlePress = () => {
    router.back();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[styles.button, style]}
      activeOpacity={0.7}
    >
      <MaterialIcons name="arrow-back" size={size} color={color} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 4,
    borderRadius: 999,
  },
});

export default BackButton;

