import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { db, useAuth } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const ViewMarks = () => {
    const { currentUser } = useAuth();
    const [marks, setMarks] = useState({ first: [], mid: [], final: [] });

    useEffect(() => {
        if (currentUser) {
            const studentDocRef = doc(db, 'students', currentUser.uid);
            getDoc(studentDocRef).then(doc => {
                if (doc.exists()) {
                    setMarks(doc.data().marks || { first: [], mid: [], final: [] });
                }
            }).catch(error => {
                console.error('Error fetching document:', error);
            });
        }
    }, [currentUser]);

    const renderMarks = (marksData, title) => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <FlatList
                data={marksData}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.markItem}>
                        <Text>{item.subject}: {item.marks}</Text>
                    </View>
                )}
            />
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>View Marks</Text>
            {renderMarks(marks.first, 'First Examination')}
            {renderMarks(marks.mid, 'Mid Examination')}
            {renderMarks(marks.final, 'Final Examination')}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        marginBottom: 10,
    },
    markItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
});

export default ViewMarks;
