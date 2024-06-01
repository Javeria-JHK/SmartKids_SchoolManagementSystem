//Javeria
import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { auth } from '../firebaseConfig'; // Ensure this path is correct

const StudentDashboard = ({ navigation }) => {
    const handleLogout = () => {
        auth.signOut().then(() => {
            navigation.navigate('StudentLogin');
        }).catch(error => {
            console.error('Error during sign out: ', error);
        });
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Student Dashboard</Text>
            <Button
                title="View Marks"
                onPress={() => navigation.navigate('ViewMarks')}
            />
            <Button
                title="View Previous Record"
                onPress={() => navigation.navigate('ViewPreviousRecords')}
            />

            <Button
                title="View Fee Status"
                onPress={() => navigation.navigate('ViewFeeStatus')}
            />
            <Button
                title="View Timetable"
                onPress={() => navigation.navigate('ViewTimetable')}
            />
            <Button
                title="View Syllabus"
                onPress={() => navigation.navigate('ViewSyllabus')}
            />
            <Button title="Logout" onPress={handleLogout} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
    },
});

export default StudentDashboard;
