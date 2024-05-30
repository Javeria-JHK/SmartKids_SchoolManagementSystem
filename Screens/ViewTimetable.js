import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '../firebaseConfig'; // Import the initialized Firebase app

const storage = getStorage(app); // Get Firebase Storage instance
const db = getFirestore(app); // Get Firestore instance

const ViewTimetable = () => {
  const [timetableURL, setTimetableURL] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTimetableURL();
  }, []);

  const fetchTimetableURL = async () => {
    try {
      const docRef = doc(db, 'timetables', 'currentTimetable');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const storageRef = ref(storage, docSnap.data().url);
        const downloadURL = await getDownloadURL(storageRef);
        setTimetableURL(downloadURL);
      } else {
        setError('No timetable found');
      }
    } catch (error) {
      setError('Error fetching timetable URL');
      console.error('Error fetching timetable URL:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>View Timetable</Text>
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : timetableURL ? (
        <Image source={{ uri: timetableURL }} style={styles.image} />
      ) : (
        <Text>No timetable available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  image: {
    width: 300,
    height: 300,
    marginTop: 20,
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
});

export default ViewTimetable;
