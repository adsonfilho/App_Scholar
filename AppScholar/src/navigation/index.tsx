import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Login } from '../screens/Login';
import { Dashboard } from '../screens/Dashboard';
import { StudentList } from '../screens/StudentList'
import { RegisterStudent } from '../screens/RegisterStudent';


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
    </Stack.Navigator>
  );
};