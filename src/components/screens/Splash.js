import React, {useEffect} from 'react';
import {Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import '../../../FirebaseConfig';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

const Splash = () => {
  const navigation = useNavigation();

  useEffect(() => {
    setTimeout(() => {
      const unsubscribe = auth().onAuthStateChanged(async user => {
        if (user) {
          // Fetch user data from Firebase Realtime Database
          const userSnapshot = await database()
            .ref(`users/${user.uid}`)
            .once('value');
          const userData = userSnapshot.val();

          if (userData) {
            const {role} = userData;
            switch (role) {
              case 'User':
                navigation.navigate('Home');
                break;
              default:
                console.log('Invalid department');
            }
          } else {
            console.log('User data not found in Realtime Database');
          }
        } else {
          navigation.navigate('Login');
        }
      });
      return unsubscribe;
    }, 2000);
  }, []);

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-secondary font-bold text-3xl">
        Firebase Chat App
      </Text>
    </View>
  );
};

export default Splash;
