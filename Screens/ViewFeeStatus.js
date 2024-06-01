//Ayesha
import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Text, PaperProvider } from 'react-native-paper';
import { query, where, collection, getDocs } from 'firebase/firestore';
import { firestore } from '../firebaseConfig';

const ViewFeeStatus = () => {


    const [error, setError] = useState('');
    const [feeDocs, setFeeDocs] = useState([]);

    useEffect(() => {
        const fetchFeeStatus = async () => {
            try {
                const q = query(collection(firestore, 'feeStatus'));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const fetchedFees = querySnapshot.docs.map(doc => doc.data());
                    setFeeDocs(fetchedFees);
                } else {
                    setError('No fee Chalan');
                }
            } catch (error) {
                console.error('Error fetching fee status:', error);
                setError('Error fetching fee status');
            }
        };

        fetchFeeStatus();
    }, []);

    return (
        <PaperProvider>
            <View style={styles.container}>
                <Text style={styles.header}>View Fee Status</Text>
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
                {feeDocs.map((fee, index) => (
                    <View key={index} style={styles.feeContainer}>
                        <Text>Amount Due: {fee.amountDue}</Text>
                        <Text>Amount Paid: {fee.amountPaid}</Text>
                        <Text>Late Fees: {fee.lateFees?fee.lateFees:'No'}</Text>
                        <Text>Payable Amount: {fee.payableAmount}</Text>
                        <Text>Payment Date: {fee.paymentDate}</Text>
                        <Text>Remarks: {fee.remarks}</Text>
                    </View>
                ))}
            </View>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8f9fa',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    feeContainer: {
        padding: 10,
        backgroundColor: '#E2E2E2',
        borderRadius: 10,
        marginBottom: 15,
    },
    errorText: {
        color: 'red',
        marginBottom: 15,
        textAlign: 'center',
    },
});

export default ViewFeeStatus;
