import { Text, View, StyleSheet, ScrollView, Pressable } from "react-native";
import { Link, router } from "expo-router";
import { FontAwesome5, FontAwesome6 } from '@expo/vector-icons';

import BoxButton from "./components/BoxButton";

import MeditateOne from '../assets/icons/meditateone.svg'
import MeditateTwo from '../assets/icons/meditatetwo.svg'
import MeditateThree from '../assets/icons/meditatethree.svg'
import MeditateFour from '../assets/icons/meditatefour.svg'
import MeditateFive from '../assets/icons/meditatefive.svg'
import MeditateSix from '../assets/icons/meditatesix.svg'

export default function MeditationGuideScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

      <View style={styles.topNav}>
      <View style={styles.leftContainer}>
          <Pressable onPress={() => router.back()}>
            <FontAwesome6 name="arrow-left" size={28} color="#333" />
          </Pressable>
        </View>
        <Text style={styles.title}>Meditation Guide</Text>
      </View>

      <View style={styles.pageContainer}>
        <View style={styles.topContainer}>
          <View style={styles.titleContainer}>
            <FontAwesome5 name="leaf" size={28} color="#35B6B6" />
            <Text style={styles.pageTitle}>What do you want to do?</Text>
          </View>
        </View>

        <View style={styles.bottomContainer}>
          <View style={styles.boxButtonContainer}>
            <BoxButton 
              icon={MeditateOne}
              backgroundColor="#ECCC68"
              textColor="#fff"
              href="/meditateone"
            />
            <Text style={styles.buttonTitle}>Learn Meditation</Text>
          </View>

          <View style={styles.boxButtonContainer}>
            <BoxButton 
              icon={MeditateTwo}
              backgroundColor="#778BEB"
              textColor="#fff"
              href="/meditatetwo"
            />
            <Text style={styles.buttonTitle}>Relax Yourself</Text>
          </View>

          <View style={styles.boxButtonContainer}>
            <BoxButton 
              icon={MeditateFour}
              backgroundColor="#35B6B6"
              textColor="#fff"
              href="/meditatefour"
            />
            <Text style={styles.buttonTitle}>Breathwork</Text>
          </View>

          <View style={styles.boxButtonContainer}>
            <BoxButton 
              icon={MeditateThree}
              backgroundColor="#C6603B"
              textColor="#fff"
              href="/meditatethree"
            />
            <Text style={styles.buttonTitle}>Relieve Stress</Text>
          </View>

          <View style={styles.boxButtonContainer}>
            <BoxButton 
              icon={MeditateFive}
              backgroundColor="#FF6348"
              textColor="#fff"
              href="/meditatefive"
            />
            <Text style={styles.buttonTitle}>Focused Attention</Text>
          </View>

          <View style={styles.boxButtonContainer}>
            <BoxButton 
              icon={MeditateSix}
              backgroundColor="#C44569"
              textColor="#fff"
              href="/meditatesix"
            />
            <Text style={styles.buttonTitle}>Care For Yourself</Text>
          </View>
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