import { View, Text, TextInput, StyleSheet, ScrollView, Image, Pressable } from 'react-native'
import React, { useState, useEffect } from 'react';
import { FontAwesome, FontAwesome5, FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import DateTimePicker from '@react-native-community/datetimepicker'

const noReminder = require('../assets/images/reminder-none.png')

// Define the Task interface
interface Task {
  id: string;
  date: Date;
  task: string;
}

export default function ReminderScreen() {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)

  // Load tasks from AsyncStorage when component mounts
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const savedTasks = await AsyncStorage.getItem('tasks');
      if(savedTasks) {
        setTasks(JSON.parse(savedTasks).map((task: Task) => ({
          ...task,
          date: new Date(task.date)
        })));
      }
    } catch (err) {
      console.error('Error loading tasks:', err);
    }
  };

  const saveTasks = async (updatedTask: Task[]) => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTask));
    } catch (err) {
      console.error('Error saving tasks:', err);
    }
  };

  const handleAddTask = () => {
    if(newTask.trim()) {
      const newTaskItem: Task = {
        id: Date.now().toString(),
        date: selectedDate,
        task: newTask.trim()
      };

      const updatedTasks = [...tasks, newTaskItem];
      setTasks(updatedTasks);
      saveTasks(updatedTasks);

      //reset form input
      setNewTask('');
      setIsAddingNew(false);
      setSelectedDate(new Date());
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    //filter out the tasks with the given id
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);

    //save the updated tasks to storage
    await saveTasks(updatedTasks);
  };

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if(date) {
      setSelectedDate(date);
    }
  };

  const formatInputDate = (date: Date): string => {
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
  };

  const formatDisplayDate = (date: Date): string => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
  
    // Reset time part for accurate day comparison
    const compareDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const compareToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const compareTomorrow = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());
  
    if (compareDate.getTime() === compareToday.getTime()) {
      return 'Today';
    } else if (compareDate.getTime() === compareTomorrow.getTime()) {
      return 'Tomorrow';
    } else {
      // Format as dd/mm
      return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

      <View style={styles.topNav}>
        <View style={styles.leftContainer}>
          <Pressable onPress={() => router.back()}>
            <FontAwesome6 name="arrow-left" size={28} color="#333" />
          </Pressable>
        </View>
        <Text style={styles.title}>Reminder</Text>
        <View style={styles.rightContainer}>
          {/* <FontAwesome6 name="magnifying-glass" size={28} color="#333" /> */}
        </View>
      </View>

      <View style={styles.pageContainer}>
        <View style={styles.topContainer}>
          <View style={styles.titleContainer}>
            <FontAwesome name="bell" size={28} color="#ECCC68" />
            <Text style={styles.pageTitle}>Set your reminder</Text>
          </View>

          {tasks.length > 0 && (
            <View style={styles.reminderContainer}>
            {tasks.map(task => (
              <View key={task.id} style={styles.taskItem}>
                <View style={styles.eachTask}>
                  <MaterialCommunityIcons style={styles.taskIcon} name="clock" size={24} color="#596275" />
                  <Text style={styles.task}>{formatDisplayDate(task.date)} - {task.task}</Text>
                </View>
                <Pressable
                  onPress={() => handleDeleteTask(task.id)}
                  style={styles.deleteButton}
                >
                  <FontAwesome5 name="trash" size={20} color="#FF6881" />
                </Pressable>
              </View>
            ))}
            </View>
          )}
        </View>

        <View style={styles.bottomContainer}>
          <View style={styles.addReminderContainer}>
            <Pressable style={styles.addButtonFeature} onPress={() => setIsAddingNew(!isAddingNew)}>
              <FontAwesome6 name="circle-plus" size={24} color="#596275" />
              <Text>Add a new reminder</Text>
            </Pressable>
          </View>

          {isAddingNew == true && (
            <View style={styles.formContainer}>
              <Pressable style={styles.input} onPress={() => setShowDatePicker(true)}>
                <Text>{formatInputDate(selectedDate)}</Text>
              </Pressable>

              {showDatePicker && (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  onChange={handleDateChange}
                />
              )}

              <TextInput
                style={styles.input}
                placeholder="Task"
                value={newTask}
                onChangeText={setNewTask}
              />

              <Pressable style={styles.buttonMain} onPress={handleAddTask}>
                <Text style={styles.buttonTextMain}>Add</Text>
              </Pressable>
            </View>
          )}

          {!(tasks.length > 0) && (
            <View style={styles.noContainer}>
              <Image source={noReminder} style={{ width: 250, height: 250 }} />
              <Text style={styles.noContent}>You don't have any reminder yet.</Text>
            </View>
          )}

        </View>
      </View>

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 24,
  },
  container: {
    flex: 1,
    backgroundColor: '#FEFAF1',
  },
  topNav: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    marginTop: 14,
    marginBottom: 20,
    paddingHorizontal: 14,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  leftContainer: {
    position: 'absolute',
    left: 30,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  rightContainer: {
    position: 'absolute',
    right: 30,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  pageContainer: {
    flex: 1,
    paddingHorizontal: 28,
  },
  topContainer: {

  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pageTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  reminderContainer: {
    backgroundColor: '#fff',
    marginTop: 12,
    paddingHorizontal: 18,
    paddingVertical: 18,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  reminder: {
    fontSize: 14,
    color: '#333',
  },
  bottomContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    flexWrap: 'wrap',
    gap: 30,
    marginTop: 48,
  },
  addReminderContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addButtonFeature: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  buttonMain: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 28,
    backgroundColor: '#2ED573',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonTextMain: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {

  },
  formContainer: {
    width: '100%',
    marginTop: 24,
    marginBottom: 48,
    gap: 12,
  },
  input: {
    height: 48,
    paddingHorizontal: 24,
    backgroundColor: '#fff',
    borderRadius: 24,
    fontSize: 16,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eachTask: {
    paddingVertical: 4,
    flexDirection: 'row',
    maxWidth: 200,
  },
  taskIcon: {
    width: 32,
  },
  task: {
    fontSize: 16,
    color: '#333',
  },
  noContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  noContent: {
    textAlign: 'center',
    maxWidth: 150,
  },
});