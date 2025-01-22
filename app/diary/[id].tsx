import { View, Text, StyleSheet, ScrollView, Image, Pressable, TextInput, Modal, TouchableOpacity } from 'react-native'
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Diary {
  id: string;
  title: string;
  diary: string;
}

export default function DiaryScreen() {
  const { id } = useLocalSearchParams();
  const [diary, setDiary] = useState<Diary | null>(null);
  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedTitle, setEditedTitle] = useState<string>(diary?.title || '');
  const [editedContent, setEditedContent] = useState<string>(diary?.diary || '');

  useEffect(() => {
    const loadDiary = async () => {
      try {
        const savedDiarys = await AsyncStorage.getItem('diarys');
        if (savedDiarys) {
          const diarys = JSON.parse(savedDiarys);
          const foundDiary = diarys.find((diary: Diary) => diary.id === id);
          if (foundDiary) {
            setDiary(foundDiary);
          }
        }
      } catch (err) {
        console.error('Error loading diary:', err);
      }
    };

    loadDiary();
  }, [id]);

  if (!diary) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const handleMenuPress = (): void => {
    setMenuVisible(!menuVisible);
  }

  const handleOption = async (action: 'delete' | 'edit'): Promise<void> => {
    setMenuVisible(false);

    if(action === 'edit') {
      setIsEditing(true);
      setEditedTitle(diary?.title || '');
      setEditedContent(diary?.diary || '');
    } else if (action === 'delete') {
      if(diary && diary.id) {
        await handleDeleteDiary(diary.id);
      }
    }
  }

  const handleSaveEdit = async (): Promise<void> => {
    try {
      const savedDiarys = await AsyncStorage.getItem('diarys');
      if(savedDiarys && diary) {
        const diarys: Diary [] = JSON.parse(savedDiarys);

        //find and update the diary
        const updatedDiarys = diarys.map(d => {
          if(d.id === diary.id) {
            return {
              ...d,
              title: editedTitle,
              diary: editedContent
            };
          }
          return d;
        });

        //save to AsyncStorage
        await AsyncStorage.setItem('diarys', JSON.stringify(updatedDiarys));

        //update local state
        setDiary({
          ...diary,
          title: editedTitle,
          diary: editedContent
        });

        //exit edit mode
        setIsEditing(false);
      }

    } catch (err) {
      console.error('Error saving edited diary:', err);
    }
  }

  const handleCancel = () => {
    if(diary) {
      setEditedTitle(diary.title);
      setEditedContent(diary.diary);
      setIsEditing(false);
    }
  }

  const handleDeleteDiary = async (diaryId: string): Promise<void> => {
    try {
      //get current diarys from AsyncStorage
      const savedDiarys = await AsyncStorage.getItem('diarys');
      if(savedDiarys) {
        //parse the saved diarys
        const diarys: Diary[] = JSON.parse(savedDiarys);

        //filter out the diary with the given id
        const updatedDiarys = diarys.filter(diary => diary.id !== diaryId);

        //save the filtered diarys back to AsyncStorage
        await AsyncStorage.setItem('diarys', JSON.stringify(updatedDiarys));

        //navigate back after successful deletion
        router.back();
      }
    } catch (err) {
      console.error('Error deleting diary:', err);
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
        <Text style={styles.title}>Digital Diary</Text>
        <View style={styles.rightContainer}>
          <TouchableOpacity onPress={handleMenuPress}>
            <FontAwesome name="gear" size={28} color="#333" />
          </TouchableOpacity>

          <Modal
            transparent={true}
            visible={menuVisible}
            animationType="fade"
            onRequestClose={() => setMenuVisible(false)}
          >
            <TouchableOpacity
              style={styles.modalOverlay}
              onPress={() => setMenuVisible(false)}
            >
              <View style={[styles.menuContainer, { top: 50, right: 20 }]}>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleOption('edit')}
                >
                  <FontAwesome name="edit" size={20} color="#333" />
                  <Text style={styles.menuText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleOption('delete')}
                >
                  <FontAwesome name="trash" size={20} color="#333" />
                  <Text style={styles.menuText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>

        </View>
      </View>

      <View style={styles.pageContainer}>
        <View style={styles.topContainer}>
          <View style={styles.titleContainer}>
            {isEditing ? (
              <TextInput 
                style={styles.editInput}
                value={editedTitle}
                onChangeText={setEditedTitle}
                placeholder={editedTitle}
              />
            ) : (
              <Text style={styles.pageTitle}>{diary.title}</Text>
            )}
          </View>
        </View>

        <View style={styles.bottomContainer}>
          {isEditing ? (
            <>
              <TextInput
                style={styles.editInput}
                value={editedContent}
                onChangeText={setEditedContent}
                placeholder={editedContent}
                multiline
              />
            </>
          ) : (
            <Text style={styles.diaryContent}>{diary.diary}</Text>
          )}
        </View>

        {isEditing && (
          <View style={styles.editButtonsContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveEdit}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        )}
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
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  pageTitle: {
    fontWeight: 'bold',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: 16,
  },
  diaryContainer: {
    marginTop: 30,
    gap: 16,
  },
  bottomContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 30,
    marginTop: 48,
    textAlign: 'left',
  },
  diaryContent: {
    textAlign: 'left',
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
  editInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 24,
    borderRadius: 8,
    padding: 8,
    backgroundColor: '#fff',
  },
  editButtonsContainer: {
    marginTop: 32,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  saveButton: {
    backgroundColor: '#2ED573',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: '#FF4757',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuContainer: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: 120,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  menuText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
});