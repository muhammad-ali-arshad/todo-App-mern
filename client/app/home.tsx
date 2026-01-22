import React, { useContext, useEffect, useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, ScrollView, RefreshControl, Animated, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Redirect } from 'expo-router';
import { AuthContext } from '@/context/AuthContext';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import AddButton from '@/components/AddButton';
import TaskCard from '@/components/taskCard';
import EditTaskModal from '@/components/EditTaskModal';
import DeleteButton from '@/components/DeleteButton';
import { fetchTasks, updateTask, createTask, deleteTask } from '@/services/task.service';

interface Task {
  _id?: string;
  id?: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string | Date;
  createdAt?: string;
  updatedAt?: string;
}

export default function HomeScreen() {
  const { logout, isAuthenticated, isLoading } = useContext(AuthContext);
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isTasksLoading, setIsTasksLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(new Set());
  const [animatingTaskIds, setAnimatingTaskIds] = useState<Set<string>>(new Set());
  const deleteButtonOpacity = useRef(new Animated.Value(0)).current;
  const taskAnimations = useRef<Map<string, Animated.Value>>(new Map()).current;

  const loadTasks = useCallback(async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setIsRefreshing(true);
      } else {
        setIsTasksLoading(true);
      }
      const data = await fetchTasks();
      setTasks(data || []);
    } catch (err: any) {
      console.log('Error fetching tasks', err);
      Alert.alert('Error', err?.message || 'Failed to load tasks');
    } finally {
      setIsTasksLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // All hooks must be called before any early returns
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    } 
  }, [isAuthenticated, isLoading]);

  useEffect(() => {
    if (isAuthenticated) {
      loadTasks(false);
    }
  }, [isAuthenticated, loadTasks]);

  // Show/hide delete button based on selection
  useEffect(() => {
    if (selectedTaskIds.size > 0) {
      Animated.timing(deleteButtonOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(deleteButtonOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [selectedTaskIds.size]);

  const onRefresh = () => {
    loadTasks(true);
  };






  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0188ef" />
      </View>
    );
  }






  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }







  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/login');
          },
        },
      ]
    );
  };

  const handleAdd = () => {
    router.push('/addTask');
  };

  const openTaskModal = (task: Task) => {
    setSelectedTask(task);
    setIsEditModalVisible(true);
  };

  const closeEditModal = () => {
    setIsEditModalVisible(false);
    setSelectedTask(null);
  };

  const handleSaveTask = async (taskId: string, updates: { title: string; description: string; dueDate?: Date | null }) => {
    try {
      // Prepare update payload
      const updatePayload: any = {
        title: updates.title,
        description: updates.description,
      };

      // Include dueDate if provided
      if (updates.dueDate) {
        updatePayload.dueDate = updates.dueDate;
      }

      // Call update API
      await updateTask(taskId, updatePayload);

      // Refresh task list
      await loadTasks(false);
    } catch (error: any) {
      console.error('Error updating task', error);
      throw error; // Re-throw to let modal handle the error display
    }
  };

  const toggleTask = async (taskId: string) => {
    // Don't toggle if in selection mode
    if (selectedTaskIds.size > 0) return;

    const task = tasks.find(t => (t._id || t.id) === taskId);
    if (!task) return;

    const id = task._id || task.id;
    if (!id) return;

    const updated = { ...task, completed: !task.completed };

    try {
      // Optimistic UI update
      setTasks(prev =>
        prev.map(t => ((t._id || t.id) === id ? updated : t))
      );
      await updateTask(id, { completed: updated.completed });
    } catch (err: any) {
      console.log('Error updating task', err);
      Alert.alert('Error', err?.message || 'Failed to update task');
      // reload from server to stay in sync
      loadTasks(false);
    }
  };

  // Handle long press to select task
  const handleLongPress = (taskId: string) => {
    if (!taskId) {
      console.warn('[SELECT] Invalid taskId provided:', taskId);
      return;
    }
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    setSelectedTaskIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  // Clear selection when tapping outside
  const handleOutsidePress = () => {
    if (selectedTaskIds.size > 0) {
      setSelectedTaskIds(new Set());
    }
  };

  // Handle task press - edit if not in selection mode, toggle selection if in selection mode
  const handleTaskPress = (task: Task) => {
    if (selectedTaskIds.size > 0) {
      // Toggle selection
      const taskId = task._id || task.id;
      if (taskId) {
        const taskIdStr = String(taskId);
        setSelectedTaskIds(prev => {
          const newSet = new Set(prev);
          if (newSet.has(taskIdStr)) {
            newSet.delete(taskIdStr);
          } else {
            newSet.add(taskIdStr);
          }
          return newSet;
        });
      }
    } else {
      // Open edit modal
      openTaskModal(task);
    }
  };

  // Animated delete with fade + scale
  const handleDelete = async () => {
    if (selectedTaskIds.size === 0) return;

    const idsToDelete = Array.from(selectedTaskIds);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Start animations for all selected tasks
    const animations: Promise<void>[] = [];
    
    idsToDelete.forEach(taskId => {
      if (!taskAnimations.has(taskId)) {
        taskAnimations.set(taskId, new Animated.Value(1));
      }
      const animValue = taskAnimations.get(taskId)!;
      setAnimatingTaskIds(prev => new Set(prev).add(taskId));
      
      animations.push(
        new Promise((resolve) => {
          Animated.timing(animValue, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start(() => resolve());
        })
      );
    });

    // Wait for all animations to complete
    await Promise.all(animations);

    // Delete tasks from backend
    const deleteResults = await Promise.allSettled(
      idsToDelete.map(async (taskId) => {
        try {
          console.log('[DELETE] Attempting to delete task with ID:', taskId);
          await deleteTask(taskId);
          return { taskId, success: true };
        } catch (error: any) {
          console.error('[DELETE] Error deleting task:', taskId, error);
          // Check if it's a "not found" error - in that case, we still want to remove it from UI
          const isNotFound = error?.message?.includes('not found') || 
                           error?.message?.includes('Task not found') ||
                           error?.response?.status === 404;
          return { taskId, success: false, isNotFound, error };
        }
      })
    );

    // Separate successful and failed deletions
    const successfulDeletes: string[] = [];
    const failedDeletes: Array<{ taskId: string; error: any }> = [];
    
    deleteResults.forEach((result) => {
      if (result.status === 'fulfilled') {
        if (result.value.success || result.value.isNotFound) {
          // Success or not found (already deleted) - remove from UI
          successfulDeletes.push(result.value.taskId);
        } else {
          failedDeletes.push({ taskId: result.value.taskId, error: result.value.error });
        }
      } else {
        // Promise rejected
        failedDeletes.push({ taskId: 'unknown', error: result.reason });
      }
    });

    // Remove successfully deleted tasks (and not found tasks) from state
    if (successfulDeletes.length > 0) {
      setTasks(prev => prev.filter(t => {
        const id = t._id || t.id;
        return id && !successfulDeletes.includes(id);
      }));
    }

    // Clean up animations for all attempted deletions
    idsToDelete.forEach(taskId => {
      taskAnimations.delete(taskId);
    });
    
    // Clear selection
    setSelectedTaskIds(new Set());
    setAnimatingTaskIds(new Set());

    // Show error if some deletions failed (but not if they were just "not found")
    const actualFailures = failedDeletes.filter(f => f.taskId !== 'unknown');
    if (actualFailures.length > 0) {
      Alert.alert(
        'Delete Warning', 
        `Deleted ${successfulDeletes.length} task(s). ${actualFailures.length} task(s) could not be deleted.`
      );
    } else if (successfulDeletes.length > 0) {
      // All successful or not found (which we treat as success)
      // No need to show alert for successful deletion
    }
  };

  // Get animation style for a task
  const getTaskAnimationStyle = (taskId: string) => {
    if (!taskAnimations.has(taskId)) {
      taskAnimations.set(taskId, new Animated.Value(1));
    }
    const animValue = taskAnimations.get(taskId)!;
    
    return {
      opacity: animValue,
      transform: [
        {
          scale: animValue,
        },
      ],
    };
  };
  return (
    <SafeAreaView style={styles.container}>


      
      <View style={styles.header}>
        <Text style={styles.title}>Welcome!</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <MaterialIcons name="logout" size={24} color="#0188ef" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.list}>
        <ScrollView
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
        >
          {isTasksLoading && tasks.length === 0 ? (
            <View style={styles.tasksLoadingContainer}>
              <ActivityIndicator size="small" color="#0188ef" />
              <Text style={styles.tasksLoadingText}>Loading tasks...</Text>
            </View>
          ) : tasks.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialIcons name="check-circle" size={60} color="#ccc" />
              <Text style={styles.emptyTitle}>No tasks yet</Text>
              <Text style={styles.emptySubtitle}>Tap the + button to add your first task</Text>
            </View>
          ) : (
            tasks.map(task => {
              // Ensure we use _id first (MongoDB format), then fallback to id
              const taskId = task._id || task.id;
              if (!taskId) {
                console.warn('[RENDER] Task missing ID:', task);
                return null;
              }
              
              // Convert to string to ensure consistent comparison
              const taskIdStr = String(taskId);
              
              const isSelected = selectedTaskIds.has(taskIdStr);
              const isAnimating = animatingTaskIds.has(taskIdStr);
              
              return (
                <TaskCard
                  key={taskIdStr}
                  task={task}
                  onPressCard={() => handleTaskPress(task)}
                  onPressCheckBox={() => {
                    if (taskIdStr && selectedTaskIds.size === 0) {
                      toggleTask(taskIdStr);
                    }
                  }}
                  onLongPress={() => handleLongPress(taskIdStr)}
                  isSelected={isSelected}
                  animatedStyle={isAnimating ? getTaskAnimationStyle(taskIdStr) : undefined}
                />
              );
            })
          )}
        </ScrollView>
      </View>

      <AddButton onPress={handleAdd} />

      {/* Floating Delete Button */}
      {selectedTaskIds.size > 0 && (
        <DeleteButton
          onPress={handleDelete}
          count={selectedTaskIds.size}
          animatedStyle={{
            opacity: deleteButtonOpacity,
            transform: [
              {
                scale: deleteButtonOpacity.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                }),
              },
            ],
          }}
        />
      )}

      {/* Edit Task Modal */}
      <EditTaskModal
        visible={isEditModalVisible}
        task={selectedTask}
        onClose={closeEditModal}
        onSave={handleSaveTask}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#222',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  logoutText: {
    marginLeft: 6,
    fontSize: 16,
    color: '#0188ef',
    fontWeight: '500',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100, // Extra padding for FAB
  },
  tasksLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  tasksLoadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});
