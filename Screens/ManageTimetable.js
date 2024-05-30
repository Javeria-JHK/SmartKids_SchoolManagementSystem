import React, { useState, useEffect } from 'react';
import { View, Button, Image, StyleSheet, Alert, PermissionsAndroid, Platform } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { getStorage, ref, uploadBytes, deleteObject, getDownloadURL } from 'firebase/storage';
import { getFirestore, doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { app } from '../firebaseConfig'; // Import the initialized Firebase app
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const storage = getStorage(app); // Get Firebase Storage instance
const db = getFirestore(app); // Get Firestore instance
const auth = getAuth(app); // Get Firebase Auth instance

const requestPermissions = async () => {
    if (Platform.OS === 'android') {
        try {
            const granted = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.CAMERA,
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            ]);

            if (
                granted[PermissionsAndroid.PERMISSIONS.CAMERA] === PermissionsAndroid.RESULTS.GRANTED &&
                granted[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] === PermissionsAndroid.RESULTS.GRANTED &&
                granted[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] === PermissionsAndroid.RESULTS.GRANTED
            ) {
                console.log('You can use the camera and read/write storage');
            } else {
                console.log('Camera or storage permissions denied');
            }
        } catch (err) {
            console.warn(err);
        }
    }
};

const ManageTimetable = () => {
    const [timetableURI, setTimetableURI] = useState(null);
    const [timetableURL, setTimetableURL] = useState(null);

    useEffect(() => {
        requestPermissions();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchTimetable();
            } else {
                Alert.alert('Error', 'User not authenticated');
            }
        });

        return () => unsubscribe();
    }, []);

    const fetchTimetable = async () => {
        try {
            const docRef = doc(db, 'timetables', 'currentTimetable');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setTimetableURL(docSnap.data().url);
            }
        } catch (error) {
            console.log('Error fetching timetable:', error.message);
        }
    };

    const handleUploadTimetable = async () => {
        try {
            const result = await launchImageLibrary({
                mediaType: 'photo',
                includeBase64: false,
            });

            if (result.didCancel) {
                console.log('User cancelled image picker');
            } else if (result.error) {
                console.log('ImagePicker Error: ', result.error);
            } else {
                const source = result.assets[0].uri;
                setTimetableURI(source);
                console.log('Image URI: ', source);

                const response = await fetch(source);
                const blob = await response.blob();
                const storageRef = ref(storage, `timetables/currentTimetable.jpg`);
                await uploadBytes(storageRef, blob);

                const downloadURL = await getDownloadURL(storageRef);
                await setDoc(doc(db, 'timetables', 'currentTimetable'), { url: downloadURL });

                setTimetableURL(downloadURL);
                Alert.alert('Success', 'Timetable uploaded successfully');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to upload timetable: ' + error.message);
        }
    };

    const handleRemoveTimetable = async () => {
        try {
            const storageRef = ref(storage, `timetables/currentTimetable.jpg`);
            await deleteObject(storageRef);

            await deleteDoc(doc(db, 'timetables', 'currentTimetable'));
            setTimetableURL(null);
            Alert.alert('Success', 'Timetable removed successfully');
        } catch (error) {
            Alert.alert('Error', 'Failed to remove timetable: ' + error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Button title="Upload Timetable" onPress={handleUploadTimetable} />
            {timetableURL && <Image source={{ uri: timetableURL }} style={styles.image} />}
            {timetableURL && <Button title="Remove Timetable" onPress={handleRemoveTimetable} />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    image: {
        width: 300,
        height: 300,
        marginTop: 20,
    },
});

export default ManageTimetable;
