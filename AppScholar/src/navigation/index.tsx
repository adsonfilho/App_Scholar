import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Login } from '../screens/Login';
import { Dashboard } from '../screens/Dashboard';
import { StudentList } from '../screens/StudentList'
import { RegisterStudent } from '../screens/RegisterStudent';
import { RegisterTeacher } from '../screens/RegisterProfessor';
import { TeacherList } from '../screens/TeacherList';
import { CourseList } from '../screens/CourseList';
import { RegisterCourse } from '../screens/RegisterCourse';
import { StudentReport } from '../screens/StudentReport';

const Stack = createStackNavigator();

export const AppRoutes = () => {
  return (
    <Stack.Navigator 
      initialRouteName="Login" 
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="Student" component={StudentList} />
      <Stack.Screen name="RegisterStudent" component={RegisterStudent} />
      <Stack.Screen name="RegisterTeacher" component={RegisterTeacher} />
      <Stack.Screen name="Teacher" component={TeacherList} />
      <Stack.Screen name="Course" component={CourseList} />
      <Stack.Screen name="RegisterCourse" component={RegisterCourse} />
      <Stack.Screen name="StudentReport" component={StudentReport} />
    </Stack.Navigator>
  );
};