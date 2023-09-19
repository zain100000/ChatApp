import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import '../../../FirebaseConfig';
import auth from '@react-native-firebase/auth';
import Profile from '../screens/Profile';
import Users from '../screens/Users';

const Tab = createBottomTabNavigator();

const BottomNavigator = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await auth().signOut();
      alert('Logout Successfully');
      navigation.navigate('Login');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,

        headerRight: () => (
          <View className="px-3">
            <TouchableOpacity onPress={handleLogout}>
              <MaterialCommunityIcons name="logout" size={28} color="#f57c00" />
            </TouchableOpacity>
          </View>
        ),

        headerStyle: {
          height: 80,
          backgroundColor: '#fff',
          elevation: 25,
          shadowRadius: 3,
          shadowColor: '#000',
        },
        tabBarStyle: {
          backgroundColor: '#f57c00',
          height: 60,
        },
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: 'grey',
        tabBarLabelStyle: {paddingBottom: 5, fontSize: 15, fontWeight: '600'},
      }}>
      <Tab.Screen
        name="Users"
        component={Users}
        options={{
          tabBarLabel: 'Users',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons
              name="account-group-outline"
              color={color}
              size={30}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons
              name="account-circle-outline"
              color={color}
              size={30}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomNavigator;
