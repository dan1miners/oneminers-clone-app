import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { APP_COLORS } from "../../constants/colors";
import { useAppTheme } from "../../providers/theme-provider";

export default function AddAddressScreen() {
  const { colors: themeColors } = useAppTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const isEditMode = params.id ? true : false;
  const addressId = params.id as string; // (not used yet, but kept)

  const [formData, setFormData] = useState({
    title: isEditMode ? "Office" : "",
    firstName: isEditMode ? "John" : "",
    lastName: isEditMode ? "Doe" : "",
    company: isEditMode ? "MiningPros Inc." : "",
    address: isEditMode ? "456 Crypto Avenue" : "",
    apartment: isEditMode ? "Suite 500" : "",
    city: isEditMode ? "San Jose" : "",
    state: isEditMode ? "CA" : "",
    zipCode: isEditMode ? "95113" : "",
    country: isEditMode ? "United States" : "",
    phone: isEditMode ? "+1 (555) 987-6543" : "",
    isDefault: isEditMode ? false : false,
  });

  const handleBackPress = () => {
    router.back();
  };

  const handleSaveAddress = () => {
    if (
      !formData.title ||
      !formData.address ||
      !formData.city ||
      !formData.zipCode ||
      !formData.phone
    ) {
      Alert.alert("Missing Information", "Please fill in all required fields.");
      return;
    }

    Alert.alert(
      "Success",
      isEditMode
        ? "Address updated successfully!"
        : "New address added successfully!",
      [{ text: "OK", onPress: () => router.back() }],
    );
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addressTypes = ["Home", "Office", "Warehouse", "Other"];

  return (
    <SafeAreaView
      className="flex-1 bg-gray-50 dark:bg-slate-950"
      edges={["top", "bottom", "left", "right"]}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white dark:bg-slate-900 border-b border-om-border-soft dark:border-slate-700">
        <TouchableOpacity onPress={handleBackPress} className="p-1">
          <Ionicons name="arrow-back" size={24} color={themeColors.text} />
        </TouchableOpacity>

        <Text className="text-lg font-semibold text-black dark:text-slate-100">
          {isEditMode ? "Edit Address" : "Add New Address"}
        </Text>

        <TouchableOpacity onPress={handleSaveAddress} className="px-4 py-2">
          <Text className="text-base font-semibold text-om-accent">Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16 }}
      >
        {/* Address Type */}
        <View
          className="bg-white dark:bg-slate-900 rounded-2xl p-5 mb-4"
          style={{ elevation: 2 }}
        >
          <Text className="text-lg font-bold text-black dark:text-slate-100 mb-5">
            Address Type
          </Text>

          <View className="flex-row flex-wrap">
            {addressTypes.map((type) => {
              const active = formData.title === type;
              return (
                <TouchableOpacity
                  key={type}
                  onPress={() => handleInputChange("title", type)}
                  className={[
                    "px-4 py-3 rounded-lg border min-w-[80px] items-center mr-3 mb-3",
                    active
                      ? "bg-om-accent-100 border-om-accent"
                      : "bg-om-bg-soft dark:bg-slate-800 border-om-border-soft dark:border-slate-700",
                  ].join(" ")}
                >
                  <Text
                    className={[
                      "text-sm font-medium",
                      active
                        ? "text-black dark:text-slate-100 font-semibold"
                        : "text-om-muted-2 dark:text-slate-400",
                    ].join(" ")}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Contact Information */}
        <View
          className="bg-white dark:bg-slate-900 rounded-2xl p-5 mb-4"
          style={{ elevation: 2 }}
        >
          <Text className="text-lg font-bold text-black dark:text-slate-100 mb-5">
            Contact Information
          </Text>

          {/* First + Last */}
          <View className="flex-row justify-between">
            <View className="w-[48%] mb-5">
              <Text className="text-sm font-medium text-om-muted-2 dark:text-slate-400 mb-2">
                First Name *
              </Text>
              <TextInput
                className="bg-om-bg-soft dark:bg-slate-800 rounded-xl px-4 py-3.5 text-base text-om-text-strong dark:text-slate-100 border border-om-border-soft dark:border-slate-700"
                value={formData.firstName}
                onChangeText={(value) => handleInputChange("firstName", value)}
                placeholder="Enter first name"
                placeholderTextColor={themeColors.subtext}
              />
            </View>

            <View className="w-[48%] mb-5">
              <Text className="text-sm font-medium text-om-muted-2 dark:text-slate-400 mb-2">
                Last Name *
              </Text>
              <TextInput
                className="bg-om-bg-soft dark:bg-slate-800 rounded-xl px-4 py-3.5 text-base text-om-text-strong dark:text-slate-100 border border-om-border-soft dark:border-slate-700"
                value={formData.lastName}
                onChangeText={(value) => handleInputChange("lastName", value)}
                placeholder="Enter last name"
                placeholderTextColor={themeColors.subtext}
              />
            </View>
          </View>

          {/* Company */}
          <View className="mb-5">
            <Text className="text-sm font-medium text-om-muted-2 dark:text-slate-400 mb-2">
              Company (Optional)
            </Text>
            <TextInput
              className="bg-om-bg-soft dark:bg-slate-800 rounded-xl px-4 py-3.5 text-base text-om-text-strong dark:text-slate-100 border border-om-border-soft dark:border-slate-700"
              value={formData.company}
              onChangeText={(value) => handleInputChange("company", value)}
              placeholder="Enter company name"
              placeholderTextColor={themeColors.subtext}
            />
          </View>

          {/* Phone */}
          <View className="mb-1">
            <Text className="text-sm font-medium text-om-muted-2 dark:text-slate-400 mb-2">
              Phone Number *
            </Text>

            <View className="relative">
              <View className="absolute left-4 top-3.5 z-10">
                <Ionicons
                  name="call-outline"
                  size={20}
                  color={themeColors.subtext}
                />
              </View>

              <TextInput
                className="bg-om-bg-soft dark:bg-slate-800 rounded-xl pl-12 pr-4 py-3.5 text-base text-om-text-strong dark:text-slate-100 border border-om-border-soft dark:border-slate-700"
                value={formData.phone}
                onChangeText={(value) => handleInputChange("phone", value)}
                placeholder="Enter phone number"
                placeholderTextColor={themeColors.subtext}
                keyboardType="phone-pad"
              />
            </View>
          </View>
        </View>

        {/* Address Details */}
        <View
          className="bg-white dark:bg-slate-900 rounded-2xl p-5 mb-4"
          style={{ elevation: 2 }}
        >
          <Text className="text-lg font-bold text-black dark:text-slate-100 mb-5">
            Address Details
          </Text>

          {/* Street */}
          <View className="mb-5">
            <Text className="text-sm font-medium text-om-muted-2 dark:text-slate-400 mb-2">
              Street Address *
            </Text>
            <TextInput
              className="bg-om-bg-soft dark:bg-slate-800 rounded-xl px-4 py-3.5 text-base text-om-text-strong dark:text-slate-100 border border-om-border-soft dark:border-slate-700"
              value={formData.address}
              onChangeText={(value) => handleInputChange("address", value)}
              placeholder="Enter street address"
              placeholderTextColor={themeColors.subtext}
            />
          </View>

          {/* Apartment */}
          <View className="mb-5">
            <Text className="text-sm font-medium text-om-muted-2 dark:text-slate-400 mb-2">
              Apartment, Suite, etc. (Optional)
            </Text>
            <TextInput
              className="bg-om-bg-soft dark:bg-slate-800 rounded-xl px-4 py-3.5 text-base text-om-text-strong dark:text-slate-100 border border-om-border-soft dark:border-slate-700"
              value={formData.apartment}
              onChangeText={(value) => handleInputChange("apartment", value)}
              placeholder="Enter apartment or suite number"
              placeholderTextColor={themeColors.subtext}
            />
          </View>

          {/* City + State */}
          <View className="flex-row justify-between">
            <View className="w-[48%] mb-5">
              <Text className="text-sm font-medium text-om-muted-2 dark:text-slate-400 mb-2">
                City *
              </Text>
              <TextInput
                className="bg-om-bg-soft dark:bg-slate-800 rounded-xl px-4 py-3.5 text-base text-om-text-strong dark:text-slate-100 border border-om-border-soft dark:border-slate-700"
                value={formData.city}
                onChangeText={(value) => handleInputChange("city", value)}
                placeholder="Enter city"
                placeholderTextColor={themeColors.subtext}
              />
            </View>

            <View className="w-[48%] mb-5">
              <Text className="text-sm font-medium text-om-muted-2 dark:text-slate-400 mb-2">
                State/Province
              </Text>
              <TextInput
                className="bg-om-bg-soft dark:bg-slate-800 rounded-xl px-4 py-3.5 text-base text-om-text-strong dark:text-slate-100 border border-om-border-soft dark:border-slate-700"
                value={formData.state}
                onChangeText={(value) => handleInputChange("state", value)}
                placeholder="Enter state"
                placeholderTextColor={themeColors.subtext}
              />
            </View>
          </View>

          {/* Zip + Country */}
          <View className="flex-row justify-between">
            <View className="w-[48%] mb-1">
              <Text className="text-sm font-medium text-om-muted-2 dark:text-slate-400 mb-2">
                ZIP/Postal Code *
              </Text>
              <TextInput
                className="bg-om-bg-soft dark:bg-slate-800 rounded-xl px-4 py-3.5 text-base text-om-text-strong dark:text-slate-100 border border-om-border-soft dark:border-slate-700"
                value={formData.zipCode}
                onChangeText={(value) => handleInputChange("zipCode", value)}
                placeholder="Enter ZIP code"
                placeholderTextColor={themeColors.subtext}
                keyboardType="numeric"
              />
            </View>

            <View className="w-[48%] mb-1">
              <Text className="text-sm font-medium text-om-muted-2 dark:text-slate-400 mb-2">
                Country *
              </Text>
              <TouchableOpacity className="flex-row items-center justify-between bg-om-bg-soft dark:bg-slate-800 rounded-xl px-4 py-3.5 border border-om-border-soft dark:border-slate-700">
                <Text className="text-base text-om-text-strong dark:text-slate-100">
                  {formData.country || "Select country"}
                </Text>
                <Ionicons
                  name="chevron-down"
                  size={18}
                  color={APP_COLORS.lightGray}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Address Preferences */}
        <View
          className="bg-white dark:bg-slate-900 rounded-2xl p-5 mb-4"
          style={{ elevation: 2 }}
        >
          <Text className="text-lg font-bold text-black dark:text-slate-100 mb-2">
            Address Preferences
          </Text>

          {/* Default switch */}
          <View className="flex-row items-center justify-between py-4 border-b border-om-surface dark:border-slate-700">
            <View className="flex-row items-center flex-1">
              <Ionicons name="star" size={22} color={APP_COLORS.accent} />
              <View className="ml-3 flex-1">
                <Text className="text-base font-medium text-black dark:text-slate-100 mb-0.5">
                  Set as Default Address
                </Text>
                <Text className="text-sm text-om-muted dark:text-slate-400">
                  Use this address for all future orders
                </Text>
              </View>
            </View>

            <Switch
              value={formData.isDefault}
              onValueChange={(value) => handleInputChange("isDefault", value)}
              trackColor={{
                false: APP_COLORS.surface,
                true: APP_COLORS.accent,
              }}
              thumbColor={APP_COLORS.white}
            />
          </View>

          {/* Delivery instructions */}
          <TouchableOpacity className="flex-row items-center justify-between py-4">
            <View className="flex-row items-center flex-1">
              <Ionicons
                name="cube-outline"
                size={22}
                color={APP_COLORS.accent}
              />
              <View className="ml-3 flex-1">
                <Text className="text-base font-medium text-black dark:text-slate-100 mb-0.5">
                  Delivery Instructions
                </Text>
                <Text className="text-sm text-om-muted dark:text-slate-400">
                  Add special instructions for delivery
                </Text>
              </View>
            </View>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={APP_COLORS.lightGray}
            />
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View className="flex-row justify-between mt-2">
          <TouchableOpacity
            onPress={handleBackPress}
            className="flex-1 bg-om-bg-soft dark:bg-slate-800 py-4 rounded-xl items-center mr-3"
          >
            <Text className="text-base font-semibold text-om-muted-2 dark:text-slate-400">
              Cancel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSaveAddress}
            className="flex-[2] bg-om-accent py-4 rounded-xl items-center"
          >
            <Text className="text-base font-bold text-black dark:text-slate-100">
              {isEditMode ? "Update Address" : "Save Address"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Spacer */}
        <View className="h-[30px]" />
      </ScrollView>
    </SafeAreaView>
  );
}
