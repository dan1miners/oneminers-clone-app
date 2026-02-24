import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { APP_COLORS } from "../../constants/colors";
import { useAppTheme } from "../../providers/theme-provider";

type UserData = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  birthDate: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  bio: string;
  company: string;
  jobTitle: string;
  website: string;
  isTwoFactorEnabled: boolean;
  emailNotifications: boolean;
  marketingEmails: boolean;
};

export default function EditProfileScreen() {
  const { colors: themeColors } = useAppTheme();
  const router = useRouter();

  const [userData, setUserData] = useState<UserData>({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phoneNumber: "+1 (555) 123-4567",
    birthDate: "1990-05-15",
    gender: "male",
    address: "123 Mining Street",
    city: "San Francisco",
    state: "CA",
    zipCode: "94107",
    country: "United States",
    bio: "Professional cryptocurrency miner with 5+ years of experience. Specializing in Bitcoin and Ethereum mining operations.",
    company: "MiningPros Inc.",
    jobTitle: "Senior Mining Engineer",
    website: "www.johndoe-mining.com",
    isTwoFactorEnabled: true,
    emailNotifications: true,
    marketingEmails: false,
  });

  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleInputChange = <K extends keyof UserData>(
    field: K,
    value: UserData[K],
  ) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = () => {
    Alert.alert(
      "Profile Updated",
      "Your profile information has been successfully updated.",
      [{ text: "OK", onPress: () => router.back() }],
    );
  };

  const handleImagePick = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permission Required",
        "You need to allow access to your photos.",
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
      <View className="w-[100px] h-[100px] rounded-full bg-om-accent items-center justify-center mb-4">
        <Text className="text-4xl font-bold text-black dark:text-slate-100">
          {userData.firstName[0]}
          {userData.lastName[0]}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView
      className="flex-1 bg-gray-50 dark:bg-slate-950"
      edges={["top", "bottom", "left", "right"]}
    >
      {/* Header */}
      <View className="py-3 px-5 border-b border-om-border dark:border-slate-700 flex-row items-center h-[60px] bg-white dark:bg-slate-900 ">
        <View className="flex-row items-center flex-1">
          <TouchableOpacity onPress={() => router.back()} className="p-1">
            <Ionicons name="arrow-back" size={24} color={themeColors.text} />
          </TouchableOpacity>

          <Text className="text-lg font-semibold text-black dark:text-slate-100">
            Edit Profile
          </Text>
        </View>
        <TouchableOpacity onPress={handleSaveChanges} className="px-4 py-2">
          <Text className="text-base font-semibold text-om-accent">Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16 }}
      >
        {/* Profile Picture */}
        <View className="bg-white dark:bg-slate-900 rounded-2xl p-5 mb-4">
          <Text className="text-lg font-bold text-black dark:text-slate-100 mb-5">
            Profile Picture
          </Text>

          <View className="items-center">
            {renderAvatar()}

            <TouchableOpacity
              onPress={handleImagePick}
              className="flex-row items-center bg-om-accent-100 px-5 py-2.5 rounded-full mb-3"
            >
              <Ionicons name="camera" size={20} color={APP_COLORS.accent} />
              <Text className="ml-2 text-sm font-semibold text-black dark:text-slate-100">
                Change Photo
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setProfileImage(null)}>
              <Text className="text-sm font-medium text-red-500">Remove</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Personal Information */}
        <View className="bg-white dark:bg-slate-900 rounded-2xl p-5 mb-4">
          <Text className="text-lg font-bold text-black dark:text-slate-100 mb-5">
            Personal Information
          </Text>

          {(
            [
              { label: "First Name", key: "firstName" },
              { label: "Last Name", key: "lastName" },
            ] as const satisfies Array<{ label: string; key: keyof UserData }>
          ).map((f) => (
            <View key={f.key} className="mb-5">
              <Text className="text-sm font-medium text-om-muted-2 dark:text-slate-400 mb-2">
                {f.label}
              </Text>
              <TextInput
                className="bg-om-bg-soft dark:bg-slate-800 border border-om-border-soft dark:border-slate-700 rounded-xl px-4 py-3.5 text-base text-om-text-strong dark:text-slate-100"
                value={userData[f.key]}
                onChangeText={(v) => handleInputChange(f.key, v)}
              />
            </View>
          ))}

          {/* Email */}
          <View className="mb-5">
            <Text className="text-sm font-medium text-om-muted-2 dark:text-slate-400 mb-2">
              Email Address
            </Text>
            <View className="relative">
              <Ionicons
                name="mail-outline"
                size={20}
                color={themeColors.subtext}
                className="absolute left-4 top-3.5"
              />
              <TextInput
                className="bg-om-bg-soft dark:bg-slate-800 border border-om-border-soft dark:border-slate-700 rounded-xl pl-12 pr-4 py-3.5 text-base text-om-text-strong dark:text-slate-100"
                value={userData.email}
                autoCapitalize="none"
                keyboardType="email-address"
                onChangeText={(v) => handleInputChange("email", v)}
              />
            </View>
          </View>

          {/* Phone */}
          <View className="mb-5">
            <Text className="text-sm font-medium text-om-muted-2 dark:text-slate-400 mb-2">
              Phone Number
            </Text>
            <View className="relative">
              <Ionicons
                name="call-outline"
                size={20}
                color={themeColors.subtext}
                className="absolute left-4 top-3.5"
              />
              <TextInput
                className="bg-om-bg-soft dark:bg-slate-800 border border-om-border-soft dark:border-slate-700 rounded-xl pl-12 pr-4 py-3.5 text-base text-om-text-strong dark:text-slate-100"
                value={userData.phoneNumber}
                keyboardType="phone-pad"
                onChangeText={(v) => handleInputChange("phoneNumber", v)}
              />
            </View>
          </View>
        </View>

        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
