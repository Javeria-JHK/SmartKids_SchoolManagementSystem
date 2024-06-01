import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainLoginScreen from './Screens/MainLoginScreen';
import AdminLoginScreen from './Screens/AdminLoginScreen';
import AdminDashboard from './Screens/AdminDashboard';
import ManageStudents from './Screens/ManageStudents';
import ManageFeeStatus from './Screens/ManageFeeStatus';
import ManageTeachers from './Screens/ManageTeachers';
import GenerateReports from './Screens/GenerateReports';
import ManageMarks from './Screens/ManageMarks';
import StudentLoginScreen from './Screens/StudentLoginScreen';
import StudentPortal from './Screens/StudentPortal';
import ViewMarks from './Screens/ViewMarks';
import ViewFeeStatus from './Screens/ViewFeeStatus';
import ViewTimetable from './Screens/ViewTimetable';
import ViewSyllabus from './Screens/ViewSyllabus';
import ManageTimetable from './Screens/ManageTimetable';
import ManageSyllabus from './Screens/ManageSyllabus';

import TeacherLoginScreen from './src/Teacher/Screens/TeacherLoginScreen';
import HomeScreen from './src/Teacher/Screens/HomeScreen'; 
import StudentDetailScreen from './src/Teacher/Screens/StudentDetailScreen';
import AddMarksScreen from './src/Teacher/Screens/AddMarksScreen';
import 'react-native-gesture-handler';
import EditMarksScreen from './src/Teacher/Screens/EditMarksScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MainLoginScreen">
        <Stack.Screen name="MainLogin" component={MainLoginScreen} options={{ headerShown: false }}  />
        <Stack.Screen name="AdminLoginScreen" component={AdminLoginScreen} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} options={{ headerShown: false }} />
        <Stack.Screen name="ManageStudents" component={ManageStudents} />
        <Stack.Screen name="ManageFeeStatus" component={ManageFeeStatus} />
        <Stack.Screen name="ManageTeachers" component={ManageTeachers} />
        <Stack.Screen name="GenerateReports" component={GenerateReports} />
        <Stack.Screen name="ManageMarks" component={ManageMarks} />
        <Stack.Screen name="ManageTimetable" component={ManageTimetable} />
        <Stack.Screen name="ManageSyllabus" component={ManageSyllabus} />
        <Stack.Screen name="StudentLoginScreen" component={StudentLoginScreen} />
        <Stack.Screen name="StudentPortal" component={StudentPortal} />
        <Stack.Screen name="ViewMarks" component={ViewMarks} />
        <Stack.Screen name="ViewFeeStatus" component={ViewFeeStatus} />
        <Stack.Screen name="ViewTimetable" component={ViewTimetable} />
        <Stack.Screen name="ViewSyllabus" component={ViewSyllabus} />

        <Stack.Screen name="TeacherLoginScreen" component={TeacherLoginScreen}  />
        <Stack.Screen name="Home" component={HomeScreen}
                      options={{
                     title: 'Students',                     
                     headerStyle: { backgroundColor: '#475D8C' },
                     headerTintColor: '#fff', 
                     cardStyle: { backgroundColor: '#f3e5f5' } 
                   }}  />
         <Stack.Screen 
           name="StudentDetail" 
           component={StudentDetailScreen} 
           options={{ title: 'Student Marks' }} 
         />
              <Stack.Screen name="AddMarksScreen" component={AddMarksScreen} />
       <Stack.Screen name="EditMarksScreen" component={EditMarksScreen} />
       </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;





// // App.js
// import * as React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import TeacherLoginScreen from './src/Teacher/Screens/TeacherLoginScreen';
// import HomeScreen from './src/Teacher/Screens/HomeScreen'; 
// import StudentDetailScreen from './src/Teacher/Screens/StudentDetailScreen';
// import AddMarksScreen from './src/Teacher/Screens/AddMarksScreen';
// import 'react-native-gesture-handler';
// import EditMarksScreen from './src/Teacher/Screens/EditMarksScreen';

// const Stack = createStackNavigator();

// export default function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="TeacherLogin">
//         <Stack.Screen name="TeacherLogin" component={TeacherLoginScreen} options={{ headerShown: false }}  />
//         <Stack.Screen name="Home" component={HomeScreen} 
//                   options={{
//                     title: 'Students',
//                     headerStyle: { backgroundColor: '#475D8C' },
//                     headerTintColor: '#fff', 
//                     cardStyle: { backgroundColor: '#f3e5f5' } 
//                   }}  />
//         <Stack.Screen 
//           name="StudentDetail" 
//           component={StudentDetailScreen} 
//           options={{ title: 'Student Marks' }} 
//         />
//               <Stack.Screen name="AddMarksScreen" component={AddMarksScreen} />
//       <Stack.Screen name="EditMarksScreen" component={EditMarksScreen} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }
