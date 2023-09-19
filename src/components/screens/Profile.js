import React, {useState, useEffect} from 'react';
import {
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import imgPlaceHolder from '../../assets/avatar.png';
import ImagePicker from 'react-native-image-crop-picker';
import '../../../FirebaseConfig';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Profile = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [fullname, setFullName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const authInstance = auth();

  const handleFullName = value => {
    setFullName(value);
  };

  const handleDescription = value => {
    setDescription(value);
  };

  const handlePickImage = async () => {
    try {
      // If there is an existing image, delete it first
      if (imageUrl) {
        const user = authInstance.currentUser;
        if (user) {
          const imageRef = storage().ref(`users/${user.uid}/`);
          await imageRef.delete();
        }
      }

      // Pick and upload the new image
      const image = await ImagePicker.openPicker({
        width: 400,
        height: 400,
        cropping: true,
      });

      setImageUrl(image.path);

      const user = authInstance.currentUser;
      if (user) {
        const imageRef = storage().ref(`users/${user.uid}/image.jpg`);
        await imageRef.putFile(image.path);
      }
    } catch (error) {
      alert('Error picking/updating image: ' + error);
    }
  };

  const handleUpdatePersonal = async () => {
    const user = authInstance.currentUser;
    try {
      setLoading(true);
      // Update the Firestore document with the new values
      await firestore().collection('users').doc(user.uid).update({
        imageUrl,
        fullname,
        description,
      });

      alert('Personal information updated successfully!');
    } catch (error) {
      alert('Error updating personal information: ' + error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const user = authInstance.currentUser;
      if (user) {
        try {
          const userDoc = await firestore()
            .collection('users')
            .doc(user.uid)
            .get();

          if (userDoc.exists) {
            const userData = userDoc.data();
            setFullName(userData.fullname);
            setDescription(userData.description);
            setImageUrl(userData.imageUrl);
          }
        } catch (error) {
          alert('Error while fetching user data: ' + error);
        }
      }
    };

    fetchUser();
  }, []);

  return (
    <View className="flex-1 translate-y-28">
      {/* Image */}
      <View className="justify-center items-center mb-5">
        <TouchableOpacity onPress={handlePickImage}>
          {imageUrl ? (
            <Image
              source={{uri: imageUrl}}
              className="w-24 h-24 rounded-full"
            />
          ) : (
            <Image source={imgPlaceHolder} className="w-24 h-24 rounded-full" />
          )}
        </TouchableOpacity>
      </View>

      <View className="w-full px-5">
        <View className="flex-row rounded-xl shadow-md p-3">
          <View className="mt-3">
            <MaterialCommunityIcons
              name="account-outline"
              size={26}
              color={'#f57c00'}
            />
          </View>
          <TextInput
            className="px-5 text-black text-base"
            placeholder="Your Name"
            placeholderTextColor={'#9400FF'}
            value={fullname}
            onChangeText={handleFullName}
          />
        </View>
      </View>

      <View className="w-full px-5">
        <View className="flex-row rounded-xl shadow-md p-3">
          <View className="mt-3">
            <MaterialCommunityIcons
              name="alert-circle-outline"
              size={26}
              color={'#f57c00'}
            />
          </View>
          <TextInput
            className="px-5 text-black text-base"
            placeholder="Description"
            placeholderTextColor={'#9400FF'}
            value={description}
            onChangeText={handleDescription}
          />
        </View>
      </View>

      <TouchableOpacity
        className="justify-center items-center"
        onPress={handleUpdatePersonal}>
        <View className="w-80 items-center mt-5 mb-2 p-4 bg-secondary rounded-lg">
          {loading ? (
            <ActivityIndicator color={'#9400FF'} />
          ) : (
            <Text className="text-white text-[20px] font-medium">
              Update Personal
            </Text>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Profile;
