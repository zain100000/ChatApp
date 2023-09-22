import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import '../../../FirebaseConfig';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const authCredential = await auth().signInWithEmailAndPassword(
        email,
        password,
      );
      const user = authCredential.user;

      // Fetch user data from Firebase Realtime Database
      const userSnapshot = await database()
        .ref(`users/${user.uid}`)
        .once('value');
      const userData = userSnapshot.val();

      if (userData) {
        const role = userData.role;
        if (role === 'User') {
          navigation.navigate('Home');
        }
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 justify-center mt-28">
      <ScrollView>
        <View className="items-center">
          <Text className="text-secondary text-4xl mb-5 font-bold">Login</Text>
          <Text className="text-secondary text-1xl font-semibold mb-10">
            Please Login to continue!
          </Text>
        </View>

        <View className="flex-1 items-center">
          {/* Form */}
          <View className="flex-1 w-full px-5">
            <View className="flex-row mb-5 rounded-xl shadow-md p-4">
              <View className="translate-y-3 translate-x-2">
                <MaterialCommunityIcons
                  name="email-outline"
                  size={26}
                  color={'#f57c00'}
                />
              </View>
              <TextInput
                className=" text-base translate-x-5 text-black"
                placeholder="Your Email"
                placeholderTextColor={'#9400FF'}
                value={email}
                onChangeText={text => setEmail(text)}
              />
            </View>

            <View className="flex-row rounded-xl shadow-md p-4">
              <View className="translate-y-3 translate-x-2">
                <MaterialCommunityIcons
                  name="lock-outline"
                  size={26}
                  color={'#f57c00'}
                />
              </View>
              <TextInput
                className="text-base translate-x-5 text-black"
                placeholder="Your Password"
                placeholderTextColor={'#9400FF'}
                secureTextEntry={true}
                value={password}
                onChangeText={text => setPassword(text)}
              />
            </View>

            {/* Button */}
            <TouchableOpacity
              className="justify-center items-center mt-[40px]"
              onPress={handleLogin}>
              <View className="w-full items-center p-4 bg-secondary rounded-lg">
                {loading ? (
                  <ActivityIndicator color={'#9400FF'} />
                ) : (
                  <Text className="text-white text-[20px] font-medium">
                    Login
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-row justify-around items-center mt-8">
          <Text className="text-[16px] text-primary font-bold">
            Didn't have an account?
          </Text>

          <TouchableOpacity
            className="rounded-lg px-8 py-3 bg-dark shadow-md"
            onPress={() => navigation.navigate('Signup')}>
            <Text className="text-white text-lg">Signup</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;
