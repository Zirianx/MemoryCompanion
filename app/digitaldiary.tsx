import { View, Text, StyleSheet, ScrollView, Image, Pressable } from 'react-native'
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import { router } from 'expo-router'

const noDiary = require('../assets/images/diary-none.png')

export default function DigitalDiaryScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

      <View style={styles.topNav}>
        <View style={styles.leftContainer}>
          <Pressable onPress={() => router.back()}>
            <FontAwesome6 name="arrow-left" size={28} color="#333" />
          </Pressable>
        </View>
        <Text style={styles.title}>Digital Diary</Text>
        <View style={styles.rightContainer}>
          <FontAwesome6 name="magnifying-glass" size={28} color="#333" />
        </View>
      </View>

      <View style={styles.pageContainer}>
        <View style={styles.topContainer}>
          <View style={styles.titleContainer}>
            <FontAwesome6 name="book-bookmark" size={28} color="#778BEB" />
            <Text style={styles.pageTitle}>Lists of your diary</Text>
          </View>

          {/* this section reminder list */}
          {/* <View style={styles.reminderContainer}>
            <Text style={styles.reminder}>No reminder set.</Text>
          </View> */}
        </View>

        <View style={styles.bottomContainer}>
          <View style={styles.addDiaryContainer}>
            <FontAwesome6 name="circle-plus" size={24} color="#596275" />
            <Text>Write a new diary</Text>
          </View>
          <Image source={noDiary} style={{ width: 250, height: 250 }} />
          <Text style={styles.noContent}>You don't have any diary yet.</Text>
        </View>
      </View>

    </ScrollView>
  )
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pageTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  bottomContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 30,
    marginTop: 48,
  },
  addDiaryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  noContent: {
    textAlign: 'center',
    maxWidth: 150,
  },
});