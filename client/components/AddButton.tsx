import React from 'react';
import { TouchableOpacity, StyleSheet, GestureResponderEvent } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type Props = {
  onPress: (event: GestureResponderEvent) => void;
};

const AddButton = ({ onPress }: Props) => {
  return (
    <TouchableOpacity style={styles.fab} onPress={onPress} activeOpacity={0.8}>
      <MaterialIcons name="add" size={32} color="#fff" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 125,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0188ef',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
});

export default AddButton;
