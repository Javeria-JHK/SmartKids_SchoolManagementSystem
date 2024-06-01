import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, TextInput, Button } from 'react-native';
import { Text, Provider as PaperProvider } from 'react-native-paper';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '../firebaseConfig';

const db = getFirestore(app);

const ViewSyllabus = () => {
    const [className, setClassName] = useState('');
    const [syllabusURL, setSyllabusURL] = useState('');
    const [error, setError] = useState('');

    const fetchSyllabus = async () => {
        try {
            const docRef = doc(db, 'syllabus', className.trim());
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setSyllabusURL(docSnap.data().url || '');
            } else {
                setSyllabusURL('');
                setError('No syllabus uploaded for this class');
            }
        } catch (error) {
            console.log('Error fetching syllabus:', error.message);
            setError('Error fetching syllabus: ' + error.message);
        }
    };

    return (
        <PaperProvider>
            <View style={styles.container}>
                <Text style={styles.header}>View Syllabus</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter class name"
                    value={className}
                    onChangeText={setClassName}
                />
                <Button title="Fetch Syllabus" onPress={fetchSyllabus} />
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
                {syllabusURL ? (
                    <View style={styles.syllabusContainer}>
                        <Image source={{ uri: syllabusURL }} style={styles.image} />
                    </View>
                ) : (
                    !error && <Text style={styles.noSyllabusText}>No syllabus uploaded</Text>
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
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    syllabusContainer: {
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
    noSyllabusText: {
        fontSize: 18,
        color: '#333333',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default ViewSyllabus;
