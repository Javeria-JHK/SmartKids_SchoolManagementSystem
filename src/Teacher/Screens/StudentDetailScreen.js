//Javeria
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Text, TextInput, Button } from 'react-native-paper';
import { doc, getDoc, updateDoc, deleteField, collection, getDocs } from 'firebase/firestore';
import { firestore } from '../../../firebaseConfig';
import { HeaderBackButton } from '@react-navigation/stack';

const StudentDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { student } = route.params;

  const [marks, setMarks] = useState({});
  const [subjects, setSubjects] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [subject, setSubject] = useState('');
  const [obtainedMarks, setObtainedMarks] = useState('');
  const [totalMarks, setTotalMarks] = useState('');
  const [currentTerm, setCurrentTerm] = useState('');



  useEffect(() => {
    const fetchMarks = async () => {
      try {
        const docRef = doc(firestore, 'marks', 'marks1');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setMarks(docSnap.data());
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching marks:', error);
      }
    };

    const fetchSubjects = async () => {
      try {
        const subjectsSnapshot = await getDocs(collection(firestore, 'subjects'));
        const subjectsData = {};
        subjectsSnapshot.forEach((doc) => {
          subjectsData[doc.id] = doc.data();
        });
        setSubjects(subjectsData);
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    };

    fetchMarks();
    fetchSubjects();
  }, [student]);

  const handleEdit = (subject, obtainedMarks, totalMarks, term) => {
    setSubject(subject);
    setObtainedMarks(obtainedMarks.toString());
    setTotalMarks(totalMarks.toString());
    setCurrentTerm(term);
    setModalVisible(true);
  };

  const handleSave = async () => {
    try {
      const docRef = doc(firestore, 'marks', 'marks1');
      await updateDoc(docRef, {
        [`${subject}.${currentTerm}`]: obtainedMarks.split(',').map((mark) => mark.trim())
      });
      setMarks(prev => ({
        ...prev,
        [subject]: {
          ...prev[subject],
          [currentTerm]: obtainedMarks
        }
      }));
      setModalVisible(false);
    } catch (error) {
      console.error('Error updating marks:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const updatedMarks = { ...marks };
      delete updatedMarks[subject][currentTerm];

      const docRef = doc(firestore, 'marks', 'marks1');
      await updateDoc(docRef, {
        [`${subject}.${currentTerm}`]: deleteField()
      });

      setMarks(updatedMarks);
      setModalVisible(false);
    } catch (error) {
      console.error('Error deleting marks:', error);
    }
  };

  const handleAdd = () => {
    navigation.navigate('AddMarksScreen', {
      onSave: (addedMarks) => {
        const newMarks = { ...marks };
        addedMarks.forEach((mark) => {
          if (!newMarks[mark.subject]) {
            newMarks[mark.subject] = {};
          }
          newMarks[mark.subject][mark.term] = mark.obtainedMarks;
        });
        setMarks(newMarks);
      }
    });
  };

  const renderTermTable = (term) => (
    <View key={term}>
      <Text style={styles.sectionHeader}>{term}</Text>
      <View style={styles.table}>
        <View style={styles.headerRow}>
          <Text style={styles.headerCell}>Subject</Text>
          <Text style={styles.headerCell}>Obtained Marks</Text>
          <Text style={styles.headerCell}>Total Marks</Text>
          <Text style={styles.headerCell}>Action</Text>
        </View>
        {Object.entries(marks).map(([subject, terms]) => {
          if (terms[term]) {
            return (
              <View style={styles.row} key={subject}>
                <Text style={styles.cell}>{subject}</Text>
                <Text style={styles.cell}>{terms[term]}</Text>
                <Text style={styles.cell}>{subjects[subject.toLowerCase()]?.termMarks[term]}</Text>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEdit(subject, terms[term], subjects[subject.toLowerCase()]?.termMarks[term], term)}
                >
                  <Icon name="edit" size={20} color="#111C2E" />
                </TouchableOpacity>
              </View>
            );
          }
          return null;
        })}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.header}>Edit Marks for {subject}</Text>
            <TextInput
              style={styles.input}
              value={obtainedMarks}
              onChangeText={setObtainedMarks}
              keyboardType="numeric"
            />
            <View style={styles.buttonContainer}>
              <Button mode="contained" onPress={handleSave} style={styles.saveButton}>
                Save
              </Button>
              <Button mode="contained" onPress={handleDelete} style={styles.saveButton}>
                Delete
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
        <Icon name="add" size={24} color="#111C2E" />
      </TouchableOpacity>

      {renderTermTable('firstTerm')}
      {renderTermTable('midTerm')}
      {renderTermTable('finalTerm')}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
    marginBottom: 30
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 15,
    color: '#6C85A6',
    backgroundColor: '#C7CFD9',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  sectionHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
    backgroundColor: '#253D5E',
    color: '#C7CFD9',
    padding: 10,
    textAlign: 'center',
  },
  table: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#6C85A6',
    paddingVertical: 10,
    color: 'black',
  },
  headerCell: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cell: {
    flex: 1,
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
  },
  editButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginRight: 10,
    paddingHorizontal: 10,
    backgroundColor: '#E2E2E2',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    marginTop: 20,
    marginBottom: 30,
    backgroundColor: '#475D8C',
    borderRadius: 15,
    width: 100,
  },
});

export default StudentDetailScreen;
