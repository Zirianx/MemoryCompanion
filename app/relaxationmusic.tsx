import { View, Text, StyleSheet, ScrollView, Image, Pressable } from 'react-native'
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import { router } from 'expo-router'
import { useState, useEffect } from 'react';
import { Audio } from  'expo-av';
import * as DocumentPicker from 'expo-document-picker'
import AsyncStorage from '@react-native-async-storage/async-storage';

const noDiary = require('../assets/images/music-none.png')

interface Music {
  uri: string;
  name: string;
  isPlaying: boolean;
  sound?: Audio.Sound;
}

export default function RelaxationMusicScreen() {
  const [musicList, setMusicList] = useState<Music[]>([]);

  //load saved music list when component mounts
  useEffect(() => {
    loadSavedMusic();
  }, []);

  //cleanup sounds when component unmounts
  useEffect(() => {
    return () => {
      musicList.forEach(async (music) => {
        if(music.sound) {
          await music.sound.unloadAsync();
        }
      });
    }
  }, []);

  const loadSavedMusic = async () => {
    try {
      const savedMusic = await AsyncStorage.getItem('musics');
      if(savedMusic) {
        //parse the music and remove the sound object and isPlaying state
        const parsedMusic = JSON.parse(savedMusic).map((music: Music) => ({
          ...music,
          sound: undefined,
          isPlaying: false
        }));
        setMusicList(parsedMusic);
      }
    } catch (err) {
      console.error('Error loading saved music:', err);
    }
  }

  const saveMusicList = async (newMusicList: Music[]) => {
    try {
      //remove sound object before saving as it can't be serialized
      const musicToSave = newMusicList.map(({ uri, name }) => ({ uri, name }));
      await AsyncStorage.setItem('musics', JSON.stringify(musicToSave));
    } catch (err) {
      console.error('Error saving music list:', err);
    }
  }

  const pickMusic = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true,
      });

      if(result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const newMusicList = [...musicList, {
          uri: asset.uri,
          name: asset.name,
          isPlaying: false
        }];
        setMusicList(newMusicList);
        await saveMusicList(newMusicList);
      }
    } catch (err) {
      console.error('Error picking music:', err);
    }
  }

  const removeMusic = async (index: number) => {
    try {
      const musicToRemove = musicList[index];
      if(musicToRemove.sound) {
        await musicToRemove.sound.unloadAsync();
      }

      const newMusicList = musicList.filter((_, i) => i !== index);
      setMusicList(newMusicList);
      await saveMusicList(newMusicList);
    } catch (err) {
      console.error('Error removing music:', err);
    }
  }

  const togglePlayMusic = async (index: number) => {
    try {
      const musicToPlay = musicList[index];

      //stop other playing music
      for(let i = 0; i < musicList.length; i++) {
        if(i !== index && musicList[i].sound && musicList[i].isPlaying) {
          await musicList[i].sound?.stopAsync();
          musicList[i].isPlaying = false;
        }
      }

      if(!musicToPlay.sound) {
        const { sound } = await Audio.Sound.createAsync({ uri: musicToPlay.uri });
        musicToPlay.sound = sound;
      }

      if(musicToPlay.isPlaying) {
        await musicToPlay.sound.pauseAsync();
      } else {
        await musicToPlay.sound.playAsync();
      }

      setMusicList(prev => prev.map((item, i) => 
        i === index ? { ...item, isPlaying: !item.isPlaying } : item
      ));
    } catch (err) {
      console.error('Error playing music:', err);
    }
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

      <View style={styles.topNav}>
        <View style={styles.leftContainer}>
          <Pressable onPress={() => router.back()}>
            <FontAwesome6 name="arrow-left" size={28} color="#333" />
          </Pressable>
        </View>
        <Text style={styles.title}>Memory Bank Music</Text>
        <View style={styles.rightContainer}>
          {/* <FontAwesome6 name="magnifying-glass" size={28} color="#333" /> */}
        </View>
      </View>

      <View style={styles.pageContainer}>
        <View style={styles.topContainer}>
          <View style={styles.titleContainer}>
            <FontAwesome6 name="music" size={28} color="#C44569" />
            <Text style={styles.pageTitle}>Lists of your music</Text>
          </View>

          {musicList.length > 0 && (
            <View style={styles.musicListContainer}>
              {musicList.map((music, index) => (
                <Pressable
                  key={index}
                  style={styles.musicItem}
                >
                  <Pressable onPress={() => togglePlayMusic(index)}>
                    <FontAwesome 
                      name={music.isPlaying ? "pause-circle" : "play-circle"}
                      size={24}
                      color="#C44569"
                    />
                  </Pressable>
                  <Text style={styles.musicName} numberOfLines={1}>{music.name}</Text>
                  <Pressable onPress={() => removeMusic(index)}>
                    <FontAwesome name="trash-o" size={24} color="#596275" />
                  </Pressable>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        <View style={styles.bottomContainer}>
          <View style={styles.addSongContainer}>
            <Pressable style={styles.addSongContainer} onPress={pickMusic}>
              <FontAwesome6 name="circle-plus" size={24} color="#596275" />
              <Text>Add song</Text>
            </Pressable>
          </View>

          {!(musicList.length > 0) && (
            <View style={styles.noContainer}>
              <Image source={noDiary} style={{ width: 250, height: 250 }} />
              <Text style={styles.noContent}>You don't have any song yet.</Text>
            </View>
          )}

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
  addSongContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  noContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  noContent: {
    textAlign: 'center',
    maxWidth: 150,
  },
  musicListContainer: {
    width: '100%',
    marginTop: 20,
    gap: 12,
  },
  musicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  musicName: {
    fontSize: 16,
    flex: 1,
  },
});