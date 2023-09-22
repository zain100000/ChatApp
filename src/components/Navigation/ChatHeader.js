import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ChatHeader = ({selectedUser, navigation}) => {
  return (
    <View className="flex-row p-5 border-b-2 border-gray-400">
      <TouchableOpacity onPress={() => navigation.goBack('Home')}>
        <MaterialCommunityIcons name="arrow-left-thin" size={30} color="#f57c00" />
      </TouchableOpacity>
      <Text className="text-[16px] font-semibold ml-2 text-secondary translate-y-1">{selectedUser.fullname}</Text>
    </View>
  );
};

export default ChatHeader;
