import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

export default function EditProfileScreen() {
  const router = useRouter();

  const [userData, setUserData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phoneNumber: '+1 (555) 123-4567',
    birthDate: '1990-05-15',
    gender: 'male',
    address: '123 Mining Street',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94107',
    country: 'United States',
    bio: 'Professional cryptocurrency miner with 5+ years of experience. Specializing in Bitcoin and Ethereum mining operations.',
    company: 'MiningPros Inc.',
    jobTitle: 'Senior Mining Engineer',
    website: 'www.johndoe-mining.com',
    isTwoFactorEnabled: true,
    emailNotifications: true,
    marketingEmails: false,
  });

  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string | boolean) => {
    setUserData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = () => {
    Alert.alert(
      'Profile Updated',
      'Your profile information has been successfully updated.',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  const handleImagePick = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        'Permission Required',
        'You need to allow access to your photos.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const renderAvatar = () => {
    if (profileImage) {
      return (
        <Image
          source={{ uri: profileImage }}
          className="w-[100px] h-[100px] rounded-full mb-4"
        />
      );
    }

    return (
      <View className="w-[100px] h-[100px] rounded-full bg-[#FFC000] items-center justify-center mb-4">
        <Text className="text-4xl font-bold text-black">
          {userData.firstName[0]}
          {userData.lastName[0]}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top', 'bottom', 'left', 'right']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-[#E9ECEF]">
        <TouchableOpacity onPress={() => router.back()} className="p-1">
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text className="text-lg font-semibold text-black">
          Edit Profile
        </Text>

        <TouchableOpacity onPress={handleSaveChanges} className="px-4 py-2">
          <Text className="text-base font-semibold text-[#FFC000]">
            Save
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16 }}
      >
        {/* Profile Picture */}
        <View className="bg-white rounded-2xl p-5 mb-4">
          <Text className="text-lg font-bold text-black mb-5">
            Profile Picture
          </Text>

          <View className="items-center">
            {renderAvatar()}

            <TouchableOpacity
              onPress={handleImagePick}
              className="flex-row items-center bg-[#FFF8E6] px-5 py-2.5 rounded-full mb-3"
            >
              <Ionicons name="camera" size={20} color="#FFC000" />
              <Text className="ml-2 text-sm font-semibold text-black">
                Change Photo
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setProfileImage(null)}>
              <Text className="text-sm font-medium text-red-500">
                Remove
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Personal Information */}
        <View className="bg-white rounded-2xl p-5 mb-4">
          <Text className="text-lg font-bold text-black mb-5">
            Personal Information
          </Text>

          {[
            { label: 'First Name', key: 'firstName' },
            { label: 'Last Name', key: 'lastName' },
          ].map(f => (
            <View key={f.key} className="mb-5">
              <Text className="text-sm font-medium text-[#6C757D] mb-2">
                {f.label}
              </Text>
              <TextInput
                className="bg-[#F8F9FA] border border-[#E9ECEF] rounded-xl px-4 py-3.5 text-base text-[#212529]"
                value={(userData as any)[f.key]}
                onChangeText={v => handleInputChange(f.key, v)}
              />
            </View>
          ))}

          {/* Email */}
          <View className="mb-5">
            <Text className="text-sm font-medium text-[#6C757D] mb-2">
              Email Address
            </Text>
            <View className="relative">
              <Ionicons
                name="mail-outline"
                size={20}
                color="#8E8E93"
                className="absolute left-4 top-3.5"
              />
              <TextInput
                className="bg-[#F8F9FA] border border-[#E9ECEF] rounded-xl pl-12 pr-4 py-3.5 text-base text-[#212529]"
                value={userData.email}
                autoCapitalize="none"
                keyboardType="email-address"
                onChangeText={v => handleInputChange('email', v)}
              />
            </View>
          </View>

          {/* Phone */}
          <View className="mb-5">
            <Text className="text-sm font-medium text-[#6C757D] mb-2">
              Phone Number
            </Text>
            <View className="relative">
              <Ionicons
                name="call-outline"
                size={20}
                color="#8E8E93"
                className="absolute left-4 top-3.5"
              />
              <TextInput
                className="bg-[#F8F9FA] border border-[#E9ECEF] rounded-xl pl-12 pr-4 py-3.5 text-base text-[#212529]"
                value={userData.phoneNumber}
                keyboardType="phone-pad"
                onChangeText={v => handleInputChange('phoneNumber', v)}
              />
            </View>
          </View>
        </View>

        {/* Privacy & Security */}
        <View className="bg-white rounded-2xl p-5 mb-4">
          <Text className="text-lg font-bold text-black mb-4">
            Privacy & Security
          </Text>

          {[
            {
              key: 'isTwoFactorEnabled',
              title: 'Two-Factor Authentication',
              desc: 'Add extra security to your account',
              icon: 'shield-checkmark-outline',
            },
            {
              key: 'emailNotifications',
              title: 'Email Notifications',
              desc: 'Receive important updates',
              icon: 'mail-outline',
            },
            {
              key: 'marketingEmails',
              title: 'Marketing Emails',
              desc: 'Receive promotional content',
              icon: 'megaphone-outline',
            },
          ].map(item => (
            <View
              key={item.key}
              className="flex-row items-center justify-between py-4 border-b border-[#F2F2F7]"
            >
              <View className="flex-row items-center flex-1">
                <Ionicons
                  name={item.icon as any}
                  size={22}
                  color="#FFC000"
                />
                <View className="ml-3 flex-1">
                  <Text className="text-base font-medium text-black">
                    {item.title}
                  </Text>
                  <Text className="text-sm text-[#8E8E93]">
                    {item.desc}
                  </Text>
                </View>
              </View>

              <Switch
                value={(userData as any)[item.key]}
                onValueChange={v => handleInputChange(item.key, v)}
                trackColor={{ false: '#F2F2F7', true: '#FFC000' }}
                thumbColor="#FFFFFF"
              />
            </View>
          ))}
        </View>

        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
