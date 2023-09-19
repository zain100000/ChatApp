import React, {useState} from 'react';
import {
  ScrollView,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {Picker} from '@react-native-picker/picker';
import ImagePicker from 'react-native-image-crop-picker';
import imgPlaceHolder from '../../assets/avatar.png';
import '../../../FirebaseConfig';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

const Signup = () => {
  const navigation = useNavigation();
  const [fullname, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    try {
      setLoading(true);
      const authCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      const user = authCredential.user;
      const userRef = firestore().collection('users').doc(user.uid);
      const imageRef = storage().ref().child(`users/${user.uid}/`);
      const imageBlob = await fetch(image.path).then(response =>
        response.blob(),
      );
      await imageRef.put(imageBlob);
      const imageUrl = await imageRef.getDownloadURL();
      // Include UID in the user document
      await userRef.set({
        uid: user.uid,
        role,
        imageUrl,
        fullname,
        email,
      });
      navigation.navigate('Login');
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePickImage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
    }).then(image => {
      setImage(image);
    });
  };

  const handleRoleChange = value => {
    setRole(value);
  };

  return (
    <SafeAreaView className="flex-1">
      <ScrollView>
        <View className="flex-1 items-center mt-10">
          <Text className="text-secondary text-4xl mb-5 font-bold">Signup</Text>
          <Text className="text-secondary text-1xl font-semibold">
            Please provide all required details to register
          </Text>
        </View>

        {/* Image */}
        <View className="justify-center items-center mt-5">
          {image ? (
            <Image
              source={{uri: image.path}}
              className="w-24 h-24 rounded-full"
            />
          ) : (
            <Image source={imgPlaceHolder} className="w-24 h-24 rounded-full" />
          )}
          <TouchableOpacity onPress={handlePickImage}>
            <Text className="text-secondary text-xl mt-3">Select Image</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-1 items-center mt-8">
          {/* Form Start */}

          <View className="flex-1 w-full px-5">
            <View className="flex-row rounded-xl shadow-md p-4">
              <View className="mt-3">
                <MaterialCommunityIcons
                  name="account-outline"
                  size={26}
                  color={'#f57c00'}
                />
              </View>
              <TextInput
                className="px-5 text-black text-base"
                placeholder="Enter Your Name"
                placeholderTextColor={'#9400FF'}
                value={fullname}
                onChangeText={text => setFullName(text)}
              />
            </View>
          </View>

          <View className="flex-1 mt-5 w-full px-5">
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
                keyboardType="email-address"
                textContentType="emailAddress"
                autoFocus={true}
                value={email}
                onChangeText={text => setEmail(text)}
              />
            </View>

            <View className="flex-row mb-5 rounded-xl shadow-md p-4">
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
                autoCorrect={false}
                secureTextEntry={true}
                textContentType="password"
                value={password}
                onChangeText={text => setPassword(text)}
              />
            </View>

            <View
              className="mb-5 rounded-xl shadow-md p-4 
            ">
              <Picker selectedValue={role} onValueChange={handleRoleChange}>
                <Picker.Item
                  label="Select Role"
                  value=""
                  className="text-white"
                />
                <Picker.Item label="User" value="User" />
              </Picker>
            </View>

            {/* Button Start */}

            <TouchableOpacity
              className="flex-1 justify-center items-center"
              onPress={handleSignup}>
              <View className="w-full items-center mt-5 mb-2 p-4 bg-secondary rounded-lg">
                {loading ? (
                  <ActivityIndicator color={'#9400FF'} />
                ) : (
                  <Text className="text-white text-[20px] font-medium">
                    Signup
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-row items-center justify-around mt-5 mb-2">
          <Text className="text-[16px] text-primary font-bold">
            Already have an account?
          </Text>

          <TouchableOpacity
            className="rounded-lg px-8 py-3 bg-dark shadow-md"
            onPress={() => navigation.navigate('Login')}>
            <Text className="text-white text-lg">Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Signup;
