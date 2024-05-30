import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { TextInput, Button, Provider as PaperProvider, Checkbox,List  } from 'react-native-paper';
import { doc, setDoc, updateDoc,deleteDoc } from 'firebase/firestore';
import { firestore, auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigation, useRoute } from '@react-navigation/native';
import MyDatePicker from './components/MyDatePicker';

const ManageStudents = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const student = route.params?.student;

  const [registrationNumber, setRegistrationNumber] = useState(student?.registrationNumber?.toString() || '');
  const [dateOfAdmission, setAdmissionDate] = useState(student?.admissionDate ? new Date(student.admissionDate) : new Date());
  const [name, setName] = useState(student?.name || '');
  const [dateOfBirth, setDob] = useState(student?.dob ? new Date(student.dob) : new Date());
  const [gender, setGender] = useState(student?.gender || '');
  const [fatherName, setFatherName] = useState(student?.fatherName || '');
  const [fatherCaste, setCaste] = useState(student?.fatherCaste || '');
  const [fatherOccupation, setOccupation] = useState(student?.fatherOccupation || '');
  const [residence, setResidence] = useState(student?.residence || '');
  const [admissionClass, setAdmissionClass] = useState(student?.class || '');
  const [email, setEmail] = useState(student?.email || '');
  const [password, setPassword] = useState('');
  const [remarks, setRemarks] = useState(student?.remarks || '');
  const [error, setError] = useState('');
  const [classListExpanded, setClassListExpanded] = useState(false);

  const handleClassToggle = () => {
    setClassListExpanded(!classListExpanded);
  };

  const handleSave = async () => {
    try {
      let user;

      if (!student) {
        const loginEmail =  `${registrationNumber}sms.com`;
        const userCredential = await createUserWithEmailAndPassword(auth, loginEmail, password);
        user = userCredential.user;
      }

      const classRef = doc(firestore, 'classes', admissionClass);

      const studentData = {
        registrationNumber: parseInt(registrationNumber, 10),
        dateOfAdmission: dateOfAdmission.toISOString(),
        name,
        dateOfBirth: dateOfBirth.toISOString(),
        gender,
        fatherName,
        fatherCaste,
        fatherOccupation,
        residence,
        class: classRef,
        email,
        remarks,
      };

      if (student) {
        await updateDoc(doc(firestore, 'students', `student${registrationNumber}`), studentData);
      } else {
        await setDoc(doc(firestore, 'students', `student${registrationNumber}`), studentData);
      }

      console.log('Student saved:', studentData);
      navigation.goBack();
    } catch (error) {
      console.error('Error saving student:', error);
      setError('Error saving student');
    }

  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(firestore, 'students', `student${registrationNumber}`));
      console.log('Student deleted');
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting student:', error);
      setError('Error deleting student');
    }
  };

  return (
    <PaperProvider>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>{!student?'Register Student': 'Update Student'}</Text>
        <TextInput
          label="Registration Number"
          value={registrationNumber}
          onChangeText={text => setRegistrationNumber(text)}
          style={styles.input}
          keyboardType="numeric"
        />
        {!student && (
        <Text style={styles.label}>Admission Date</Text>)}
        {!student && (<MyDatePicker date={dateOfAdmission} onDateChange={setAdmissionDate}  />)}
        <TextInput
          label="Name"
          value={name}
          onChangeText={text => setName(text)}
          style={styles.input}
        />
        {!student && (
        <Text style={styles.label}>Date of Birth</Text>)}
        {!student && (
       
        <MyDatePicker date={dateOfBirth} onDateChange={setDob} />)}
        {!student && (<Text style={styles.label}>Gender</Text>)}
        {!student && (<View style={styles.genderContainer}>
          <Checkbox
            status={gender === 'Male' ? 'checked' : 'unchecked'}
            onPress={() => setGender('Male')}
            color="#475D8C"
          />
          <Text style={styles.checkboxLabel}>Male</Text>
          <Checkbox
            status={gender === 'Female' ? 'checked' : 'unchecked'}
            onPress={() => setGender('Female')}
            color="#475D8C"
          />
          <Text style={styles.checkboxLabel}>Female</Text>
        </View>)}
        <TextInput
          label="Father Name"
          value={fatherName}
          onChangeText={text => setFatherName(text)}
          style={styles.input}
        />
        <TextInput
          label="Caste"
          value={fatherCaste}
          onChangeText={text => setCaste(text)}
          style={styles.input}
        />
        <TextInput
          label="Father's Occupation"
          value={fatherOccupation}
          onChangeText={text => setOccupation(text)}
          style={styles.input}
        />
        <TextInput
          label="Residence"
          value={residence}
          onChangeText={text => setResidence(text)}
          style={styles.input}
        />
        <List.Section title="Admission Class">
          <List.Accordion
            title={admissionClass ? admissionClass.replace('class', '') : 'Select Class'}
            expanded={classListExpanded}
            onPress={handleClassToggle}
            style={styles.input}
          >
            <List.Item title="Nursery" onPress={() => { setAdmissionClass('classNursery'); setClassListExpanded(false); }} />
            <List.Item title="Prep" onPress={() => { setAdmissionClass('classPrep'); setClassListExpanded(false); }} />
            <List.Item title="Class 1" onPress={() => { setAdmissionClass('class1'); setClassListExpanded(false); }} />
            <List.Item title="Class 2" onPress={() => { setAdmissionClass('class2'); setClassListExpanded(false); }} />
            <List.Item title="Class 3" onPress={() => { setAdmissionClass('class3'); setClassListExpanded(false); }} />
            <List.Item title="Class 4" onPress={() => { setAdmissionClass('class4'); setClassListExpanded(false); }} />
            <List.Item title="Class 5" onPress={() => { setAdmissionClass('class5'); setClassListExpanded(false); }} />
            <List.Item title="Class 6" onPress={() => { setAdmissionClass('class6'); setClassListExpanded(false); }} />
            <List.Item title="Class 7" onPress={() => { setAdmissionClass('class7'); setClassListExpanded(false); }} />
            <List.Item title="Class 8" onPress={() => { setAdmissionClass('class8'); setClassListExpanded(false); }} />


            

          </List.Accordion>
        </List.Section>
        <TextInput
          label="Email"
          value={email}
          onChangeText={text => setEmail(text)}
          style={styles.input}
          keyboardType="email-address"
        />
        {!student && (
          <TextInput
            label="Password"
            value={password}
            onChangeText={text => setPassword(text)}
            style={styles.input}
            secureTextEntry
          />
        )}
        <TextInput
          label="Remarks"
          value={remarks}
          onChangeText={text => setRemarks(text)}
          style={styles.input}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <Button mode="contained" onPress={handleSave} style={styles.saveButton}>
          {!student?'Save':'Update'}
        </Button>

        {student && (
          <Button mode="contained" onPress={handleDelete} style={[styles.saveButton, { backgroundColor: '#6C85A6',  marginBottom:35, }]}>
            Delete
          </Button>
        )}
      </ScrollView>
    </PaperProvider>
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
  input: {
    marginBottom: 15,
    backgroundColor: '#E2E2E2',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  datePicker: {
    width: '100%',
    marginBottom: 15,
  },
  errorText: {
    color: 'red',
    marginBottom: 15,
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: '#475D8C',
    borderRadius: 15,
    marginBottom:5,
    width:'80%',
    alignSelf:'center'
  },
  genderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkboxLabel: {
    marginLeft: 8,
    marginRight: 16,
  },
});

export default ManageStudents;



