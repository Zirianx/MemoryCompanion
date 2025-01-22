import React from 'react';
import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import { useAuth } from "../context/AuthContext";

function RootLayoutNav() {
  const { loading } = useAuth();

  if(loading) {
    return null; // or return a loading screen
  }

  return (
      <Stack screenOptions={{ headerShown: false }}>
        {/* Auth screens */}
        <Stack.Screen name="signin" options={{ title: 'Sign In' }} />
        <Stack.Screen name="signup" options={{ title: 'Sign Up' }} />
        <Stack.Screen name="forgotpassword" options={{ title: 'Forgot Password' }} />

        {/* Protected screens */}
        <Stack.Screen name="index" options={{ title: 'Home' }} />
        <Stack.Screen name="profile" options={{ title: 'Profile' }} />
        <Stack.Screen name="reminder" options={{ title: 'Reminder' }} />
        <Stack.Screen name="digitaldiary" options={{ title: 'Digital Diary' }} />
        <Stack.Screen name="meditationguide" options={{ title: 'Meditation Guide' }} />
        <Stack.Screen name="relaxationmusic" options={{ title: 'Relaxation Music' }} /> 

        <Stack.Screen name="meditateone" options={{ title: 'Learn Meditation' }} /> 
        <Stack.Screen name="meditatetwo" options={{ title: 'Relax Yourself' }} /> 
        <Stack.Screen name="meditatethree" options={{ title: 'Relieve Stress' }} /> 
        <Stack.Screen name="meditatefour" options={{ title: 'Breathwork' }} /> 
        <Stack.Screen name="meditatefive" options={{ title: 'Focused Attention' }} /> 
        <Stack.Screen name="meditatesix" options={{ title: 'Care For Yourself' }} /> 
      </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  )
}
