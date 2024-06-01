//Javeria
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, Alert } from 'react-native';
import {Button} from 'react-native-paper';
import { collection, getDocs, limit, orderBy ,query} from 'firebase/firestore';
import { firestore } from '../firebaseConfig';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import pdf from 'react-native-pdf';
// import RNFS from 'react-native-fs';

const ViewReportsScreen = () => {
  const[pdfPath, setPdfPath] = useState(null);
  const[isLoading, setIsLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [boysCount, setBoysCount] = useState(0);
  const [girlsCount, setGirlsCount] = useState(0);
  const studentsList = [];

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const q = query(collection(firestore, 'students'), orderBy('registrationNumber'), limit(15));
        const querySnapshot = await getDocs(q);
      
        let boys = 0;
        let girls = 0;

        querySnapshot.forEach((doc) => {
          const student = doc.data();
         
          student.dateOfBirth= doc.data().dateOfBirth.toDate(); // Convert Firestore Timestamp to JavaScript Date
          student.dateOfAdmission= doc.data().dateOfAdmission.toDate(); // Convert Firestore Timestamp to JavaScript Date
          const age = calculateAge(student.dateOfBirth);
          student.age = age;
          studentsList.push(student);
          if (student.gender === 'male') boys += 1;
          if (student.gender === 'female') girls += 1;
        });

        setStudents(studentsList);
        setBoysCount(boys);
        setGirlsCount(girls);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, []);

  const calculateAge = (dob) => {
    const now = new Date();
    const birth = new Date(dob);
    const years = now.getFullYear() - birth.getFullYear();
    const months = now.getMonth() - birth.getMonth();
    return { years, months: months >= 0 ? months : months + 12 };
  };

  const generatePDF = async () => {
    const htmlContent = `
      <html>
      <head>
        <style>
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            border: 1px solid black;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
          }
        </style>
      </head>
      <body>
        <h2>Student Age Report</h2>
        <table>
          <tr>
            <th>Reg No</th>
            <th>Name</th>
            <th>Father Name</th>
            <th>DOB</th>
            <th>Age (Years & Months)</th>
          </tr>
          ${students.map(student => `
            <tr>
              <td>${student.registrationNumber}</td>
              <td>${student.name}</td>
              <td>${student.fatherName}</td>
              <td>${student.dateOfBirth.toDateString()}</td>
              <td>${student.age.years}y ${student.age.months}m</td>
            </tr>
          `).join('')}
        </table>
        <p>Total Boys: ${boysCount}</p>
        <p>Total Girls: ${girlsCount}</p>
      </body>
      </html>
    `;

    const options = {
      html: htmlContent,
      fileName: 'Student_Age_Report',
      directory: 'Documents',
    };

    try {
      const file = await RNHTMLtoPDF.convert(options);
      Alert.alert('PDF saved', `PDF saved to ${file.filePath}`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };



  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Student Age Report</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <Text style={styles.cellHeader}>Reg No</Text>
          <Text style={styles.cellHeader}>Name</Text>
          <Text style={styles.cellHeader}>Father Name</Text>
          <Text style={styles.cellHeader}>DOB</Text>
          <Text style={styles.cellHeader}>Age</Text>
        </View>
      
        {students.map((student, index) => (
          <View key={index} style={styles.row}>
            <Text style={styles.cell}>{student.registrationNumber}</Text>
            <Text style={styles.cell}>{student.name}</Text>
            <Text style={styles.cell}>{student.fatherName}</Text>
            <Text style={styles.cell}>{student.dateOfBirth.toDateString()}</Text>
            <Text style={styles.cell}>{student.age.years}y {student.age.months}m</Text>
          </View>
        ))}
      </View>
      <Text style={styles.summary}>Total Boys: {boysCount}</Text>
      <Text style={styles.summary}>Total Girls: {girlsCount}</Text>
      <Button mode="contained" style={styles.button} onPress={generatePDF}>Download PDF</Button> 
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  table: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cellHeader: {
    flex: 1,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  cell: {
    flex: 1,
    fontSize: 10,
    textAlign: 'center',
    color: '#333',
  },
  summary: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
  },
  button:{
    backgroundColor:'#475D8C',
   
  }
});

export default ViewReportsScreen;
