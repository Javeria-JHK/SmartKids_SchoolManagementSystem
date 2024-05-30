import React, { useState, useEffect } from 'react';
import { View, Button, Image, StyleSheet, Alert, TextInput, ScrollView } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { getFirestore, doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { app } from '../firebaseConfig'; // Import the initialized Firebase app
import { getAuth } from 'firebase/auth';

const storage = getStorage(app); // Get Firebase Storage instance
const db = getFirestore(app); // Get Firestore instance
const auth = getAuth(app); // Get Firebase Auth instance

const ManageSyllabus = () => {
    const [syllabusURLs, setSyllabusURLs] = useState([]);
    const [className, setClassName] = useState('');

    useEffect(() => {
        fetchSyllabus();
    }, [className]);

    const fetchSyllabus = async () => {
        if (!className) return;

        try {
            const docRef = doc(db, 'syllabus', className);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setSyllabusURLs(docSnap.data().urls || []);
            } else {
                setSyllabusURLs([]);
            }
        } catch (error) {
            console.log('Error fetching syllabus:', error.message);
        }
    };

    const handleUploadSyllabus = async () => {
        if (!className) {
            Alert.alert('Error', 'Please enter a class name');
            return;
        }

        try {
            const result = await launchImageLibrary({
                mediaType: 'photo',
                includeBase64: false,
            });

            if (result.didCancel) {
                console.log('User cancelled image picker');
                return; // Exit function if the user cancels
            } else if (result.error) {
                console.log('ImagePicker Error: ', result.error);
                return; // Exit function if there's an error
            }

            const source = result.assets[0].uri;
            console.log('Image URI: ', source);

            const response = await fetch(source);
            const blob = await response.blob();

            const filename = `syllabus_${Date.now()}.jpg`;
            const storageRef = ref(storage, `syllabus/${className}/${filename}`);
            await uploadBytes(storageRef, blob);

            const downloadURL = await getDownloadURL(storageRef);

            const docRef = doc(db, 'syllabus', className);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                // If the document exists, update it with the new URL
                await updateDoc(docRef, {
                    urls: arrayUnion(downloadURL)
                });
            } else {
                // If the document doesn't exist, create a new document
                await setDoc(docRef, { urls: [downloadURL] });
            }

            fetchSyllabus();
            Alert.alert('Success', 'Syllabus uploaded successfully');
        } catch (error) {
            Alert.alert('Error', 'Failed to upload syllabus: ' + error.message);
        }
    };

    const handleRemoveSyllabus = async (url) => {
        if (!className) {
            Alert.alert('Error', 'Please enter a class name');
            return;
        }

        try {
            const filename = url.split('/').pop();
            const storageRef = ref(storage, `syllabus/${className}/${filename}`);
            await deleteObject(storageRef);

            const docRef = doc(db, 'syllabus', className);
            await updateDoc(docRef, {
                urls: arrayRemove(url)
            });

            fetchSyllabus();
            Alert.alert('Success', 'Syllabus removed successfully');
        } catch (error) {
            Alert.alert('Error', 'Failed to remove syllabus: ' + error.message);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Enter class name"
                value={className}
                onChangeText={setClassName}
            />
            <Button title="Upload Syllabus" onPress={handleUploadSyllabus} />
            <ScrollView style={styles.scrollContainer}>
                {syllabusURLs.map((url, index) => (
                    <View key={index} style={styles.imageContainer}>
                        <Image source={{ uri: url }} style={styles.image} />
                        <Button title="Remove" onPress={() => handleRemoveSyllabus(url)} />
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        padding: 16,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
        width: '80%',
    },
    scrollContainer: {
        width: '100%',
        marginTop: 20,
    },
    imageContainer: {
        marginBottom: 20,
        alignItems: 'center',
    },
    image: {
        width: 300,
        height: 300,
    },
});

export default ManageSyllabus;
