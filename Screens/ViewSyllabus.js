import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Import your Firebase configuration

const ViewSyllabus = ({ route }) => {
    const [syllabus, setSyllabus] = useState([]);
    const [timetable, setTimetable] = useState([]);
    const { className } = route.params || {}; // Ensure route.params is not undefined

    useEffect(() => {
        if (!className) {
            console.log("Class name is missing.");
            return;
        }

        const fetchSyllabus = async () => {
            try {
                const docRef = doc(db, 'syllabus', className);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setSyllabus(docSnap.data().syllabus || []);
                } else {
                    setSyllabus([]);
                }
            } catch (error) {
                console.log('Error fetching syllabus:', error.message);
            }
        };

        const fetchTimetable = async () => {
            try {
                const docRef = doc(db, 'timetables', className);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setTimetable(docSnap.data().timetable || []);
                } else {
                    setTimetable([]);
                }
            } catch (error) {
                console.log('Error fetching timetable:', error.message);
            }
        };

        fetchSyllabus();
        fetchTimetable();
    }, [className]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Class Syllabus for {className}</Text>
            <ScrollView style={styles.syllabusContainer}>
                {syllabus.map((item, index) => (
                    <View key={index} style={styles.syllabusItem}>
                        <Text>{item}</Text>
                    </View>
                ))}
            </ScrollView>
            <Text style={styles.title}>Timetable for {className}</Text>
            <ScrollView style={styles.timetableContainer}>
                {timetable.map((item, index) => (
                    <View key={index} style={styles.timetableItem}>
                        <Text>{item}</Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    syllabusContainer: {
        marginTop: 10,
    },
    syllabusItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    timetableContainer: {
        marginTop: 10,
    },
    timetableItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
});

export default ViewSyllabus;
