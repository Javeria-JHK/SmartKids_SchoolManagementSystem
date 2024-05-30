import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Text, TextInput, Button } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { firestore } from '../../../firebaseConfig';

const AddMarksScreen = ({ route }) => {
  const navigation = useNavigation();
  const { onSave } = route.params; // Get the onSave function from route params
  const [subjects, setSubjects] = useState([{ name: '', obtainedMarks: '' }]);
  const [examType, setExamType] = useState('');

  const handleAddSubject = () => {
    setSubjects([...subjects, { name: '', obtainedMarks: '' }]);
  };

  const handleRemoveSubject = (index) => {
    const newSubjects = subjects.filter((_, i) => i !== index);
    setSubjects(newSubjects);
  };

  const handleSubjectChange = (index, key, value) => {
    const newSubjects = subjects.map((subject, i) =>
      i === index ? { ...subject, [key]: value } : subject
    );
    setSubjects(newSubjects);
  };

  const saveMarksToFirestore = async () => {
    try {
      const marksData = subjects.map(subject => ({
        subject: subject.name,
        obtainedMarks: subject.obtainedMarks,
        term: examType
      }));

      const docRef = doc(firestore, 'marks', 'marks1');
      const updates = {};
      marksData.forEach(({ subject, obtainedMarks, term }) => {
        updates[`${subject}.${term}`] = obtainedMarks;
      });
      await updateDoc(docRef, updates);

      return marksData;
    } catch (error) {
      console.error('Error adding marks:', error);
      return [];
    }
  };

  const handleSave = async () => {
    // Save marks to Firestore
    const addedMarks = await saveMarksToFirestore();
    // Pass the added marks back to the previous screen
    onSave(addedMarks);
    // Navigate back to the previous screen
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Add Marks</Text>
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Select Exam Type:</Text>
        <Picker
          selectedValue={examType}
          style={styles.picker}
          onValueChange={(itemValue) => setExamType(itemValue)}
         
        ><Picker.Item label="Select Term" value="" enabled={false} />
          <Picker.Item label="First Term" value="firstTerm" />
          <Picker.Item label="Mid Term" value="midTerm" />
          <Picker.Item label="Final Term" value="finalTerm" />
        </Picker>
      </View>

      {subjects.map((subject, index) => (
        <View key={index} style={[styles.subjectContainer, styles.shadow]}>
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Subject:</Text>
            <Picker
              selectedValue={subject.name}
              style={styles.picker}
              onValueChange={(itemValue) => handleSubjectChange(index, 'name', itemValue)}
            >
               <Picker.Item label="Select Subject" value="" enabled={false} />
              <Picker.Item label="English" value="English" />
              <Picker.Item label="Urdu" value="Urdu" />
              <Picker.Item label="Maths" value="Maths" />
              <Picker.Item label="Nazra-e-Quran" value="Nazra-e-Quran" />
            </Picker>
          </View>
          <View style={styles.marksSection}>
            <TextInput
              placeholder={`Obtained Marks`}
              value={subject.obtainedMarks}
              onChangeText={(text) => handleSubjectChange(index, 'obtainedMarks', text)}
              style={styles.input}
              keyboardType="numeric"
            />
            <TouchableOpacity onPress={() => handleRemoveSubject(index)}>
              <Icon name="delete" size={24} color="#111C2E" />
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <Button mode="contained" onPress={handleAddSubject} style={styles.addButton}>
        Add Subject
      </Button>
      <Button mode="contained" onPress={handleSave} style={styles.saveButton}>
        Save
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  pickerContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  marksSection: {
    flex: 1,
    flexDirection: 'row',
  },
  picker: {
    height: 50,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
  },
  subjectContainer: {
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
  },
  input: {
    flex: 1,
    height: 40,
    width: 150,
    borderColor: '#ccc',
    borderWidth: 1,
    marginRight: 10,
    paddingHorizontal: 10,
    backgroundColor: '#E2E2E2',
  },
  addButton: {
    marginTop: 20,
    borderRadius: 15,
    width: 150,
    backgroundColor: '#6C85A6',
    alignSelf: 'flex-end',
  },
  saveButton: {
    marginTop: 20,
    marginBottom: 50,
    backgroundColor: '#475D8C',
    borderRadius: 15,
    width: 250,
    alignSelf: 'center',
  },
  shadow: {
    shadowColor: '#000',
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
});

export default AddMarksScreen;
