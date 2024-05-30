import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { db } from '../firebaseConfig';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';

const ManageFeeStatus = () => {
    const [students, setStudents] = useState([]);
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [feeStatus, setFeeStatus] = useState({
        registrationNumber: '',
        name: '',
        amountDue: '',
        amountPaid: '',
        payableAmount: '',
        paymentDate: '',
        lateFees: 'No',
        remarks: '',
    });

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'students'), snapshot => {
            const studentsList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setStudents(studentsList);
        });
        return unsubscribe;
    }, []);

    const handleUpdateFeeStatus = async () => {
        if (!selectedStudentId) {
            Alert.alert('Please select a student.');
            return;
        }

        try {
            const studentDocRef = doc(db, 'students', selectedStudentId);
            await updateDoc(studentDocRef, { feeStatus });
            Alert.alert('Fee status updated successfully!');
            setFeeStatus({
                registrationNumber: '',
                name: '',
                amountDue: '',
                amountPaid: '',
                payableAmount: '',
                paymentDate: '',
                lateFees: 'No',
                remarks: '',
            });
            setSelectedStudentId('');
        } catch (error) {
            Alert.alert(error.message);
        }
    };

    const handleDeleteFeeStatus = async (studentId) => {
        try {
            const studentDocRef = doc(db, 'students', studentId);
            await updateDoc(studentDocRef, { feeStatus: null });
            Alert.alert('Fee status deleted successfully!');
        } catch (error) {
            Alert.alert('Error deleting fee status: ' + error.message);
        }
    };

    const handleEditFeeStatus = (studentId) => {
        const student = students.find(student => student.id === studentId);
        setFeeStatus({
            registrationNumber: student.registrationNumber,
            name: student.name,
            amountDue: student.feeStatus?.amountDue || '',
            amountPaid: student.feeStatus?.amountPaid || '',
            payableAmount: student.feeStatus?.payableAmount || '',
            paymentDate: student.feeStatus?.paymentDate || '',
            lateFees: student.feeStatus?.lateFees || 'No',
            remarks: student.feeStatus?.remarks || '',
        });
        setSelectedStudentId(studentId);
    };

    const handleViewFeeStatus = (student) => {
        Alert.alert('Fee Status', `Registration Number: ${student.registrationNumber}\nName: ${student.name}\nAmount Due: ${student.feeStatus?.amountDue || 'N/A'}\nAmount Paid: ${student.feeStatus?.amountPaid || 'N/A'}\nPayable Amount: ${student.feeStatus?.payableAmount || 'N/A'}\nPayment Date: ${student.feeStatus?.paymentDate || 'N/A'}\nLate Fees: ${student.feeStatus?.lateFees || 'N/A'}\nRemarks: ${student.feeStatus?.remarks || 'N/A'}`);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Manage Fee Status</Text>
            <ScrollView>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Select Registration Number</Text>
                    <Picker
                        selectedValue={selectedStudentId}
                        onValueChange={(itemValue) => {
                            setSelectedStudentId(itemValue);
                            const selectedStudent = students.find(student => student.id === itemValue);
                            if (selectedStudent) {
                                setFeeStatus({
                                    registrationNumber: selectedStudent.registrationNumber,
                                    name: selectedStudent.name,
                                    amountDue: selectedStudent.feeStatus?.amountDue || '',
                                    amountPaid: selectedStudent.feeStatus?.amountPaid || '',
                                    payableAmount: selectedStudent.feeStatus?.payableAmount || '',
                                    paymentDate: selectedStudent.feeStatus?.paymentDate || '',
                                    lateFees: selectedStudent.feeStatus?.lateFees || 'No',
                                    remarks: selectedStudent.feeStatus?.remarks || '',
                                });
                            }
                        }}
                    >
                        <Picker.Item label="Select Registration Number" value="" />
                        {students.map((student) => (
                            <Picker.Item key={student.id} label={`${student.registrationNumber} - ${student.name}`} value={student.id} />
                        ))}
                    </Picker>
                </View>
                <TextInput style={styles.input}
                    placeholder="Registration Number"
                    value={feeStatus.registrationNumber.toString()}
                    onChangeText={(text) => setFeeStatus({ ...feeStatus, registrationNumber: text })}
                    keyboardType="numeric"
                    editable={false} // Disable input for registration number
                />
                <TextInput
                    style={styles.input}
                    placeholder="Student Name"
                    value={feeStatus.name}
                    onChangeText={(text) => setFeeStatus({ ...feeStatus, name: text })}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Amount Due"
                    value={feeStatus.amountDue}
                    onChangeText={(text) => setFeeStatus({ ...feeStatus, amountDue: text })}
                    keyboardType="numeric"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Amount Paid"
                    value={feeStatus.amountPaid}
                    onChangeText={(text) => setFeeStatus({ ...feeStatus, amountPaid: text })}
                    keyboardType="numeric"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Payable Amount"
                    value={feeStatus.payableAmount}
                    onChangeText={(text) => setFeeStatus({ ...feeStatus, payableAmount: text })}
                    keyboardType="numeric"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Payment Date"
                    value={feeStatus.paymentDate}
                    onChangeText={(text) => setFeeStatus({ ...feeStatus, paymentDate: text })}
                />
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Late Fees</Text>
                    <View style={styles.inputWrapper}>
                        <Picker
                            style={styles.picker}
                            selectedValue={feeStatus.lateFees}
                            onValueChange={(itemValue) => setFeeStatus({ ...feeStatus, lateFees: itemValue })}
                        >
                            <Picker.Item label="No" value="No" />
                            <Picker.Item label="Yes" value="Yes" />
                        </Picker>
                    </View>
                </View>

                <TextInput
                    style={styles.input}
                    placeholder="Remarks"
                    value={feeStatus.remarks}
                    onChangeText={(text) => setFeeStatus({ ...feeStatus, remarks: text })}
                />
                <Button title="Update Fee Status" onPress={handleUpdateFeeStatus} />
            </ScrollView>

            <FlatList
                data={students}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.studentItem}>
                        <View style={styles.studentInfo}>
                            <Text>Registration Number: {item.registrationNumber}</Text>
                            <Text>Name: {item.name}</Text>
                            <Text>Amount Due: {item.feeStatus?.amountDue || 'N/A'}</Text>
                            <Text>Amount Paid: {item.feeStatus?.amountPaid || 'N/A'}</Text>
                            <Text>Payable Amount: {item.feeStatus?.payableAmount || 'N/A'}</Text>
                            <Text>Payment Date: {item.feeStatus?.paymentDate || 'N/A'}</Text>
                            <Text>Late Fees: {item.feeStatus?.lateFees || 'N/A'}</Text>
                            <Text>Remarks: {item.feeStatus?.remarks || 'N/A'}</Text>
                        </View>
                        <View style={styles.buttonContainer}>
                            <Button title="View" onPress={() => handleViewFeeStatus(item)} />
                            <Button title="Edit" onPress={() => handleEditFeeStatus(item.id)} />
                            <Button title="Delete" onPress={() => handleDeleteFeeStatus(item.id)} />
                        </View>
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
    inputContainer: {
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    inputWrapper: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    picker: {
        flex: 1,
    },
    studentItem: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    studentInfo: {
        flex: 1,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
});

export default ManageFeeStatus;
