import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="signin" options={{ title: 'Sign In' }} />
      <Stack.Screen name="signup" options={{ title: 'Sign Up' }} />
      <Stack.Screen name="forgotpassword" options={{ title: 'Forgot Password' }} />

      <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen name="profile" options={{ title: 'Profile' }} />
      <Stack.Screen name="reminder" options={{ title: 'Reminder' }} />
      <Stack.Screen name="digitaldiary" options={{ title: 'Digital Diary' }} />
      <Stack.Screen name="meditationguide" options={{ title: 'Meditation Guide' }} />
      <Stack.Screen name="relaxationmusic" options={{ title: 'Relaxation Music' }} />
    </Stack>
  );
}
