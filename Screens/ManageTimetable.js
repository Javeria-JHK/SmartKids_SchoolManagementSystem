import React, { useState, useEffect } from 'react';
import { View, Button, Image, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { useTheme, FAB, Portal, Provider as PaperProvider, Modal, TextInput } from 'react-native-paper';
import { app } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';

const storage = getStorage(app);
const db = getFirestore(app);

const ManageTimetable = () => {
    const [timetableURL, setTimetableURL] = useState('');
    const [className, setClassName] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const theme = useTheme();
    const navigation = useNavigation();

    useEffect(() => {
        fetchTimetable();
    }, []);

    const fetchTimetable = async () => {
        try {
            const docRef = doc(db, 'timetable', 'all_classes');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setTimetableURL(docSnap.data().url || '');
            } else {
                setTimetableURL('');
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

            if (!result.didCancel && !result.error && result.assets && result.assets.length > 0) {
                const source = result.assets[0].uri;

                if (!source) {
                    throw new Error('Selected image source is null');
                }

                const response = await fetch(source);
                const blob = await response.blob();
                const filename = `${Date.now()}-${result.assets[0].fileName}`;
                const storageRef = ref(storage, `timetable/${filename}`);
                await uploadBytes(storageRef, blob);
                const downloadURL = await getDownloadURL(storageRef);

                const docRef = doc(db, 'timetable', 'all_classes');
                await setDoc(docRef, { url: downloadURL }, { merge: true });

                setTimetableURL(downloadURL);
                setIsModalVisible(false);
                Alert.alert('Success', 'Timetable uploaded successfully');
            } else {
                throw new Error('Failed to select an image');
            }
        } catch (error) {
            console.error('Error uploading timetable:', error);
            Alert.alert('Error', 'Failed to upload timetable: ' + error.message);
        }
    };

    const handleRemoveTimetable = async () => {
        try {
            if (!timetableURL) {
                throw new Error('No timetable URL found');
            }

            // Extract filename from URL
            const filename = timetableURL.split('/').pop().split('?')[0];

            // Validate filename
            if (!filename) {
                throw new Error('Invalid file path');
            }

            const storageRef = ref(storage, `timetable/${filename}`);

            // Attempt to delete the object if it exists
            await deleteObject(storageRef).catch(error => {
                if (error.code === 'storage/object-not-found') {
                    console.log('File does not exist, skipping delete.');
                } else {
                    throw error;
                }
            });

            const docRef = doc(db, 'timetable', 'all_classes');
            await setDoc(docRef, { url: '' }, { merge: true });

            setTimetableURL('');
            Alert.alert('Success', 'Timetable removed successfully');
        } catch (error) {
            console.error('Error removing timetable:', error);
            Alert.alert('Error', 'Failed to remove timetable: ' + error.message);
        }
    };

    return (
        <PaperProvider theme={theme}>
            <ScrollView contentContainerStyle={styles.container}>
                <TextInput
                    style={styles.input}
                    label="Enter class name"
                    value={className}
                    onChangeText={setClassName}
                />
                <FAB
                    style={styles.fab}
                    icon="plus"
                    onPress={() => setIsModalVisible(true)}
                />
                <Portal>
                    <Modal visible={isModalVisible} onDismiss={() => setIsModalVisible(false)}>
                        <View style={styles.modalContent}>
                            <Button title="Upload Timetable" onPress={handleUploadTimetable} />
                        </View>
                    </Modal>
                </Portal>
                {timetableURL ? (
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: timetableURL }} style={styles.image} />
                        <Button title="Remove" onPress={handleRemoveTimetable} />
                    </View>
                ) : (
                    <Text style={styles.noTimetableText}>No timetable uploaded</Text>
                )}
            </ScrollView>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: 'center',
        backgroundColor: '#ffffff',
        paddingVertical: 20,
    },
    input: {
        marginBottom: 20,
        width: '80%',
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: '#475D8C',
    },
    modalContent: {
        backgroundColor: '#ffffff',
        padding: 20,
        borderRadius: 10,
    },
    imageContainer: {
        alignItems: 'center',
    },
    image: {
        width: 300,
        height: 300,
    },
    noTimetableText: {
        fontSize: 18,
        color: '#333333',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default ManageTimetable;
