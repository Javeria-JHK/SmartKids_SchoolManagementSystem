//Ayesha

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert } from 'react-native';
import { firestore } from '../firebaseConfig';

const ManageMarks = () => {
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [marks, setMarks] = useState({
        firstTerm: '',
        midTerm: '',
        finalTerm: '',
    });

    useEffect(() => {
        const unsubscribe = firestore()
            .collection('students')
            .onSnapshot(snapshot => {
                const studentsList = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setStudents(studentsList);
            });
        return unsubscribe;
    }, []);

    const handleSelectStudent = (student) => {
        setSelectedStudent(student);
        setMarks({
            firstTerm: student.marks?.firstTerm || '',
            midTerm: student.marks?.midTerm || '',
            finalTerm: student.marks?.finalTerm || '',
        });
    };

    const handleSaveMarks = () => {
        if (!selectedStudent) {
            Alert.alert('Please select a student first.');
            return;
        }
        firestore()
            .collection('students')
            .doc(selectedStudent.id)
            .update({ marks })
            .then(() => {
                Alert.alert('Marks updated successfully!');
                setSelectedStudent(null);
                setMarks({
                    firstTerm: '',
                    midTerm: '',
                    finalTerm: '',
                });
            })
            .catch(error => {
                Alert.alert(error.message);
            });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Manage Marks</Text>
            <FlatList
                data={students}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Button title={item.name} onPress={() => handleSelectStudent(item)} />
                )}
            />
            {selectedStudent && (
                <View>
                    <Text style={styles.subtitle}>Selected Student: {selectedStudent.name}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="First Term Marks"
                        value={marks.firstTerm}
                        onChangeText={(text) => setMarks({ ...marks, firstTerm: text })}
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Mid Term Marks"
                        value={marks.midTerm}
                        onChangeText={(text) => setMarks({ ...marks, midTerm: text })}
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Final Term Marks"
                        value={marks.finalTerm}
                        onChangeText={(text) => setMarks({ ...marks, finalTerm: text })}
                        keyboardType="numeric"
                    />
                    <Button title="Save Marks" onPress={handleSaveMarks} />
                </View>
            )}
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
    subtitle: {
        fontSize: 20,
        marginVertical: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
});

export default ManageMarks;
