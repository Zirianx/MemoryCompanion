import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable, TouchableOpacity, Modal, TextInput } from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome, FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import { Avatar } from "react-native-elements";
import { router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, EditableUserFields } from '../types'
import { useAuth } from '@/context/AuthContext';

// const noReminder = require('../assets/images/reminder-none.png')
const UserImage = require('@/assets/images/default-user.png')

export default function ProfileScreen() {
  const { user, setUser, signOut } = useAuth();
  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedUser, setEditedUser] = useState<EditableUserFields>({
    name: user?.name || '',
    image: user?.image || '',
    birthdate: user?.birthdate || '',
    address: user?.address || '',
    mobileNo: user?.mobileNo || '',
  });

  const handleMenuPress = (): void => {
    setMenuVisible(!menuVisible);
  }

  const handleOption = async (action: 'logout' | 'edit'): Promise<void> => {
    setMenuVisible(false);

    if(action === 'edit') {
      setIsEditing(true);
    } else if (action === 'logout') {
      try {
        await signOut();
        router.replace('/signin');
      } catch (err) {
        console.error('Error during logout:', err);
      }
    }
  }

  const handleSave = async () => {
    try {
      // Get current users array
      const usersJson = await AsyncStorage.getItem('users');
      const users: User[] = usersJson ? JSON.parse(usersJson) : [];

      // Preserve email and password while updating other fields
      const updatedUsers = users.map(u => {
        if(u.email === user?.email) {
          return {
            ...u,
            ...editedUser
          };
        }
        return u;
      });

      // Save updated users array
      await AsyncStorage.setItem('users', JSON.stringify(updatedUsers));

      // For current user, preserve email and password
      const updatedUser: User = { 
        ...user!, // Keep existing user data including email and password
        ...editedUser // Update editable fields
      };

      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditing(false);
      alert('Profile updated successfully');
    } catch (err) {
      console.error('Error saving user data:', err);
    }
  }

  const handleCancel = () => {
    setEditedUser({
      name: user?.name || '',
      image: user?.image || '',
      birthdate: user?.birthdate || '',
      address: user?.address || '',
      mobileNo: user?.mobileNo || '',
    });
    setIsEditing(false);
  }

  const pickImage = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if(status !== 'granted') {
        alert('Sorry, we need camera roll permissions to change your profile picture.');
        return;
      }

      // Pick image
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
        base64: true,
      })

      if(!result.canceled && result.assets[0].base64) {
        setEditedUser(prev => ({
          ...prev,
          image: `data:image/jpeg;base64,${result.assets[0].base64}`
        }));
      }
    } catch (err) {
      console.error('Error picking image', err);
      alert('Error picking image');
    }
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

      <View style={styles.topNav}>
        <View style={styles.leftContainer}>
          <Pressable onPress={() => router.back()}>
            <FontAwesome6 name="arrow-left" size={28} color="#333" />
          </Pressable>
        </View>
        <Text style={styles.title}>Profile</Text>
        <View style={styles.rightContainer}>
          <TouchableOpacity onPress={handleMenuPress}>
            <FontAwesome name="gear" size={28} color="#333" />
          </TouchableOpacity>

          <Modal
            transparent={true}
            visible={menuVisible}
            animationType="fade"
            onRequestClose={() => setMenuVisible(false)}
          >
            <TouchableOpacity
              style={styles.modalOverlay}
              onPress={() => setMenuVisible(false)}
            >
              <View style={[styles.menuContainer, { top: 50, right: 20 }]}>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleOption('edit')}
                >
                  <FontAwesome name="edit" size={20} color="#333" />
                  <Text style={styles.menuText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleOption('logout')}
                >
                  <FontAwesome name="sign-out" size={20} color="#333" />
                  <Text style={styles.menuText}>Logout</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>

        </View>
      </View>

      <View style={styles.pageContainer}>
        <View style={styles.topContainer}>
          <View style={styles.titleContainer}>
            <TouchableOpacity
              onPress={isEditing ? pickImage : undefined}
            >
              {(editedUser.image || user?.image) ? (
                <Avatar 
                  rounded 
                  source={{ uri: editedUser.image || user?.image }} 
                  size="large" 
                />
              ) : (
                <Avatar rounded source={UserImage} size="large" />
              )}
              {isEditing && (
                <View style={styles.editImageOverlay}>
                  <FontAwesome name="camera" size={20} color="#fff" />
                </View>
              )}
            </TouchableOpacity>
            
            {isEditing ? (
              <TextInput 
                style={styles.editInput}
                value={editedUser.name}
                onChangeText={(text) => setEditedUser(prev => ({ ...prev, name: text }))}
                placeholder="Username"
              />
            ) : (
              <Text style={styles.pageTitle}>{user?.name}</Text>
            )}
          </View>
        </View>

        <View style={styles.bottomContainer}>
          <View style={styles.profileContainer}>
            <FontAwesome name="birthday-cake" size={24} color="#C44569" />
            <View style={styles.profileDetail}>
              <Text style={styles.profileTitle}>Birthdate</Text>
              {isEditing ? (
                <TextInput
                  style={styles.editInput}
                  value={editedUser.birthdate}
                  onChangeText={(text) => setEditedUser(prev => ({ ...prev, birthdate: text }))}
                  placeholder="DD/MM/YYYY"
                />
              ) : (
                <Text style={styles.detail}>{user?.birthdate || '-'}</Text>
              )}
            </View>
          </View>

          <View style={styles.profileContainer}>
            <FontAwesome6 name="location-dot" size={24} color="#FF6348" style={{ marginRight: 6 }} />
            <View style={styles.profileDetail}>
              <Text style={styles.profileTitle}>Address</Text>
              {isEditing ? (
                <TextInput
                  style={styles.editInput}
                  value={editedUser.address}
                  onChangeText={(text) => setEditedUser(prev => ({ ...prev, address: text }))}
                  placeholder="Address"
                  multiline
                />
              ) : (
                <Text style={styles.detail}>{user?.address || '-'}</Text>
              )}
            </View>
          </View>

          <View style={styles.profileContainer}>
            <FontAwesome name="mobile-phone" size={42} color="#778BEB" style={{ marginRight: 6 }} />
            <View style={styles.profileDetail}>
              <Text style={styles.profileTitle}>Mobile No.</Text>
              {isEditing ? (
                <TextInput
                  style={styles.editInput}
                  value={editedUser.mobileNo}
                  onChangeText={(text) => setEditedUser(prev => ({ ...prev, mobileNo: text }))}
                  placeholder="Mobile No."
                />
              ) : (
                <Text style={styles.detail}>{user?.mobileNo || '-'}</Text>
              )}
            </View>
          </View>
          
          <View style={styles.profileContainer}>
            <FontAwesome name="envelope" size={24} color="#2ED573" />
            <View style={styles.profileDetail}>
              <Text style={styles.profileTitle}>Email Address</Text>
              <Text style={styles.detail}>{user?.email}</Text>
            </View>
          </View>

          <View style={styles.profileContainer}>
            <FontAwesome5 name="key" size={24} color="#ECCC68" />
            <View style={styles.profileDetail}>
              <Text style={styles.profileTitle}>Password</Text>
              <Text style={styles.detail}>
                {showPassword ? user?.password : '•'.repeat(user?.password?.length || 0)}
              </Text>

              <View style={styles.seePassword}>
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <FontAwesome6 name="eye-low-vision" size={16} color="#333" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {isEditing && (
            <View style={styles.editButtonsContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          )}

        </View>
      </View>

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 36,
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
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  pageTitle: {
    fontWeight: 700,
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
    flexDirection: 'column',
    flexWrap: 'wrap',
    gap: 30,
    marginTop: 48,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  profileDetail: {
    flexDirection: 'column',
  },
  profileTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  detail: {
    maxWidth: 240,
    lineHeight: 20,
  },
  detailPassword: {
    maxWidth: 250,
    lineHeight: 20,
    fontSize: 24,
    marginTop: 4,
  },
  seePassword : {
    position: 'absolute',
    right: -160,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  noContent: {
    textAlign: 'center',
    maxWidth: 150,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuContainer: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: 120,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  menuText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  editInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 8,
    backgroundColor: '#fff',
    minWidth: 200,
    marginTop: 8,
  },
  editButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  saveButton: {
    backgroundColor: '#2ED573',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: '#FF4757',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  editImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});