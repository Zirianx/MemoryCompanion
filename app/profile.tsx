import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable, TouchableOpacity, Modal } from 'react-native'
import { FontAwesome, FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import { Avatar } from "react-native-elements";
import { router } from 'expo-router'

// const noReminder = require('../assets/images/reminder-none.png')
const UserImage = require('@/assets/images/user.png')

export default function ProfileScreen() {
  const [menuVisible, setMenuVisible] = useState<boolean>(false);

  const onEdit = (): void => {
    console.log('Edit Pressed');
  };

  const onLogout = (): void => {
    router.replace('/signin');
  };

  const seePassword = (): void => {
    console.log('See Password Pressed');
  };

  const handleMenuPress = (): void => {
    setMenuVisible(!menuVisible);
  }

  const handleOption = (action: 'logout' | 'edit'): void => {
    setMenuVisible(false);

    if(action === 'edit') {
      onEdit();
    } else if (action === 'logout') {
      onLogout();
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
            <Avatar rounded source={UserImage} size="large" />
            <Text style={styles.pageTitle}>John Doe</Text>
          </View>
        </View>

        <View style={styles.bottomContainer}>
          <View style={styles.profileContainer}>
            <FontAwesome name="birthday-cake" size={24} color="#C44569" />
            <View style={styles.profileDetail}>
              <Text style={styles.profileTitle}>Birthdate</Text>
              <Text style={styles.detail}>01/01/1980</Text>
            </View>
          </View>

          <View style={styles.profileContainer}>
            <FontAwesome6 name="location-dot" size={24} color="#FF6348" />
            <View style={styles.profileDetail}>
              <Text style={styles.profileTitle}>Address</Text>
              <Text style={styles.detail}>No. 82, Lorong Mahkota, Kuala Lumpur, 45800</Text>
            </View>
          </View>

          <View style={styles.profileContainer}>
            <FontAwesome name="mobile-phone" size={24} color="#778BEB" />
            <View style={styles.profileDetail}>
              <Text style={styles.profileTitle}>Mobile No.</Text>
              <Text style={styles.detail}>+6011-5299577</Text>
            </View>
          </View>
          
          <View style={styles.profileContainer}>
            <FontAwesome name="envelope" size={24} color="#2ED573" />
            <View style={styles.profileDetail}>
              <Text style={styles.profileTitle}>Email Address</Text>
              <Text style={styles.detail}>johndoe@gmail.com</Text>
            </View>
          </View>

          <View style={styles.profileContainer}>
            <FontAwesome5 name="key" size={24} color="#ECCC68" />
            <View style={styles.profileDetail}>
              <Text style={styles.profileTitle}>Password</Text>
              <Text style={styles.detailPassword}>••••••••••••</Text>

              <View style={styles.seePassword}>
                <TouchableOpacity onPress={seePassword}>
                  <FontAwesome6 name="eye-low-vision" size={16} color="#333" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

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
    maxWidth: 250,
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
});