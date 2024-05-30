import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { db, useAuth } from '../firebaseConfig';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';

const ViewPreviousRecords = () => {
    const { currentUser } = useAuth();
    const [years, setYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState('');
    const [marks, setMarks] = useState({ first: [], mid: [], final: [] });
    const [feeStatus, setFeeStatus] = useState([]);
    const [timetable, setTimetable] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (currentUser) {
            const fetchYears = async () => {
                setLoading(true);
                try {
                    const yearsSet = new Set();
                    const marksSnapshot = await getDocs(collection(db, `students/${currentUser.uid}/marks`));
                    marksSnapshot.forEach(doc => yearsSet.add(doc.id));
                    const feeSnapshot = await getDocs(collection(db, `students/${currentUser.uid}/feeStatus`));
                    feeSnapshot.forEach(doc => yearsSet.add(doc.id));
                    const timetableSnapshot = await getDocs(collection(db, `students/${currentUser.uid}/timetable`));
                    timetableSnapshot.forEach(doc => yearsSet.add(doc.id));
                    setYears([...yearsSet]);
                } catch (error) {
                    console.error('Error fetching years:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchYears();
        }
    }, [currentUser]);

    useEffect(() => {
        if (currentUser) {
            const fetchYears = async () => {
                const yearsSet = new Set();
                const marksSnapshot = await getDocs(collection(db, `students/${currentUser.uid}/marks`));
                marksSnapshot.forEach(doc => yearsSet.add(doc.id));
                const feeSnapshot = await getDocs(collection(db, `students/${currentUser.uid}/feeStatus`));
                feeSnapshot.forEach(doc => yearsSet.add(doc.id));
                const timetableSnapshot = await getDocs(collection(db, `students/${currentUser.uid}/timetable`));
                timetableSnapshot.forEach(doc => yearsSet.add(doc.id));
                setYears([...yearsSet]);
            };
            fetchYears();
        }
    }, [currentUser]);


    const renderMarks = (marksData, title) => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>
            {marksData.map((item, index) => (
                <Text key={index}>{item.subject}: {item.marks}</Text>
            ))}
        </View>
    );

    const renderFeeStatus = (feeStatusData) => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Fee Status</Text>
            {feeStatusData.map((item, index) => (
                <Text key={index}>{item.date}: {item.status}</Text>
            ))}
        </View>
    );

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>View Previous Records</Text>
            <Picker
                selectedValue={selectedYear}
                onValueChange={(itemValue) => setSelectedYear(itemValue)}
                style={styles.picker}
            >
                <Picker.Item label="Select a year" value="" />
                {years.map((year) => (
                    <Picker.Item key={year} label={year} value={year} />
                ))}
            </Picker>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                selectedYear && (
                    <>
                        {renderMarks(marks.first, 'First Examination')}
                        {renderMarks(marks.mid, 'Mid Examination')}
                        {renderMarks(marks.final, 'Final Examination')}
                        {renderFeeStatus(feeStatus)}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Timetable for {selectedYear}</Text>
                            <Text>{timetable}</Text>
                        </View>
                    </>
                )
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
    },
    picker: {
        height: 50,
        width: '100%',
        marginBottom: 20,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        marginBottom: 10,
    },
});

export default ViewPreviousRecords;
