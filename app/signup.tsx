import { View, Text, TextInput, StyleSheet, ScrollView, Image, Pressable } from 'react-native'
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import { router } from 'expo-router'

const logo = require('../assets/images/MemoryCompanionLogo.png')

export default function SignUpScreen() {
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
              // Optional props:
              // onChangeText={(text) => handleFirstInput(text)}
              // value={firstValue}
            />
            <TextInput
              style={styles.input}
              placeholder="Name"
              // Optional props:
              // onChangeText={(text) => handleSecondInput(text)}
              // value={secondValue}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              // Optional props:
              // onChangeText={(text) => handleSecondInput(text)}
              // value={secondValue}
            />
          </View>
        </View>

        <View style={styles.bottomContainer}>
          <Pressable style={styles.buttonMain}>
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
});