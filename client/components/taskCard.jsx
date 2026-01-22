import React from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';

// Color constants for completed and pending states
const COLORS = {
  completed: {
    background: '#D1FAE5',  // soft green
    border: '#34D399',      // emerald
    text: '#111827',        // near black
    textSecondary: '#374151', // gray for secondary text
  },
  pending: {
    background: '#FFFFFF',   // clean white card
    border: '#6366F1',      // indigo accent
    text: '#0F172A',        // almost black (title)
    textSecondary: '#334155', // dark gray (body text)
  },
  selected: {
    background: '#FEF2F2',  // very light rose
    border: '#FCA5A5',      // soft red-pink
  },
};

interface TaskCardProps {
  task: any;
  onPressCard: () => void;
  onPressCheckBox: () => void;
  onLongPress?: () => void;
  isSelected?: boolean;
  animatedStyle?: any;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onPressCard, onPressCheckBox, onLongPress, isSelected = false, animatedStyle }) => {
  const isCompleted = task.completed === true;
  const colors = isCompleted ? COLORS.completed : COLORS.pending;
  
  // Use selected colors if task is selected
  const cardBackground = isSelected ? COLORS.selected.background : colors.background;
  const cardBorder = isSelected ? COLORS.selected.border : colors.border;
  const borderWidth = isSelected ? 1.5 : 1;

  const cardWrapper = animatedStyle ? (
    <Animated.View style={animatedStyle}>
      <Pressable
        style={[
          styles.card,
          {
            backgroundColor: cardBackground,
            borderColor: cardBorder,
            borderWidth: borderWidth,
          },
        ]} 
        onPress={onPressCard}
        onLongPress={onLongPress}
        delayLongPress={500}
      >
        {/* Checkbox */}
        <Pressable
          onPress={(e) => {
            e?.stopPropagation?.();
            onPressCheckBox();
          }}
          style={[
            styles.box,
            {
              borderColor: isCompleted ? colors.border : colors.border,
            },
          ]}
        >
          {task.completed && (
            <Text style={[styles.tick, { color: colors.border }]}>✓</Text>
          )}
        </Pressable>

        {/* Text content */}
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.text }]}>{task.title}</Text>

          {task.description ? (
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              {task.description}
            </Text>
          ) : null}

          {task.dueDate && (
            <Text style={[styles.dueDate, { color: colors.textSecondary }]}>
              {task.dueDate instanceof Date 
                ? task.dueDate.toLocaleDateString() 
                : task.dueDate}
            </Text>
          )}
        </View>

      </Pressable>
    </Animated.View>
  ) : (
    <Pressable 
        style={[
          styles.card,
          {
            backgroundColor: cardBackground,
            borderColor: cardBorder,
            borderWidth: borderWidth,
          },
        ]} 
        onPress={onPressCard}
        onLongPress={onLongPress}
        delayLongPress={500}
      >
      {/* Checkbox */}
      <Pressable
        onPress={(e) => {
          e?.stopPropagation?.();
          onPressCheckBox();
        }}
        style={[
          styles.box,
          {
            borderColor: isCompleted ? colors.border : colors.border,
          },
        ]}
      >
        {task.completed && (
          <Text style={[styles.tick, { color: colors.border }]}>✓</Text>
        )}
      </Pressable>

      {/* Text content */}
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: colors.text }]}>{task.title}</Text>

        {task.description ? (
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {task.description}
          </Text>
        ) : null}

        {task.dueDate && (
          <Text style={[styles.dueDate, { color: colors.textSecondary }]}>
            {task.dueDate instanceof Date 
              ? task.dueDate.toLocaleDateString() 
              : task.dueDate}
          </Text>
        )}
      </View>

      </Pressable>
  );

  return cardWrapper;
};

export default TaskCard;

const styles = StyleSheet.create({
  card: {
    // Base styles - background and border are set conditionally
    padding: 16,
    borderRadius: 22,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,

    // soft depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },

  box: {
    width: 22,
    height: 22,
    borderWidth: 2,
    // borderColor is set conditionally
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  tick: {
    // color is set conditionally
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 18,
  },

  textContainer: {
    flex: 1,
  },

  title: {
    fontSize: 16,
    fontWeight: '600',
    // color is set conditionally
  },

  description: {
    fontSize: 13,
    // color is set conditionally
    marginTop: 2,
  },

  dueDate: {
    fontSize: 12,
    // color is set conditionally
    marginTop: 4,
  },
});
