import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import Modal from 'react-native-modal';
import * as MediaLibrary from 'expo-media-library';
import ConfettiCannon from 'react-native-confetti-cannon';
import { Link, useFocusEffect } from "expo-router";
import { Avatar } from "react-native-elements";
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useState, useEffect, useRef } from 'react';
import { Redirect } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { User } from "@/types";
// import FontAwesome from '@expo/vector-icons/FontAwesome';

import BoxButton from "./components/BoxButton";

import ReminderIcon from '../assets/icons/reminder.svg'
import DigitalDiaryIcon from '../assets/icons/digitaldiary.svg'
import MeditationGuideIcon from '../assets/icons/meditationguide.svg'
import RelaxationMusicIcon from '../assets/icons/relaxationmusic.svg'

const UserImage = require('@/assets/images/default-user.png')

// Define the interfaces
interface Task {
  id: string;
  date: Date;
  task: string;
}

interface PhotoEvent {
  id: string;
  uri: string;
  creationTime: number;
}

export default function Index() {
  const [isReminderVisible, setIsReminderVisible] = useState(false);
  const [photoEvents, setPhotoEvents] = useState<PhotoEvent[]>([]);
  const [currentPhoto, setCurrentPhoto] = useState<PhotoEvent | null>(null);
  const [tasks, setTasks] = useState<Task[]>([])
  const { user } = useAuth();
  const confettiRef = useRef<any>(null);
  
  // Load tasks from AsyncStorage when component mounts
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

  const resetPhotoMemories = () => {
    setIsReminderVisible(false);
    setCurrentPhoto(null);
    setPhotoEvents([]); // Reset all scanned photos
  };

  //if gallery have album
  const getAlbumName = async (albumId: string) => {
    try {
      const album = await MediaLibrary.getAlbumAsync(albumId);
      return album.title;
    } catch (err) {
      console.error('Error getting album name:', err);
      return undefined;
    }
  }

  const scanPhotos = async () => {
    try {
      //request permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if(status !== 'granted') {
        console.log('Permission to access media library was denied');
        return;
      }

      //get all photos
      const { assets } = await MediaLibrary.getAssetsAsync({
        mediaType: 'photo',
        first: 50, //limit to most recent 50 photos
        sortBy: MediaLibrary.SortBy.creationTime,
      });

      const photos = assets.map((asset) => ({
        id: asset.id,
        uri: asset.uri,
        creationTime: asset.creationTime,
      }));

      setPhotoEvents(photos);
    } catch (err) {
      console.error('Error scanning photos:', err);
    }
  }

  const checkPhotoMemories = () => {
    const today = new Date();

    const relevantPhoto = photoEvents.find(photo => {
      const photoDate = new Date(photo.creationTime);
      const daysDiff = Math.floor((today.getTime() - photoDate.getTime()) / (1000 * 3600 * 24));

      //check if photo is from a week ago (days 7 until days 14)
      return daysDiff >= 0 && daysDiff <= 14;
    });

    if(relevantPhoto) {
      setCurrentPhoto(relevantPhoto);
      setIsReminderVisible(true);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadTasks();
      scanPhotos().then(() => {
        checkPhotoMemories();
      })
    }, [])
  );

  useEffect(() => {
    const checkStorage = async () => {
      try {
        const users = await AsyncStorage.getItem('users');

        if(!users) {
          console.log('No users found in storage');
          return;
        }

        const parsedUsers = JSON.parse(users);

        const usersWithoutImage = parsedUsers.map((user: User) => {
          const { image, ...userWithoutImage } = user;
          return userWithoutImage;
        });
        
        console.log('Stored user:', usersWithoutImage);
  
      } catch (err) {
        console.error('Error reading storage:', err);
      }
    };
    
    checkStorage();
  }, [])

  if(!user) {
    return <Redirect href="/signin" />;
  }

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
        <Text style={styles.title}>Home</Text>
        <View style={styles.avatarContainer}>
          <Link href="/profile">
            { user?.image ? (
              <Avatar rounded source={{ uri: user?.image }} size="medium" />
            ) : (
              <Avatar rounded source={UserImage} size="medium" />
            )}
          </Link>
        </View>
      </View>

      <View style={styles.pageContainer}>
        <View style={styles.topContainer}>
          <View style={styles.titleContainer}>
            <FontAwesome name="bell" size={28} color="#ECCC68" />
            <Text style={styles.pageTitle}>Reminder</Text>
          </View>

          {!(tasks.length > 0) && (
            <View style={styles.reminderContainer}>
              <Text style={styles.reminder}>No reminder set.</Text>
            </View>
          )}

          {tasks.length > 0 && (
            <View style={styles.reminderContainer}>
            {tasks.map(task => (
              <View key={task.id} style={styles.taskItem}>
                <MaterialCommunityIcons style={styles.taskIcon} name="clock" size={24} color="#596275" />
                <Text style={styles.task}>{formatDisplayDate(task.date)} - {task.task}</Text>
              </View>
            ))}
            </View>
          )}
        </View>

        <View style={styles.bottomContainer}>
          <View style={styles.boxButtonContainer}>
            <BoxButton 
              icon={ReminderIcon}
              backgroundColor="#ECCC68"
              textColor="#fff"
              href="/reminder"
            />
            <Text style={styles.buttonTitle}>Reminder</Text>
          </View>

          <View style={styles.boxButtonContainer}>
            <BoxButton 
              icon={DigitalDiaryIcon}
              backgroundColor="#778BEB"
              textColor="#fff"
              href="/digitaldiary"
            />
            <Text style={styles.buttonTitle}>Digital Diary</Text>
          </View>

          <View style={styles.boxButtonContainer}>
            <BoxButton 
              icon={MeditationGuideIcon}
              backgroundColor="#FF6348"
              textColor="#fff"
              href="/meditationguide"
            />
            <Text style={styles.buttonTitle}>Meditation Guide</Text>
          </View>

          <View style={styles.boxButtonContainer}>
            <BoxButton 
              icon={RelaxationMusicIcon}
              backgroundColor="#C44569"
              textColor="#fff"
              href="/relaxationmusic"
            />
            <Text style={styles.buttonTitle}>Memory Bank Music</Text>
          </View>
        </View>
      </View>

      <Modal
        isVisible={isReminderVisible}
        onBackdropPress={() => setIsReminderVisible(false)}
        backdropOpacity={0.7}
        animationIn="fadeIn"
        animationOut="fadeOut"
        style={styles.modalView}
        onModalShow={() => {
          //trigger confetti when modal shows
          confettiRef.current?.start();
        }}
      >
        <View style={styles.modalContainer}>
          {/* <ConfettiCannon 
            ref={confettiRef}
            count={200}
            origin={{x: -10, y: 0}}
            autoStart={false}
            fadeOut={true}
            fallSpeed={3000}
            colors={['#FFD700', '#FFA500', '#FF6348', '#778BEB']}
          /> */}

          {currentPhoto && (
            <>
              <Text style={styles.memoryText}>
                Do you remember this?
              </Text>
              <Image 
                source={{ uri: currentPhoto.uri }}
                style={styles.memoryImage}
                resizeMode="contain"
              />
              <Text style={styles.memoryText}>
                You just turned 40 years old last week!
                This is your birthday photo.
              </Text>
              <TouchableOpacity
                style={styles.okButton}
                onPress={() => setIsReminderVisible(false)}
              >
                <Text style={styles.okButtonText}>OK</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </Modal>

      {/* <TouchableOpacity 
        onPress={() => {
          resetPhotoMemories();
          scanPhotos(); // Re-scan photos after reset
        }}
      >
        <Text>Reset Photo Memories</Text>
      </TouchableOpacity> */}

    </ScrollView>
  );
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
  avatarContainer: {
    position: 'absolute',
    right: 14,
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 30,
    marginTop: 48,
  },
  boxButtonContainer: {
    gap: 10,
    alignItems: 'center',
  },
  buttonTitle: {
    fontWeight: '600',
    fontSize: 16,
    maxWidth: 100,
    textAlign: 'center',
  },
  taskItem: {
    paddingVertical: 4,
    flexDirection: 'row',
  },
  taskIcon: {
    width: 32,
  },
  task: {
    fontSize: 16,
    color: '#333',
  },
  //memory popup
  modalView: {
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  memoryImage: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginBottom: 20,
  },
  memoryText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 24,
    color: '#fff',
    lineHeight: 24,
    fontWeight: '500',
  },
  okButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 48,
    borderRadius: 24,
  },
  okButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
});