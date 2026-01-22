import React from 'react';
import { TouchableOpacity, StyleSheet, Text, Animated, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface DeleteButtonProps {
  onPress: () => void;
  count: number;
  animatedStyle?: any;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ onPress, count, animatedStyle }) => {
  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <TouchableOpacity 
        style={styles.button} 
        onPress={onPress}
        activeOpacity={0.8}
      >
        <MaterialIcons name="delete" size={24} color="#EF4444" />
        {count > 1 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{count}</Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default DeleteButton;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 80,
    right: 20,
    zIndex: 1000,
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1.5,
    borderColor: '#FCA5A5',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
