import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../contexts/AuthContext';

import { Login } from '../screens/Login';
import { Dashboard } from '../screens/Dashboard';
import { StudentList } from '../screens/StudentList';
import { RegisterStudent } from '../screens/RegisterStudent';
import { RegisterTeacher } from '../screens/RegisterProfessor';
import { TeacherList } from '../screens/TeacherList';
import { CourseList } from '../screens/CourseList';
import { RegisterCourse } from '../screens/RegisterCourse';
import { StudentReport } from '../screens/StudentReport';
import { RegisterInvitation } from '../screens/RegisterInvitation';

const Stack = createStackNavigator();

export const AppRoutes = () => {
  const { signed, user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!signed ? (
        <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="RegisterStudent" component={RegisterStudent} />
          <Stack.Screen name="RegisterTeacher" component={RegisterTeacher} />
        </>
      ) : (
        <>
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="StudentReport" component={StudentReport} />

          {user?.role !== 'STUDENT' && (
            <>
              <Stack.Screen name="Student" component={StudentList} />
              <Stack.Screen name="RegisterStudent" component={RegisterStudent} />
              <Stack.Screen name="Teacher" component={TeacherList} />
              <Stack.Screen name="RegisterTeacher" component={RegisterTeacher} />
              <Stack.Screen name="Course" component={CourseList} />
              <Stack.Screen name="RegisterCourse" component={RegisterCourse} />
            </>
          )}

          {user?.role === 'ADMIN' && (
            <Stack.Screen name="RegisterInvitation" component={RegisterInvitation} />
          )}
        </>
      )}
    </Stack.Navigator>
  );
};