

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const Button = ({ text, onPress, disabled = false }) => {
  return (
    <TouchableOpacity 
      style={[styles.button, disabled && styles.buttonDisabled]} 
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={[styles.buttonText, disabled && styles.buttonTextDisabled]}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    width: '80%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
  buttonTextDisabled: {
    color: '#999',
  },
});

export default Button;
