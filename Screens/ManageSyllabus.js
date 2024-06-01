import React, { useState, useEffect } from 'react';
import { View, Button, Image, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { getFirestore, doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { useTheme, FAB, Portal, Provider as PaperProvider, Modal, TextInput } from 'react-native-paper';
import { app } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';

const storage = getStorage(app);
const db = getFirestore(app);

const ManageSyllabus = () => {
    const [syllabusURL, setSyllabusURL] = useState('');
    const [className, setClassName] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const theme = useTheme();
    const navigation = useNavigation();

    useEffect(() => {
        fetchSyllabus();
    }, []);

    const fetchSyllabus = async () => {
        try {
            if (!className) {
                return;
            }
            const docRef = doc(db, 'syllabus', className);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setSyllabusURL(docSnap.data().url || '');
            } else {
                setSyllabusURL('');
            }
        } catch (error) {
            console.log('Error fetching syllabus:', error.message);
        }
    };

    const handleUploadSyllabus = async () => {
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
                const storageRef = ref(storage, `syllabus/${filename}`);
                await uploadBytes(storageRef, blob);
                const downloadURL = await getDownloadURL(storageRef);

                const docRef = doc(db, 'syllabus', className);
                await setDoc(docRef, { url: downloadURL }, { merge: true });

                setSyllabusURL(downloadURL);
                setIsModalVisible(false);
                Alert.alert('Success', 'Syllabus uploaded successfully');
            } else {
                throw new Error('Failed to select an image');
            }
        } catch (error) {
            console.error('Error uploading syllabus:', error);
            Alert.alert('Error', 'Failed to upload syllabus: ' + error.message);
        }
    };

    const handleRemoveSyllabus = async () => {
        try {
            if (!syllabusURL) {
                throw new Error('No syllabus URL found');
            }

            const filename = syllabusURL.split('/').pop().split('?')[0];
            if (!filename) {
                throw new Error('Invalid file path');
            }

            const storageRef = ref(storage, `syllabus/${filename}`);
            await deleteObject(storageRef).catch(error => {
                if (error.code === 'storage/object-not-found') {
                    console.log('File does not exist, skipping delete.');
                } else {
                    throw error;
                }
            });

            const docRef = doc(db, 'syllabus', className);
            await deleteDoc(docRef);

            setSyllabusURL('');
            Alert.alert('Success', 'Syllabus removed successfully');
        } catch (error) {
            console.error('Error removing syllabus:', error);
            Alert.alert('Error', 'Failed to remove syllabus: ' + error.message);
        }
    };

    return (
        <PaperProvider theme={theme}>
            <ScrollView contentContainerStyle={styles.container}>
                <TextInput
                    style={styles.input}
                    label="Enter class name"
                    value={className}
                    onChangeText={(text) => {
                        setClassName(text);
                        setSyllabusURL('');
                    }}
                />
                <FAB
                    style={styles.fab}
                    icon="plus"
                    onPress={() => setIsModalVisible(true)}
                />
                <Portal>
                    <Modal visible={isModalVisible} onDismiss={() => setIsModalVisible(false)}>
                        <View style={styles.modalContent}>
                            <Button title="Upload Syllabus" onPress={handleUploadSyllabus} />
                        </View>
                    </Modal>
                </Portal>
                {syllabusURL ? (
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: syllabusURL }} style={styles.image} />
                        <Button title="Remove" onPress={handleRemoveSyllabus} />
                    </View>
                ) : (
                    <Text style={styles.noSyllabusText}>No syllabus uploaded</Text>
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
    noSyllabusText: {
        fontSize: 18,
        color: '#333333',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default ManageSyllabus;
