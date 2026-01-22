import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import DatePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';

interface Task {
  _id?: string;
  id?: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string | Date;
}

interface EditTaskModalProps {
  visible: boolean;
  task: Task | null;
  onClose: () => void;
  onSave: (taskId: string, updates: { title: string; description: string; dueDate?: Date | null }) => Promise<void>;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({ visible, task, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Pre-fill form when task changes
  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      // Handle dueDate - could be string or Date
      if (task.dueDate) {
        const date = task.dueDate instanceof Date 
          ? task.dueDate 
          : new Date(task.dueDate);
        setDueDate(isNaN(date.getTime()) ? null : date);
      } else {
        setDueDate(null);
      }
    }
  }, [task]);

  const handleSave = async () => {
    if (!task) return;
    
    if (!title.trim()) {
      Alert.alert('Validation', 'Please enter a task title');
      return;
    }

    const taskId = task._id || task.id;
    if (!taskId) {
      Alert.alert('Error', 'Task ID not found');
      return;
    }

    try {
      setIsSaving(true);
      await onSave(taskId, {
        title: title.trim(),
        description: description.trim(),
        dueDate: dueDate,
      });
      onClose();
    } catch (error: any) {
      console.error('Error saving task', error);
      Alert.alert('Error', error.message || 'Failed to save task');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (!isSaving) {
      onClose();
    }
  };

  if (!task) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={handleClose}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
            style={styles.modalCard}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.headerTitle}>Edit Task</Text>
                <TouchableOpacity
                  onPress={handleClose}
                  style={styles.closeButton}
                  disabled={isSaving}
                >
                  <MaterialIcons name="close" size={24} color="#111827" />
                </TouchableOpacity>
              </View>

              {/* Task Title */}
              <View style={styles.section}>
                <Text style={styles.label}>Task Title</Text>
                <View style={styles.inputContainer}>
                  <MaterialIcons name="title" size={20} color="#6366F1" />
                  <TextInput
                    placeholder="Task Title"
                    placeholderTextColor="#6B7280"
                    value={title}
                    onChangeText={setTitle}
                    style={styles.input}
                    autoCapitalize="sentences"
                    editable={!isSaving}
                  />
                </View>
              </View>

              {/* Task Description */}
              <View style={styles.section}>
                <Text style={styles.label}>Description</Text>
                <View style={[styles.inputContainer, styles.textAreaContainer]}>
                  <MaterialIcons
                    name="description"
                    size={20}
                    color="#6366F1"
                    style={styles.iconTop}
                  />
                  <TextInput
                    placeholder="Enter task description..."
                    placeholderTextColor="#6B7280"
                    value={description}
                    onChangeText={setDescription}
                    style={[styles.input, styles.textArea]}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    autoCapitalize="sentences"
                    editable={!isSaving}
                  />
                </View>
              </View>

              {/* Due Date */}
              <View style={styles.section}>
                <Text style={styles.label}>Due Date</Text>
                <TouchableOpacity
                  style={styles.inputContainer}
                  onPress={() => !isSaving && setShowDatePicker(true)}
                  activeOpacity={0.7}
                  disabled={isSaving}
                >
                  <MaterialIcons name="calendar-today" size={20} color="#6366F1" />
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
                <View style={styles.datePickerOverlay}>
                  <View style={styles.datePickerModalContent}>
                    <View style={styles.datePickerHeader}>
                      <Text style={styles.datePickerTitle}>Select Due Date</Text>
                      <TouchableOpacity
                        onPress={() => setShowDatePicker(false)}
                        style={styles.datePickerCloseButton}
                      >
                        <MaterialIcons name="close" size={24} color="#111827" />
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

                          setDueDate(date);
                          setShowDatePicker(false);
                        }}
                        mode="single"
                        minDate={dayjs().startOf('day').toDate()}
                        maxDate={dayjs().add(2, 'years').toDate()}
                        selectedItemColor="#6366F1"
                        selectedItemTextColor="#ffffff"
                        selectedItemStyle={{
                          borderRadius: 12,
                          elevation: 4,
                          shadowColor: '#6366F1',
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

              {/* Action Buttons */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.cancelButton, isSaving && styles.buttonDisabled]}
                  onPress={handleClose}
                  disabled={isSaving}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.saveButton, isSaving && styles.buttonDisabled]}
                  onPress={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.saveButtonText}>Save</Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default EditTaskModal;

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(17, 24, 39, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  closeButton: {
    padding: 4,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    color: '#111827',
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
    color: '#111827',
    paddingVertical: 0,
  },
  dateText: {
    fontSize: 16,
    paddingVertical: 4,
    color: '#111827',
  },
  datePlaceholder: {
    color: '#6B7280',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
    paddingTop: 0,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  // Date Picker Modal Styles
  datePickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(17, 24, 39, 0.35)',
    justifyContent: 'flex-end',
  },
  datePickerModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  datePickerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  datePickerCloseButton: {
    padding: 4,
  },
  datePickerContainer: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    marginHorizontal: 12,
    overflow: 'visible',
  },
  pickerContainer: {
    backgroundColor: 'transparent',
  },
  calendarText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '500',
  },
  selectedText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 19,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  headerText: {
    color: '#6366F1',
    fontSize: 22,
    fontWeight: '700',
  },
  weekDaysText: {
    color: '#6366F1',
    fontSize: 14,
    fontWeight: '600',
  },
  todayText: {
    color: '#6366F1',
    fontWeight: '700',
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    borderRadius: 8,
  },
  disabledDate: {
    backgroundColor: '#D1D5DB',
    borderRadius: 8,
    opacity: 0.6,
  },
  disabledDateText: {
    color: '#9CA3AF',
    fontSize: 16,
    fontWeight: '400',
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
});
