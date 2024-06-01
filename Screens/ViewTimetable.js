import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Provider as PaperProvider } from 'react-native-paper';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '../firebaseConfig';

const db = getFirestore(app);

const ViewTimetable = () => {
  const [timetableURL, setTimetableURL] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTimetable();
  }, []);

  const fetchTimetable = async () => {
    try {
      const docRef = doc(db, 'timetable', 'all_classes');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setTimetableURL(docSnap.data().url || '');
      } else {
        setTimetableURL('');
      }
    } catch (error) {
      console.log('Error fetching timetable:', error.message);
      setError('Error fetching timetable: ' + error.message);
    }
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text style={styles.header}>View Timetable</Text>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {timetableURL ? (
          <View style={styles.timetableContainer}>
            <Image source={{ uri: timetableURL }} style={styles.image} />
          </View>
        ) : (
          <Text style={styles.noTimetableText}>No timetable uploaded</Text>
        )}
      </View>
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
  timetableContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#E2E2E2',
    borderRadius: 10,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 15,
    textAlign: 'center',
  },
  noTimetableText: {
    fontSize: 18,
    color: '#333333',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ViewTimetable;
