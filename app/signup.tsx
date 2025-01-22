import { View, Text, TextInput, StyleSheet, ScrollView, Image, Pressable } from 'react-native'
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import { router } from 'expo-router'
import React, { useState, useEffect } from 'react';
import { useAuth } from "../context/AuthContext";

const logo = require('../assets/images/MemoryCompanionLogo.png')

export default function SignUpScreen() {
  const { user, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      router.replace('/');
    }
  }, [user]);

  const handleSignUp = async () => {
    if(!email || !name || !password) {
      setError('Please fill in all fields');
      return;
    }

    const success = await signUp(email, name, password);
    if(!success) {
      setSuccess('');
      setError('Email already exists or registration failed');
    } else {
      setError('');
      setSuccess('Account successfully registered');
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
            <Text style={styles.pageTitle}>Hello, create</Text>
            <Text style={styles.pageTitle}>your account for free.</Text>
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
              placeholder="Name"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            {success ? <Text style={styles.success}>{success}</Text> : null}
          </View>
        </View>

        <View style={styles.bottomContainer}>
          <Pressable style={styles.buttonMain} onPress={handleSignUp}>
            <Text style={styles.buttonTextMain}>Sign Up</Text>
          </Pressable>
          <View style={styles.optionContainer}>
            <Text style={styles.optionText}>Already have an account?</Text>
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
  error: {
    color: 'red',
    textAlign: 'center',
  },
  success: {
    color: 'green',
    textAlign: 'center',
  },
});