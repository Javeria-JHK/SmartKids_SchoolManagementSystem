//Ayesha
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, Provider as PaperProvider } from 'react-native-paper';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { firestore, auth } from '../firebaseConfig';

const StudentLoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigation = useNavigation();

    const handleLogin = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const q = query(collection(firestore, 'students'), where('email', '==', email));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const studentData = querySnapshot.docs[0].data(); // Assuming the first document is the correct one
                setEmail("");
                setPassword("");
                navigation.navigate('StudentPortal', { studentData });
            } else {
                setError('No Authorization');
            }
        } catch (error) {
            console.error('Login Error:', error);
            setError('Invalid Email or Password');
        }
    };

    return (
        <PaperProvider>
            <View style={styles.container}>
                <Text style={styles.header}>Student Login</Text>
                <TextInput
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                />
                <TextInput
                    label="Password"
                    value={password}
                    onChangeText={setPassword}
                    style={styles.input}
                    secureTextEntry
                />
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
                <Button mode="contained" onPress={handleLogin} style={styles.loginButton}>
                    Login
                </Button>
            </View>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
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
        marginBottom: 15,
        backgroundColor: '#E2E2E2',
    },
    loginButton: {
        marginTop: 20,
        backgroundColor: '#475D8C',
        borderRadius: 15,
    },
    errorText: {
        color: 'red',
        marginTop: 10,
        textAlign: 'center',
    },
});

export default StudentLoginScreen;
