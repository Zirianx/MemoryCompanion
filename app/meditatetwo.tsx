import { Text, View, StyleSheet, ScrollView, Pressable, Image, Dimensions } from "react-native";
import { Link, router } from "expo-router";
import { FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import * as ScreenOrientation from 'expo-screen-orientation';
import YoutubePlayer from "react-native-youtube-iframe";
import { useState, useCallback } from 'react';

import MeditateTwo from '../assets/icons/relaxyourself.svg'
const relaxyourself = require('../assets/images/relaxyourself.png')

export default function MeditatetwoScreen() {
    const screenWidth = Dimensions.get('window').width;
    const videoWidth = screenWidth - 56;
    const videoHeight = videoWidth * (9/16);
    const videoId = 'wyj8l9miy4w';
  
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
            <MeditateTwo width={28} height={28} fill='#778BEB' />
            <Text style={styles.pageTitle}>Relax Yourself</Text>
          </View>
        </View>

        <View style={styles.bottomContainer}>
          <Image source={relaxyourself} style={{ width: 160, height: 160 }} />
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
              <Text style={{ fontWeight: 'bold', fontSize: 16 }}>STEP 1: Initial Setup</Text>
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
                <Text style={{ fontSize: 16 }}>{`\u25CF`}</Text>
                <Text style={{ fontSize: 16 }}>Find a peaceful, quiet space.</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
                <Text style={{ fontSize: 16 }}>{`\u25CF`}</Text>
                <Text style={{ fontSize: 16 }}>Choose a comfortable position (lying down or sitting).</Text>
              </View>
            </View>

            <View>
              <Text style={{ fontWeight: 'bold', fontSize: 16 }}>STEP 2: Body Position</Text>
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
                <Text style={{ fontSize: 16 }}>{`\u25CF`}</Text>
                <Text style={{ fontSize: 16 }}>Close your eyes gently.</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
                <Text style={{ fontSize: 16 }}>{`\u25CF`}</Text>
                <Text style={{ fontSize: 16 }}>Let your whole body sink into the surface below.</Text>
              </View>
            </View>

            <View>
              <Text style={{ fontWeight: 'bold', fontSize: 16 }}>STEP 3: Progressive Relaxation</Text>
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
                <Text style={{ fontSize: 16 }}>{`\u25CF`}</Text>
                <Text style={{ fontSize: 16 }}>Start with your toes, consciously relax them.</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
                <Text style={{ fontSize: 16 }}>{`\u25CF`}</Text>
                <Text style={{ fontSize: 16 }}>Move to your feet and ankles.</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
                <Text style={{ fontSize: 16 }}>{`\u25CF`}</Text>
                <Text style={{ fontSize: 16 }}>Progress up through your legs.</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
                <Text style={{ fontSize: 16 }}>{`\u25CF`}</Text>
                <Text style={{ fontSize: 16 }}>Release tension in your hips and lower back.</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
                <Text style={{ fontSize: 16 }}>{`\u25CF`}</Text>
                <Text style={{ fontSize: 16 }}>Relax your stomach and chest.</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
                <Text style={{ fontSize: 16 }}>{`\u25CF`}</Text>
                <Text style={{ fontSize: 16 }}>Let your shoulders drop.</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
                <Text style={{ fontSize: 16 }}>{`\u25CF`}</Text>
                <Text style={{ fontSize: 16 }}>Release tension in your neck.</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
                <Text style={{ fontSize: 16 }}>{`\u25CF`}</Text>
                <Text style={{ fontSize: 16 }}>Relax your facial muscles, jaw, and forehead.</Text>
              </View>
            </View>

            <View>
              <Text style={{ fontWeight: 'bold', fontSize: 16 }}>STEP 4: Deep Breathing</Text>
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
                <Text style={{ fontSize: 16 }}>{`\u25CF`}</Text>
                <Text style={{ fontSize: 16 }}>Take slow, deep breaths through your nose.</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
                <Text style={{ fontSize: 16 }}>{`\u25CF`}</Text>
                <Text style={{ fontSize: 16 }}>Exhale slowly through your mouth.</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
                <Text style={{ fontSize: 16 }}>{`\u25CF`}</Text>
                <Text style={{ fontSize: 16 }}>Keep your breathing natural and steady.</Text>
              </View>
            </View>

            <View>
              <Text style={{ fontWeight: 'bold', fontSize: 16 }}>STEP 5: Mind Calming</Text>
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
                <Text style={{ fontSize: 16 }}>{`\u25CF`}</Text>
                <Text style={{ fontSize: 16 }}>Let go of any worrying thoughts.</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
                <Text style={{ fontSize: 16 }}>{`\u25CF`}</Text>
                <Text style={{ fontSize: 16 }}>If thoughts come, let them float away like clouds.</Text>
              </View>
            </View>

            <View>
              <Text style={{ fontWeight: 'bold', fontSize: 16 }}>STEP 6: Gentle Return</Text>
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
                <Text style={{ fontSize: 16 }}>{`\u25CF`}</Text>
                <Text style={{ fontSize: 16 }}>Slowly bring awareness back to your body.</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
                <Text style={{ fontSize: 16 }}>{`\u25CF`}</Text>
                <Text style={{ fontSize: 16 }}>Take a moment before standing up.</Text>
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