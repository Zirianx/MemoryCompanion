import { View, Text, TextInput, StyleSheet, ScrollView, Image, Pressable } from 'react-native'
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import { router } from 'expo-router'
import { Redirect } from "expo-router";
import { useAuth } from "../context/AuthContext";
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useEffect, useState } from 'react';
import { User } from '@/types'

const logo = require('../assets/images/MemoryCompanionLogo.png')

export default function SignInScreen() {
  const { user, signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

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

  const handleSignIn = async () => {
    if(!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    const success = await signIn(email, password);
    if(!success) {
      setError('Invalid email or password');
    }
  }

  if(user) {
    return <Redirect href="/" />;
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

      <View style={styles.topNav}>
          <Image source={logo} style={{ width: 240, resizeMode: 'contain' }} />
      </View>

      <View style={styles.pageContainer}>
        <View style={styles.topContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.pageTitle}>Welcome back!</Text>
            <Text style={styles.pageTitle}>Sign in to continue.</Text>
          </View>

          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <Pressable onPress={() => router.push('/forgotpassword')}>
              <Text style={styles.forgotPassword}>Forgot password?</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.bottomContainer}>
          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable style={styles.buttonMain} onPress={handleSignIn}>
            <Text style={styles.buttonTextMain}>Login</Text>
          </Pressable>
          <View style={styles.optionContainer}>
            <Text style={styles.optionText}>Don't have account?</Text>
            <Pressable onPress={() => router.push('/signup')}>
              <Text style={styles.optionTextLink}>Sign Up</Text>
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
  error: {
    color: 'red',
    textAlign: 'center',
  },
});