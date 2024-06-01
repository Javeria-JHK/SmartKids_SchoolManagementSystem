//Javeria
import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Alert } from 'react-native';
import { Provider as PaperProvider, List, Text } from 'react-native-paper';
import { getFirestore, collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import { app } from '../firebaseConfig';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const firestore = getFirestore(app);

const ManageTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [expandedTeacher, setExpandedTeacher] = useState(null);
  const [user, setUser] = useState(null);

  const classes = ['Nursery', 'Prep', 'class1', 'class2', 'class3', 'class4', 'class5', 'class6', 'class7', 'class8'];

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchTeachers();
      } else {
        Alert.alert('Error', 'User not authenticated');
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchTeachers = async () => {
    try {
      const teachersCollection = collection(firestore, 'teachers');
      const querySnapshot = await getDocs(teachersCollection);
      const teachersList = querySnapshot.docs.map(docSnapshot => ({
        id: docSnapshot.id,
        ...docSnapshot.data(),
      }));
      setTeachers(teachersList);
    } catch (error) {
      console.error('Error fetching teachers:', error.message);
      Alert.alert('Error', 'Failed to fetch teachers');
    }
  };

  const handleAssignClass = async (teacherId, className) => {
    try {
      const teacherRef = doc(firestore, 'teachers', teacherId);
      await updateDoc(teacherRef, { class: doc(firestore, 'classes', className) });
      Alert.alert('Success', `Class ${className} assigned to teacher ${teacherId}`);
      fetchTeachers();
    } catch (error) {
      console.error('Error assigning class:', error.message);
      Alert.alert('Error', 'Failed to assign class');
    }
  };

  const handleRemoveClass = async (teacherId) => {
    try {
      const teacherRef = doc(firestore, 'teachers', teacherId);
      await updateDoc(teacherRef, { class: null });
      Alert.alert('Success', `Class removed from teacher ${teacherId}`);
      fetchTeachers();
    } catch (error) {
      console.error('Error removing class:', error.message);
      Alert.alert('Error', 'Failed to remove class');
    }
  };

  const handleToggleExpand = (teacherId) => {
    setExpandedTeacher(expandedTeacher === teacherId ? null : teacherId);
  };

  if (!user) {
    return <Text>Loading...</Text>;
  }

  return (
    <PaperProvider>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Manage Teachers</Text>
        {teachers.map((teacher) => (
          <List.Section style={styles.options} key={teacher.id} title={`${teacher.id}`}>
            <List.Accordion
              title={teacher.class ? `Assigned Class: ${teacher.class.id}` : 'No Class Assigned'}
              expanded={expandedTeacher === teacher.id}
              onPress={() => handleToggleExpand(teacher.id)}
            >
              {classes.map((className) => (
                <List.Item
                  key={className}
                  title={className}
                  onPress={() => handleAssignClass(teacher.id, className)}
                />
              ))}
              <List.Item
                title="Remove Class"
                onPress={() => handleRemoveClass(teacher.id)}
                titleStyle={{ color: 'red' }}
              />
            </List.Accordion>
          </List.Section>
        ))}
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
  options:{
    backgroundColor:'#E2E2E2'

  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default ManageTeachers;
