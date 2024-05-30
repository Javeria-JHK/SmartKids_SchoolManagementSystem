import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, FlatList, Picker } from 'react-native';
import { firestore } from '../firebaseConfig';

const ManageTeachers = () => {
    const [teachers, setTeachers] = useState([]);
    const [classes, setClasses] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState('');
    const [selectedClass, setSelectedClass] = useState('');

    useEffect(() => {
        const fetchTeachers = async () => {
            const teacherDocs = await firestore().collection('teachers').get();
            setTeachers(teacherDocs.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };
        fetchTeachers();

        const classList = ['Nursery', 'Prep', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8'];
        setClasses(classList);
    }, []);

    const assignClassToTeacher = async () => {
        if (selectedTeacher && selectedClass) {
            await firestore().collection('teachers').doc(selectedTeacher).update({ class: selectedClass });
            alert('Class assigned successfully');
        } else {
            alert('Please select both teacher and class');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Manage Teachers</Text>
            <Picker
                selectedValue={selectedTeacher}
                onValueChange={(itemValue) => setSelectedTeacher(itemValue)}>
                <Picker.Item label="Select Teacher" value="" />
                {teachers.map((teacher) => (
                    <Picker.Item key={teacher.id} label={teacher.name} value={teacher.id} />
                ))}
            </Picker>
            <Picker
                selectedValue={selectedClass}
                onValueChange={(itemValue) => setSelectedClass(itemValue)}>
                <Picker.Item label="Select Class" value="" />
                {classes.map((cls) => (
                    <Picker.Item key={cls} label={cls} value={cls} />
                ))}
            </Picker>
            <Button title="Assign Class" onPress={assignClassToTeacher} />
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
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
    },
});

export default ManageTeachers;
