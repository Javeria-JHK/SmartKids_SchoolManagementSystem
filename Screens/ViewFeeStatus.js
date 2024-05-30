import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, FlatList } from 'react-native';
import { db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const StudentFeeStatus = () => {
    const [feeStatus, setFeeStatus] = useState(null);
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeeStatus = async () => {
            const auth = getAuth();
            const user = auth.currentUser;

            if (user) {
                console.log('Current User UID:', user.uid); // Debugging line to check UID
                try {
                    const studentDocRef = doc(db, 'students', user.uid);
                    const studentDoc = await getDoc(studentDocRef);

                    if (studentDoc.exists()) {
                        const data = studentDoc.data();
                        setFeeStatus(data.feeStatus || {});
                        setPaymentHistory(data.paymentHistory || []);
                    } else {
                        Alert.alert('Error', 'Student data not found');
                    }
                } catch (error) {
                    Alert.alert('Error', error.message);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
                Alert.alert('Error', 'User not authenticated');
            }
        };

        fetchFeeStatus();
    }, []);

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (!feeStatus) {
        return (
            <View style={styles.container}>
                <Text>No fee status available</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Fee Status</Text>
            <ScrollView>
                <View style={styles.statusItem}>
                    <Text>Registration Number: {feeStatus.registrationNumber}</Text>
                    <Text>Name: {feeStatus.name}</Text>
                    <Text>Amount Due: {feeStatus.amountDue}</Text>
                    <Text>Amount Paid: {feeStatus.amountPaid}</Text>
                    <Text>Payable Amount: {feeStatus.payableAmount}</Text>
                    <Text>Payment Date: {feeStatus.paymentDate}</Text>
                    <Text>Late Fees: {feeStatus.lateFees}</Text>
                    <Text>Remarks: {feeStatus.remarks}</Text>
                </View>
            </ScrollView>

            <Text style={styles.title}>Payment History</Text>
            <FlatList
                data={paymentHistory}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.paymentItem}>
                        <Text>Date: {item.date}</Text>
                        <Text>Amount: {item.amount}</Text>
                        <Text>Status: {item.status}</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
    },
    statusItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    paymentItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
});

export default StudentFeeStatus;
