//Ayesha
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Text, TextInput, Button,PaperProvider } from 'react-native-paper';
import { doc, getDoc, updateDoc, deleteField, collection, getDocs } from 'firebase/firestore';
import { firestore } from '../firebaseConfig';

const ViewMarks = () => {
    const route = useRoute();
  const navigation = useNavigation();
 

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
  }, []);





  const renderTermTable = (term) => (
    <View key={term}>
      <Text style={styles.sectionHeader}>{term}</Text>
      <View style={styles.table}>
        <View style={styles.headerRow}>
          <Text style={styles.headerCell}>Subject</Text>
          <Text style={styles.headerCell}>Obtained Marks</Text>
          <Text style={styles.headerCell}>Total Marks</Text>
        
        </View>
        {Object.entries(marks).map(([subject, terms]) => {
          if (terms[term]) {
            return (
              <View style={styles.row} key={subject}>
                <Text style={styles.cell}>{subject}</Text>
                <Text style={styles.cell}>{terms[term]}</Text>
                <Text style={styles.cell}>{subjects[subject.toLowerCase()]?.termMarks[term]}</Text>
       
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



export default ViewMarks;
