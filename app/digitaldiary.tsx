import { View, Text, StyleSheet, ScrollView, Image, Pressable, TextInput } from 'react-native'
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import { router, useFocusEffect } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types';

const noDiary = require('../assets/images/diary-none.png')

const colors: readonly string[] = ['#C44569', '#ECCC68', '#FF6348'] as const;

interface Diary {
  id: string;
  title: string;
  diary: string;
}

export default function DigitalDiaryScreen() {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [diarys, setDiarys] = useState<Diary[]>([])
  const [newDiary, setNewDiary] = useState('')
  const [newDiaryContent, setNewDiaryContent] = useState('')

  const loadDiarys = async () => {
    try {
      const savedDiarys = await AsyncStorage.getItem('diarys');
      if(savedDiarys) {
        const parsedDiarys = JSON.parse(savedDiarys);
        setDiarys(parsedDiarys);
      } else {
        setDiarys([]); //set empty array if no diarys found
      }
    } catch (err) {
      console.error('Error loading diarys:', err);
      setDiarys([]); //set empty array on error
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      //load diarys when screen comes into focus
      loadDiarys();
    }, [])
  );

  useEffect(() => {
    const checkStorage = async () => {
      try {
        const diarys = await AsyncStorage.getItem('diarys');

        if(!diarys) {
          console.log('No diarys found in storage');
          return;
        }

        const parsedDiarys = JSON.parse(diarys);
        console.log('Stored diarys:', parsedDiarys);

      } catch (err) {
        console.error('Error reading storage:', err);
      }
    };
    
    checkStorage();
  }, [])

  const saveDiarys = async (updatedDiary: Diary[]) => {
    try {
      await AsyncStorage.setItem('diarys', JSON.stringify(updatedDiary));
    } catch (err) {
      console.error('Error saving diarys:', err);
    }
  }

  const handleAddDiary = async () => {
    if(newDiary.trim()) {
      const newDiaryItem: Diary = {
        id: Date.now().toString(),
        title: newDiary,
        diary: newDiaryContent
      };

      const updatedDiary = [...diarys, newDiaryItem];
      setDiarys(updatedDiary);
      saveDiarys(updatedDiary);

      //reset form input
      setNewDiary('');
      setNewDiaryContent('');
      setIsAddingNew(false);
    }
  }

  const getBackgroundColor = (index: number): string => {
    return colors[index % colors.length];
  };

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
          {/* <FontAwesome6 name="magnifying-glass" size={28} color="#333" /> */}
        </View>
      </View>

      <View style={styles.pageContainer}>
        <View style={styles.topContainer}>
          <View style={styles.titleContainer}>
            <FontAwesome6 name="book-bookmark" size={28} color="#778BEB" />
            <Text style={styles.pageTitle}>Lists of your diary</Text>
          </View>

          {diarys.length > 0 && (
            <View style={styles.diaryContainer}>
            {diarys.map((diary: Diary, index: number) => (
              <View key={diary.id} style={styles.diaryItem}>
                <Pressable 
                  style={[
                    styles.buttonDiary, 
                    { backgroundColor: getBackgroundColor(index) }
                  ]} 
                  onPress={() => router.push({
                    pathname: "/diary/[id]",
                    params: { id: diary.id }
                  })}
                >
                  <Text style={styles.buttonTextDiary}>{diary.title}</Text>
                </Pressable>
              </View>
            ))}
            </View>
          )}
        </View>

        <View style={styles.bottomContainer}>
          <View style={styles.addDiaryContainer}>
            <Pressable style={styles.addButtonFeature} onPress={() => setIsAddingNew(!isAddingNew)}>
              <FontAwesome6 name="circle-plus" size={24} color="#596275" />
              <Text>Write a new diary</Text>
            </Pressable>
          </View>

          {isAddingNew == true && (
            <View style={styles.formContainer}>
              <TextInput 
                style={styles.input}
                placeholder="Title"
                value={newDiary}
                onChangeText={setNewDiary}
              />

              <TextInput 
                style={styles.inputTextArea}
                placeholder="Your diary..."
                value={newDiaryContent}
                onChangeText={setNewDiaryContent}
                multiline={true}
                numberOfLines={99}
              />

              <Pressable style={styles.buttonMain} onPress={handleAddDiary}>
                <Text style={styles.buttonTextMain}>Add</Text>
              </Pressable>
            </View>
          )}

          {!(diarys.length > 0) && (
            <View style={styles.noContainer}>
              <Image source={noDiary} style={{ width: 250, height: 250 }} />
              <Text style={styles.noContent}>You don't have any diary yet.</Text>    
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
    marginTop: 8,
  },
  pageTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  diaryContainer: {
    // backgroundColor: '#fff',
    marginTop: 30,
    gap: 16,
    // paddingHorizontal: 18,
    // paddingVertical: 18,
    // borderRadius: 16,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    // elevation: 5,
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
  buttonMain: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 28,
    backgroundColor: '#2ED573',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDiary: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 36,
    borderRadius: 28,
    backgroundColor: '#2ED573',
    textAlign: 'left',
    justifyContent: 'center',
  },
  buttonTextDiary: {
    color: '#fff',
    textAlign: 'left',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonTextMain: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  formContainer: {
    width: '100%',
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
  inputTextArea: {
    paddingHorizontal: 24,
    backgroundColor: '#fff',
    borderRadius: 24,
    fontSize: 16,
    height: 200,
    textAlignVertical: 'top',
  },
  diaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonFeature: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
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
});