import { View, Text, TextInput, StyleSheet, ScrollView, Image, Pressable, Alert } from 'react-native'
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router'
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types';

const logo = require('../assets/images/MemoryCompanionLogo.png')

export default function ForgotPasswordScreen() {
  const { email } = useLocalSearchParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdatePassword = async () => {
    try {
      //validation
      if(!newPassword || !confirmPassword) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }

      if(newPassword !== confirmPassword) {
        Alert.alert('Error', 'Password do not match');
        return;
      }

      const usersJson = await AsyncStorage.getItem('users');
      if(!usersJson) {
        Alert.alert('Error', 'Something went wrong');
        return;
      }

      const users = JSON.parse(usersJson) as User[];

      //update user's password
      const updatedUsers = users.map(user => {
        if(user.email === email) {
            return { ...user, password: newPassword };
        }
        return user;
      });

      await AsyncStorage.setItem('users', JSON.stringify(updatedUsers));

      Alert.alert(
        'Success',
        'Password has been reset successfully',
        [
            {
                text: 'OK',
                onPress: () => router.push('/signin')
            }
        ]
      );

    } catch (err) {
      console.error('Error resetting password', err);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

      <View style={styles.topNav}>
          <Image source={logo} style={{ width: 240, resizeMode: 'contain' }} />
      </View>

      <View style={styles.pageContainer}>
        <View style={styles.topContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.pageTitle}>Reset your password</Text>
          </View>

          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="New Password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>
        </View>

        <View style={styles.bottomContainer}>
          <Pressable style={styles.buttonMain} onPress={handleUpdatePassword}>
            <Text style={styles.buttonTextMain}>Reset Password</Text>
          </Pressable>
        </View>
      </View>

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 30,
  },
  container: {
    flex: 1,
    backgroundColor: '#FEFAF1',
  },
  topNav: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    marginTop: 8,
    marginBottom: 8,
    paddingHorizontal: 14,
    paddingVertical: 100,
  },
  formContainer: {
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
  forgotPassword: {
    fontSize: 16,
    fontWeight: 700,
    textAlign: 'right',
  },
  pageContainer: {
    flex: 1,
    paddingHorizontal: 28,
  },
  topContainer: {

  },
  titleContainer: {
    flexDirection: 'column',
    marginLeft: 24,
  },
  pageTitle: {
    fontWeight: 'bold',
    fontSize: 24,
  },
  bottomContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 8,
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
  optionContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  optionText: {
    fontSize: 16,
  },
  optionTextLink: {
    color: '#2ED573',
    fontSize: 16,
  },
});