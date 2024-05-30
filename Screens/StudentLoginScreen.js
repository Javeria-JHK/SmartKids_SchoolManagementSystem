import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { getDocs, query, collection, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const StudentLoginScreen = ({ navigation }) => {
    const [registrationNumber, setRegistrationNumber] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        try {
            // Validate registration number
            const parsedRegNumber = parseInt(registrationNumber);
            if (isNaN(parsedRegNumber)) {
                setLoading(false);
                Alert.alert('Error', 'Invalid registration number format');
                return;
            }

            // Retrieve student data from Firebase
            const studentRef = collection(db, 'students');
            const q = query(studentRef, where('registrationNumber', '==', parsedRegNumber));
            const querySnapshot = await getDocs(q);

            // Check if student exists
            if (!querySnapshot.empty) {
                let studentData = null;
                querySnapshot.forEach((doc) => {
                    studentData = doc.data();
                });

                // Verify password
                if (studentData && studentData.password === password) {
                    setLoading(false);
                    navigation.navigate('StudentDashboard', { studentData });
                } else {
                    setLoading(false);
                    Alert.alert('Error', 'Invalid password');
                }
            } else {
                setLoading(false);
                Alert.alert('Error', 'Student not found');
            }
        } catch (error) {
            setLoading(false);
            Alert.alert('Error', 'An error occurred. Please try again later.');
            console.error('Error fetching student data:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Student Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Registration Number"
                value={registrationNumber}
                onChangeText={setRegistrationNumber}
                keyboardType="numeric"
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button
                title={loading ? 'Logging in...' : 'Login'}
                onPress={handleLogin}
                disabled={loading}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
});

export default StudentLoginScreen;
