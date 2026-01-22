import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { createTask } from '@/services/task.service';
import BackButton from '@/components/BackButton';
import { ActivityIndicator } from 'react-native';
import DatePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';

const AddTask = () => {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [dueDate, setDueDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!taskTitle.trim()) {
      Alert.alert('Validation', 'Please enter a task title');
      return;
    }
    console.log('Completed value:', completed, typeof completed);
    try {
      setIsSubmitting(true);
      // Backend stores title, description, completed, dueDate
      await createTask(taskTitle.trim(), taskDescription.trim(), completed, dueDate);
      Alert.alert('Success', 'Task created successfully', [
        {
          text: 'OK',
          onPress: () => router.replace('/home'),
        },
      ]);
    } catch (error) {
      console.error('Error creating task', error);
      Alert.alert('Error', error.message || 'Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      <BackButton color="#6C63FF" size={26} style={styles.backButton} />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Create New Task</Text>
          </View>

          {/* Task Title */}
          <View style={styles.section}>
            <Text style={styles.label}>What is to be done?</Text>
            <View style={styles.inputContainer}>
              <MaterialIcons name="title" size={20} color="#6C63FF" />
              <TextInput
                placeholder="Task Title"
                placeholderTextColor="#9CA3AF"
                value={taskTitle}
                onChangeText={setTaskTitle}
                style={styles.input}
                autoCapitalize="sentences"
              />
            </View>
          </View>

          {/* Task Description */}
          <View style={styles.section}>
            <Text style={styles.label}>Task Description</Text>
            <View style={[styles.inputContainer, styles.textAreaContainer]}>
              <MaterialIcons
                name="description"
                size={20}
                color="#6C63FF"
                style={styles.iconTop}
              />
              <TextInput
                placeholder="Enter task description..."
                placeholderTextColor="#9CA3AF"
                value={taskDescription}
                onChangeText={setTaskDescription}
                style={[styles.input, styles.textArea]}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                autoCapitalize="sentences"
              />
            </View>
          </View>

          {/* Due Date */}
          <View style={styles.section}>
            <Text style={styles.label}>Due Date</Text>
            <TouchableOpacity
              style={styles.inputContainer}
              onPress={() => setShowDatePicker(true)}
              activeOpacity={0.7}
            >
              <MaterialIcons name="calendar-today" size={20} color="#6C63FF" />
              <Text style={[styles.input, styles.dateText, !dueDate && styles.datePlaceholder]}>
                {dueDate ? dayjs(dueDate).format('MMM DD, YYYY') : 'Select due date'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Date Picker Modal */}
          <Modal
            visible={showDatePicker}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowDatePicker(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Select Due Date</Text>
                  <TouchableOpacity
                    onPress={() => setShowDatePicker(false)}
                    style={styles.modalCloseButton}
                  >
                    <MaterialIcons name="close" size={24} color="#1F2937" />
                  </TouchableOpacity>
                </View>
                <View style={styles.datePickerContainer}>
                  <DatePicker
                    date={dueDate || dayjs().toDate()}
                    onChange={({ date }) => {
                      if (!date) return;

                      const today = dayjs().startOf('day');
                      const selected = dayjs(date).startOf('day');

                      // Prevent selecting past dates
                      if (selected.isBefore(today)) {
                        Alert.alert('Invalid Date', 'Please select today or a future date');
                        return;
                      }

                      // Set the selected date and close modal
                      setDueDate(date);
                      setShowDatePicker(false);
                    }}
                    mode="single"
                    minDate={dayjs().startOf('day').toDate()}
                    maxDate={dayjs().add(2, 'years').toDate()}
                    selectedItemColor="#6C63FF"
                    selectedItemTextColor="#ffffff"
                    selectedItemStyle={{
                      borderRadius: 12,
                      elevation: 4,
                      shadowColor: '#6C63FF',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.2,
                      shadowRadius: 4,
                    }}
                    calendarTextStyle={styles.calendarText}
                    selectedTextStyle={styles.selectedText}
                    headerTextStyle={styles.headerText}
                    weekDaysTextStyle={styles.weekDaysText}
                    todayTextStyle={styles.todayText}
                    containerStyle={styles.pickerContainer}
                    disabledDates={(date) => {
                      // Disable all dates before today
                      return dayjs(date).isBefore(dayjs().startOf('day'));
                    }}
                    styles={{
                      day: styles.calendarText,
                      disabled: styles.disabledDate,
                      disabled_label: styles.disabledDateText,
                    }}
                  />
                </View>
              </View>
            </View>
          </Modal>

          {/* Status */}
          <View style={styles.section}>
            <Text style={styles.label}>Status</Text>
            <View style={styles.radioContainer}>
              {/* Pending Option */}
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setCompleted(false)}
                activeOpacity={0.7}
              >
                <View style={styles.radioCircle}>
                  {!completed && (
                    <View style={[styles.radioSelected, { backgroundColor: '#FBBF24' }]} />
                  )}
                </View>
                <Text style={styles.radioText}>Pending</Text>
              </TouchableOpacity>

              {/* Completed Option */}
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setCompleted(true)}
                activeOpacity={0.7}
                
              >
                <View style={styles.radioCircle}>
                  {completed && (
                    <View style={[styles.radioSelected, { backgroundColor: '#34D399' }]} />
                  )}
                </View>
                <Text style={styles.radioText}>Completed</Text>
              </TouchableOpacity>
            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
      
      {/* Circular Submit Button */}
      <TouchableOpacity
        style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={isSubmitting}
        activeOpacity={0.8}
      >
        {isSubmitting ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <MaterialIcons name="check" size={32} color="#ffffff" />
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default AddTask;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB', // very light lavender-grey
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingBottom: 100, // Extra padding for FAB button
  },
  header: {
    marginBottom: 30,
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937', // soft charcoal, primary text
    textAlign: 'center',
  },
  section: {
    marginBottom: 25,
  },
  label: {
    color: '#374151', // labels / headings
    fontSize: 18,
    marginBottom: 12,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // white input background
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB', // border color
  },
  textAreaContainer: {
    alignItems: 'flex-start',
    minHeight: 100,
  },
  iconTop: {
    marginTop: 2,
    alignSelf: 'flex-start',
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1F2937', // soft charcoal, primary text
    paddingVertical: 0,
  },
  dateText: {
    fontSize: 16,
    paddingVertical: 4,
    color: '#1F2937', // soft charcoal, primary text
  },
  datePlaceholder: {
    color: '#9CA3AF', // placeholder text
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
    paddingTop: 0,
  },
  radioContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // white input background
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB', // border color
    flex: 1,
  },
  radioCircle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB', // border color
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioSelected: {
    height: 12,
    width: 12,
    borderRadius: 6,
    // backgroundColor will be set conditionally (pending: #FBBF24, completed: #34D399)
  },
  radioText: {
    fontSize: 16,
    color: '#1F2937', // soft charcoal, primary text
    fontWeight: '500',
  },
  submitButton: {
    position: 'absolute',
    right: 145,
    bottom: 95,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6C63FF', // soft indigo primary accent
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  backButton: {
    position: 'absolute',
    top: 58,
    left: 10,
    zIndex: 10,
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#EEF2FF', // soft indigo tint
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB', // border color
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937', // soft charcoal, primary text
  },
  modalCloseButton: {
    padding: 4,
 
  },
  datePickerContainer: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF', // white input background
    borderRadius: 16,
    marginHorizontal: 12,
    overflow: 'visible',
  },
  pickerContainer: {
    backgroundColor: 'transparent',
  },
  calendarText: {
    color: '#374151', // labels / headings
    fontSize: 16,
    fontWeight: '500',
  },
  selectedText: {
    color: '#FFFFFF', // white text on selected date
    fontWeight: '900',
    fontSize: 19,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  headerText: {
    color: '#6C63FF', // soft indigo primary accent
    fontSize: 22,
    fontWeight: '700',
  },
  weekDaysText: {
    color: '#A5B4FC', // pastel indigo secondary accent
    fontSize: 14,
    fontWeight: '600',
  },
  todayText: {
    color: '#6C63FF', // soft indigo primary accent
    fontWeight: '700',
    backgroundColor: 'rgba(108, 99, 255, 0.15)', // soft indigo with opacity
    borderRadius: 8,
  },
  disabledDate: {
    backgroundColor: '#D1D5DB', // disabled elements
    borderRadius: 8,
    opacity: 0.6,
  },
  disabledDateText: {
    color: '#9CA3AF', // placeholder text (muted for disabled)
    fontSize: 16,
    fontWeight: '400',
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
});