import { View, Text, TextInput, StyleSheet, ScrollView, Image, Pressable, Alert } from 'react-native'
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import { router } from 'expo-router'
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types';

const logo = require('../assets/images/MemoryCompanionLogo.png')

export default function ForgotPasswordScreen() {
  const [emailOrName, setEmailOrName] = useState('');

  const handleResetPassword = async () => {
    try {
      if(!emailOrName.trim()) {
        Alert.alert('Error', 'Please enter your email or name');
        return;
      }

      //get users from storage
      const usersJson = await AsyncStorage.getItem('users');
      if(!usersJson) {
        Alert.alert('Error', 'Something went wrong');
        return;
      }

      const users = JSON.parse(usersJson) as User[];

      //find user by email or name
      const user = users.find(u => 
        u.email.toLowerCase() === emailOrName.toLowerCase() ||
        u.name.toLowerCase() === emailOrName.toLowerCase()
      );

      if(!user) {
        Alert.alert('Error', 'User not found');
        return;
      }

      // In a real app should:
      // 1. Generate a reset token
      // 2. Send an email with a reset link
      // 3. Store the token with an expiration time

      // for demo purposes, let user reset directly
      Alert.alert(
        'Reset password',
        'Do you want to reset your password?',
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Yes',
            onPress: () => {
              router.push({
                pathname: '/reset-password',
                params: { email: user.email }
              })
            }
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
            <Text style={styles.pageTitle}>Send email to</Text>
            <Text style={styles.pageTitle}>reset your password.</Text>
          </View>

          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email Address / Name"
              value={emailOrName}
              onChangeText={setEmailOrName}
              autoCapitalize='none'
              keyboardType='email-address'
            />
          </View>
        </View>

        <View style={styles.bottomContainer}>
          <Pressable style={styles.buttonMain} onPress={handleResetPassword}>
            <Text style={styles.buttonTextMain}>Send</Text>
          </Pressable>
          <View style={styles.optionContainer}>
            <Text style={styles.optionText}>Remember your password?</Text>
            <Pressable onPress={() => router.push('/signin')}>
              <Text style={styles.optionTextLink}>Login</Text>
            </Pressable>
          </View>
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