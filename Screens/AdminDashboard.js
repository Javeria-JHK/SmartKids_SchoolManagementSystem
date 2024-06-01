//Javeria
import React, { useState, useEffect, useMemo, useRef ,useCallback } from 'react';
import {
View, ScrollView, FlatList, TouchableOpacity, StyleSheet, StatusBar, Text, DrawerLayoutAndroid,
} from 'react-native';
import { collection, getDocs, query, limit, orderBy } from 'firebase/firestore';
import { firestore, auth } from '../firebaseConfig';
import { useNavigation ,useFocusEffect } from '@react-navigation/native';
import { Searchbar, Drawer, Button, Appbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AdminDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [active, setActive] = useState('Dashboard');
  const drawer = useRef(null);
  const navigation = useNavigation();
  const drawerRef = useRef(null);


  useFocusEffect(
    useCallback(() => {
      setActive(null); // Reset active state when this screen is focused
    
    }, [])
  );

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const q = query(collection(firestore, 'students'),orderBy('registrationNumber'));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          console.log('No matching documents.');
          return;
        }

        const studentsList = querySnapshot.docs.map(docSnapshot => ({
          id: docSnapshot.id,
          ...docSnapshot.data()
        }));

        console.log(`Fetched ${studentsList.length} students`);
        setStudents(studentsList);
        setFilteredStudents(studentsList);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, []);

  const filteredData = useMemo(() => students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
    || student.registrationNumber.toString().includes(searchQuery)), [searchQuery, students]);
  

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.row}
      onPress={() => navigation.navigate('ManageStudents', { student: {
        ...item,
    
        class: item.class.id, // Only the class ID
     
       }})}
    >
      <Text style={styles.cell}>{index + 1}</Text>
      <Text style={styles.cell}>{item.name}</Text>
      <Text style={styles.cell}>{item.registrationNumber}</Text>
      <Text style={styles.cell}>{item.fatherName}</Text>
    </TouchableOpacity>
  );

  const handleLogout = () => {
    auth.signOut().then(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainLogin' }],
      });
    }).catch(error => {
      Alert.alert('Error', error.message);
    });
  };

  const drawerContent = () => (
    <View style={{ flex: 1, padding: 20 }}>
      <Drawer.Section title="Dashboard">
        <Drawer.Item
          label="Manage Students"
          active={active === 'Manage Students'}
          onPress={() => {
            setActive('Manage Students');
            
            navigation.navigate('ManageStudents');
          }}
        />
        <Drawer.Item
          label="Manage Teachers"
          active={active === 'Manage Teachers'}
          onPress={() => {
            setActive('Manage Teachers');
            
            navigation.navigate('ManageTeachers');
          }}
        />
        <Drawer.Item
          label="Reports"
          active={active === 'Reports'}
          onPress={() => {
            setActive('Reports');
            
            navigation.navigate('GenerateReports');
          }}
        />
        <Drawer.Item
          label="Time Table"
          active={active === 'Time Table'}
          onPress={() => {
            setActive('Time Table');
            
            navigation.navigate('ManageTimetable');
          }}
        />
        <Drawer.Item
          label="Syllabus"
          active={active === 'Syllabus'}
          onPress={() => {
         
            navigation.navigate('ManageSyllabus');
          }}
        />
        <Drawer.Item
          label="Manage Fee"
          active={active === 'Manage Fee'}
          onPress={() => {
            setActive('Manage Fee');
          
            navigation.navigate('ManageFeeStatus');
          }}
        />
        <Drawer.Item
          label="Logout"
          active={active === 'Logout'}
          onPress={handleLogout}
          style={styles.logout}
        />
      </Drawer.Section>
    </View>
  );

  return (
    <DrawerLayoutAndroid
      ref={drawer}
      drawerWidth={300}
      drawerPosition="left"
      renderNavigationView={drawerContent}
    >
      <View style={{ flex: 1 }}>
        <Appbar.Header>
          <Appbar.Action icon="menu" onPress={() => drawer.current.openDrawer()} />
          <Appbar.Content title="Admin Dashboard" />
        </Appbar.Header>
        <StatusBar backgroundColor="#475D8C" barStyle="light-content" />

        <View style={{margin:15}}>
          

          <Searchbar
            placeholder="Search"
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={[styles.searchbar, styles.shadow]}
          />
          <TouchableOpacity style={[styles.addButton, active === 'Manage Students' ? styles.activeButton : null]} 
           onPress={() => navigation.navigate('ManageStudents')}>
          <Icon name="add" size={24} color="#111C2E" />
          </TouchableOpacity>
          <Text style={styles.title}>Students Details</Text>
          <View  style={{  marginBottom:300}} >
          <View style={styles.table}>
            <View style={styles.headerRow}>
              <Text style={styles.headerCell}>S.No</Text>
              <Text style={styles.headerCell}>Name</Text>
              <Text style={styles.headerCell}>Roll Number</Text>
              <Text style={styles.headerCell}>Father Name</Text>
            </View>
            <FlatList
              data={filteredData}
              renderItem={renderItem}
              keyExtractor={item => item.id}
            />
            
          </View>
          <Text style={{height:100}}></Text>
          </View>
        </View>

      </View>
    </DrawerLayoutAndroid>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    marginTop:25,
    alignSelf:'center'
  },
  logout:{
    borderRadius: 15,
    color: '#6C85A6',
    backgroundColor: '#C7CFD9',
    
   
    height:50

  },
  searchbar: {
    backgroundColor: '#E2E2E2',
    borderRadius: 20,
    marginBottom: 15,
  
  },
  table: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    marginTop:10,
  
  
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#6C85A6',
    paddingVertical: 10,
  },
  headerCell: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cell: {
    flex: 1,
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 15,
    color: '#6C85A6',
    backgroundColor: '#C7CFD9',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginRight:10
  },
  activeButton: {
    backgroundColor: '#6C85A6',
    borderColor: '#475D8C',
    borderWidth: 1,
  },
  drawerToggle: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1000,
  },
  drawerToggleText: {
    fontSize: 24,
    marginTop:-10
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold'
  },
});

export default AdminDashboard;
