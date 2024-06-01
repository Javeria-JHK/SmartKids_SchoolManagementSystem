//Ayesha
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, Provider as PaperProvider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const StudentPortal = () => {
    const navigation = useNavigation();
 
  

    return (
        <PaperProvider>
            <View style={styles.container}>
                <Text style={styles.header}>Student Portal</Text>
                <Button mode="contained" onPress={() => navigation.navigate('ViewMarks')} style={styles.button}>
                    View Marks
                </Button>
                <Button mode="contained" onPress={() => navigation.navigate('ViewFeeStatus')} style={styles.button}>
                    View Fee Status
                </Button>
                <Button mode="contained" onPress={() => navigation.navigate('ViewTimetable')} style={styles.button}>
                    View Timetable
                </Button>
                <Button mode="contained" onPress={() => navigation.navigate('ViewSyllabus')} style={styles.button}>
                    View Syllabus
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
    button: {
        marginTop: 20,
        backgroundColor: '#475D8C',
        borderRadius: 15,
    },
});

export default StudentPortal;
