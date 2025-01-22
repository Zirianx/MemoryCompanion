import { Text, View, StyleSheet, ScrollView, Pressable, Image, Dimensions } from "react-native";
import { Link, router } from "expo-router";
import { FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import * as ScreenOrientation from 'expo-screen-orientation';
import YoutubePlayer from "react-native-youtube-iframe";
import { useState, useCallback } from 'react';

import MeditateThree from '../assets/icons/relievestress.svg'
const relievestress = require('../assets/images/relievestress.png')

export default function MeditatethreeScreen() {
  const screenWidth = Dimensions.get('window').width;
    const videoWidth = screenWidth - 56;
    const videoHeight = videoWidth * (9/16);
    const videoId = 'F0WYFXxhPGY';
  
    const [isPlaying, setIsPlaying] = useState(false);
  
    const onFullScreenChange = useCallback(async (isFullScreen: boolean) => {
      if (isFullScreen) {
        // Lock to landscape orientation when entering fullscreen
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      } else {
        // Return to portrait orientation when exiting fullscreen
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
      }
    }, []);
  
    const onStateChange = useCallback((state: string) => {
      if (state === 'playing') {
        setIsPlaying(true);
      } else if (state === 'paused') {
        setIsPlaying(false);
      }
    }, []);

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
            <MeditateThree width={28} height={28} fill='#FF6348' />
            <Text style={styles.pageTitle}>Relieve Stress</Text>
          </View>
        </View>

        <View style={styles.bottomContainer}>
          <Image source={relievestress} style={{ width: 160, height: 160 }} />
          <Text style={styles.introText}>Follow along with this guided meditation video</Text>
          <View style={styles.videoContainer}>
            <YoutubePlayer
              height={220}
              width={320}
              videoId={videoId}
              webViewProps={{
                androidLayerType: 'hardware' // Improves performance on Android
              }}
              initialPlayerParams={{
                preventFullScreen: false, // Allow fullscreen
                showClosedCaptions: false,
                controls: true,
                modestbranding: true
              }}
              onFullScreenChange={onFullScreenChange}
              onChangeState={onStateChange}
              play={isPlaying}
            />
          </View>
          {/* <View style={styles.step}>
            <View style={{ gap: '4' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 16 }}>STEP 1: Find Your Space</Text>
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
                <Text style={{ fontSize: 16 }}>{`\u25CF`}</Text>
                <Text style={{ fontSize: 16 }}>Choose a quiet, comfortable location.</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
                <Text style={{ fontSize: 16 }}>{`\u25CF`}</Text>
                <Text style={{ fontSize: 16 }}>Set a timer for 10-15 minutes.</Text>
              </View>
            </View>

            <View>
              <Text style={{ fontWeight: 'bold', fontSize: 16 }}>STEP 2: Release Physical Tension</Text>
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
                <Text style={{ fontSize: 16 }}>{`\u25CF`}</Text>
                <Text style={{ fontSize: 16 }}>Take a deep cleansing breath.</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
                <Text style={{ fontSize: 16 }}>{`\u25CF`}</Text>
                <Text style={{ fontSize: 16 }}>Feel the contrast between tension and release.</Text>
              </View>
            </View>

            <View>
              <Text style={{ fontWeight: 'bold', fontSize: 16 }}>STEP 3: Calming Breath</Text>
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
                <Text style={{ fontSize: 16 }}>{`\u25CF`}</Text>
                <Text style={{ fontSize: 16 }}>Breathe in for 4 counts.</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
                <Text style={{ fontSize: 16 }}>{`\u25CF`}</Text>
                <Text style={{ fontSize: 16 }}>Hold briefly, and exhale for 6 counts</Text>
              </View>
            </View>

            <View>
              <Text style={{ fontWeight: 'bold', fontSize: 16 }}>STEP 4: Mental Reset</Text>
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
                <Text style={{ fontSize: 16 }}>{`\u25CF`}</Text>
                <Text style={{ fontSize: 16 }}>Notice any stressful thoughts.</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
                <Text style={{ fontSize: 16 }}>{`\u25CF`}</Text>
                <Text style={{ fontSize: 16 }}>Imagine them as leaves on a stream.</Text>
              </View>
            </View>

            <View>
              <Text style={{ fontWeight: 'bold', fontSize: 16 }}>STEP 5: Positive Focus</Text>
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
                <Text style={{ fontSize: 16 }}>{`\u25CF`}</Text>
                <Text style={{ fontSize: 16 }}>Acknowledge that stress is temporary.</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
                <Text style={{ fontSize: 16 }}>{`\u25CF`}</Text>
                <Text style={{ fontSize: 16 }}>Notice any shift in your mood.</Text>
              </View>
            </View>
          </View> */}
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
  // bottomContainer: {
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   flexDirection: 'column',
  //   gap: 30,
  //   marginTop: 48,
  // },
  step: {
    gap: 16,
    marginHorizontal: 12,
  },
  videoContainer: {
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 10,
  },
  // Modify bottomContainer to accommodate video
  bottomContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: 20,
    marginTop: 30,
    paddingHorizontal: 0, // Remove horizontal padding to allow video to use full width
  },
  introText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
    marginTop: 12,
    fontWeight: 'bold',
    paddingHorizontal: 20,
  },
});