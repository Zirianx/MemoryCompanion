import { Text, View, StyleSheet, ScrollView } from "react-native";
import { Link } from "expo-router";
import { Avatar } from "react-native-elements";
import { FontAwesome } from '@expo/vector-icons';
// import FontAwesome from '@expo/vector-icons/FontAwesome';

import BoxButton from "./components/BoxButton";

import ReminderIcon from '../assets/icons/reminder.svg'
import DigitalDiaryIcon from '../assets/icons/digitaldiary.svg'
import MeditationGuideIcon from '../assets/icons/meditationguide.svg'
import RelaxationMusicIcon from '../assets/icons/relaxationmusic.svg'
const UserImage = require('@/assets/images/user.png')

export default function Index() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

      <View style={styles.topNav}>
        <Text style={styles.title}>Home</Text>
        <View style={styles.avatarContainer}>
          <Link href="/profile">
            <Avatar rounded source={UserImage} size="medium" />
          </Link>
        </View>
      </View>

      <View style={styles.pageContainer}>
        <View style={styles.topContainer}>
          <View style={styles.titleContainer}>
            <FontAwesome name="bell" size={28} color="#ECCC68" />
            <Text style={styles.pageTitle}>Reminder</Text>
          </View>

          {/* this section reminder list */}
          <View style={styles.reminderContainer}>
            <Text style={styles.reminder}>No reminder set.</Text>
          </View>
        </View>

        <View style={styles.bottomContainer}>
          <View style={styles.boxButtonContainer}>
            <BoxButton 
              icon={ReminderIcon}
              backgroundColor="#ECCC68"
              textColor="#fff"
              href="/reminder"
            />
            <Text style={styles.buttonTitle}>Reminder</Text>
          </View>

          <View style={styles.boxButtonContainer}>
            <BoxButton 
              icon={DigitalDiaryIcon}
              backgroundColor="#778BEB"
              textColor="#fff"
              href="/digitaldiary"
            />
            <Text style={styles.buttonTitle}>Digital Diary</Text>
          </View>

          <View style={styles.boxButtonContainer}>
            <BoxButton 
              icon={MeditationGuideIcon}
              backgroundColor="#FF6348"
              textColor="#fff"
              href="/meditationguide"
            />
            <Text style={styles.buttonTitle}>Meditation Guide</Text>
          </View>

          <View style={styles.boxButtonContainer}>
            <BoxButton 
              icon={RelaxationMusicIcon}
              backgroundColor="#C44569"
              textColor="#fff"
              href="/relaxationmusic"
            />
            <Text style={styles.buttonTitle}>Relaxation Music</Text>
          </View>
        </View>
      </View>

    </ScrollView>
  );
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
  avatarContainer: {
    position: 'absolute',
    right: 14,
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
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 30,
    marginTop: 48,
  },
  boxButtonContainer: {
    gap: 10,
    alignItems: 'center',
  },
  buttonTitle: {
    fontWeight: '600',
    fontSize: 16,
    maxWidth: 100,
    textAlign: 'center',
  }
});