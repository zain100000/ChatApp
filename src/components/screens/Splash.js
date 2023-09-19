import React, {useEffect} from 'react';
import {Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import '../../../FirebaseConfig';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const Splash = () => {
  const navigation = useNavigation();

  useEffect(() => {
    setTimeout(() => {
      const unsubscribe = auth().onAuthStateChanged(async user => {
        if (user) {
          const userRef = firestore().collection('users').doc(user.uid);
          const userDoc = await userRef.get();
          if (userDoc.exists) {
            const {role} = userDoc.data();
            switch (role) {
              case 'User':
                navigation.navigate('Home');
                break;
              default:
                console.log('Invalid department');
            }
          } else {
            console.log('User document not found');
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
