//Ayesha
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TextInput, Button, Provider as PaperProvider } from 'react-native-paper';
import { collection, doc, getDoc, setDoc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { firestore } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import MyDatePicker from './components/MyDatePicker';

const ManageFeeStatus = () => {
    const navigation = useNavigation();

    const [registration, setRegistration] = useState('');
    const [studentName, setStudentName] = useState('');
    const [amountDue, setAmountDue] = useState('');
    const [amountPaid, setAmountPaid] = useState('');
    const [payableAmount, setPayableAmount] = useState('');
    const [paymentDate, setPaymentDate] = useState(new Date());
    const [remarks, setRemarks] = useState('');
    const [lateFees, setLateFees] = useState(false);
    const [error, setError] = useState('');
    const [feeId, setFeeId] = useState(null);

    useEffect(() => {
        if (feeId) {
            fetchFeeData();
        }
    }, [feeId]);

    const fetchFeeData = async () => {
        try {
            const feeDoc = doc(firestore, 'feeStatus', feeId);
            const docSnapshot = await getDoc(feeDoc);

            if (docSnapshot.exists()) {
                const feeData = docSnapshot.data();
                setRegistration(feeData.registration);
                setStudentName(feeData.studentName);
                setAmountDue(feeData.amountDue);
                setAmountPaid(feeData.amountPaid);
                setPayableAmount(feeData.payableAmount);
                setPaymentDate(new Date(feeData.paymentDate));
                setRemarks(feeData.remarks);
                setLateFees(feeData.lateFees);
            } else {
                setError('Fee record not found');
            }
        } catch (error) {
            console.error('Error fetching fee data:', error);
            setError('Error fetching fee data');
        }
    };

    const handleSave = async () => {
        try {
            const feeData = {
                registration,
                studentName,
                amountDue,
                amountPaid,
                payableAmount,
                paymentDate: paymentDate.toISOString(),
                remarks,
                lateFees,
            };

            if (feeId) {
                await updateDoc(doc(firestore, 'feeStatus', feeId), feeData);
            } else {
                await addDoc(collection(firestore, 'feeStatus'), feeData);
            }

            console.log('Fee status saved:', feeData);
            navigation.goBack();
        } catch (error) {
            console.error('Error saving fee status:', error);
            setError('Error saving fee status');
        }
    };

    const handleDelete = async () => {
        try {
            await deleteDoc(doc(firestore, 'feeStatus', feeId));
            console.log('Fee status deleted');
            navigation.goBack();
        } catch (error) {
            console.error('Error deleting fee status:', error);
            setError('Error deleting fee status');
        }
    };

    return (
        <PaperProvider>
            <View style={styles.container}>
                <Text style={styles.header}>Manage Fee Status</Text>
                <TextInput
                    label="Registration"
                    value={registration}
                    onChangeText={text => setRegistration(text)}
                    style={styles.input}
                    editable={!feeId}
                />
                <TextInput
                    label="Student Name"
                    value={studentName}
                    onChangeText={text => setStudentName(text)}
                    style={styles.input}
                />
                <TextInput
                    label="Amount Due"
                    value={amountDue}
                    onChangeText={text => setAmountDue(text)}
                    style={styles.input}
                    keyboardType="numeric"
                />
                <TextInput
                    label="Amount Paid"
                    value={amountPaid}
                    onChangeText={text => setAmountPaid(text)}
                    style={styles.input}
                    keyboardType="numeric"
                />
                <TextInput
                    label="Payable Amount"
                    value={payableAmount}
                    onChangeText={text => setPayableAmount(text)}
                    style={styles.input}
                    keyboardType="numeric"
                />
                <MyDatePicker
                    label="Payment Date"
                    date={paymentDate}
                    onChange={date => setPaymentDate(date)}
                />
                <TextInput
                    label="Remarks"
                    value={remarks}
                    onChangeText={text => setRemarks(text)}
                    style={styles.input}
                />
                <Button mode="contained" onPress={handleSave} style={styles.saveButton}>
                    Save
                </Button>
                {feeId && (
                    <Button mode="contained" onPress={handleDelete} style={[styles.saveButton, styles.deleteButton]}>
                        Delete
                    </Button>
                )}
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
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
    input: {
        marginBottom: 15,
        backgroundColor: '#E2E2E2',
    },
    saveButton: {
        marginTop: 20,
        backgroundColor: '#475D8C',
        borderRadius: 15,
    },
    deleteButton: {
        marginTop: 10,
        backgroundColor: '#FF6347',
    },
    errorText: {
        color: 'red',
        marginTop: 10,
        textAlign: 'center',
    },
});

export default ManageFeeStatus;