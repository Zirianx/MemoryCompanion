import { Text, View, StyleSheet, ScrollView, Pressable, Image, Dimensions } from "react-native";
import { Link, router } from "expo-router";
import { FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import * as ScreenOrientation from 'expo-screen-orientation';
import YoutubePlayer from "react-native-youtube-iframe";
import { useState, useCallback } from 'react';

import MeditateFour from '../assets/icons/breathwork.svg'
const breathwork = require('../assets/images/breathwork.png')

export default function MeditatefourScreen() {
  const screenWidth = Dimensions.get('window').width;
    const videoWidth = screenWidth - 56;
    const videoHeight = videoWidth * (9/16);
    const videoId = 'eZBa63NZbbE';
  
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
            <MeditateFour width={28} height={28} fill='#35B6B6' />
            <Text style={styles.pageTitle}>Breathwork</Text>
          </View>
        </View>

        <View style={styles.bottomContainer}>
          <Image source={breathwork} style={{ width: 160, height: 160 }} />
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
              <Text style={{ fontWeight: 'bold', fontSize: 16 }}>STEP 1: Get Comfortable</Text>
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
                <Text style={{ fontSize: 16 }}>{`\u25CF`}</Text>
                <Text style={{ fontSize: 16 }}>Sit in a comfortable position with your back straight.</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
                <Text style={{ fontSize: 16 }}>{`\u25CF`}</Text>
                <Text style={{ fontSize: 16 }}>Close your eyes for about 30 seconds.</Text>
              </View>
            </View>

            <View>
              <Text style={{ fontWeight: 'bold', fontSize: 16 }}>STEP 2: Deep Inhale</Text>
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
                <Text style={{ fontSize: 16 }}>{`\u25CF`}</Text>
                <Text style={{ fontSize: 16 }}>Breathe in slowly through your nose, filling your belly first, then your chest.</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
                <Text style={{ fontSize: 16 }}>{`\u25CF`}</Text>
                <Text style={{ fontSize: 16 }}>Do this for about 4 counts.</Text>
              </View>
            </View>

            <View>
              <Text style={{ fontWeight: 'bold', fontSize: 16 }}>STEP 3: Hold</Text>
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
                <Text style={{ fontSize: 16 }}>{`\u25CF`}</Text>
                <Text style={{ fontSize: 16 }}>Gently hold your breath, keeping your body relaxed.</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
                <Text style={{ fontSize: 16 }}>{`\u25CF`}</Text>
                <Text style={{ fontSize: 16 }}>Do this for about 4 counts.</Text>
              </View>
            </View>

            <View>
              <Text style={{ fontWeight: 'bold', fontSize: 16 }}>STEP 4: Slow Exhale</Text>
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
                <Text style={{ fontSize: 16 }}>{`\u25CF`}</Text>
                <Text style={{ fontSize: 16 }}>Release the breath slowly through your mouth, emptying your lungs completely.</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
                <Text style={{ fontSize: 16 }}>{`\u25CF`}</Text>
                <Text style={{ fontSize: 16 }}>Do this for about 6 counts.</Text>
              </View>
            </View>

            <View>
              <Text style={{ fontWeight: 'bold', fontSize: 16 }}>STEP 5: Rest</Text>
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
                <Text style={{ fontSize: 16 }}>{`\u25CF`}</Text>
                <Text style={{ fontSize: 16 }}>Pause briefly before starting the next breath cycle.</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
                <Text style={{ fontSize: 16 }}>{`\u25CF`}</Text>
                <Text style={{ fontSize: 16 }}>Do this for about 2 counts.</Text>
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