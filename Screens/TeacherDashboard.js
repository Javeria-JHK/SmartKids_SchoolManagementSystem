import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { auth } from '../firebaseConfig';

const TeacherDashboard = ({ navigation }) => {
    const handleLogout = () => {
        auth().signOut().then(() => {
            navigation.navigate('TeacherLogin');
        });
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Teacher Dashboard</Text>
            <Button
                title="Manage Marks"
                onPress={() => navigation.navigate('ManageMarks')}
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

export default TeacherDashboard;
