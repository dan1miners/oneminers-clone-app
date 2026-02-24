import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { APP_COLORS } from "../../constants/colors";
import { useAppTheme } from "../../providers/theme-provider";

type Address = {
  id: string;
  title: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
};

export default function ShippingAddressesScreen() {
  const { colors: themeColors } = useAppTheme();
  const router = useRouter();

  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "1",
      title: "Home",
      name: "John Doe",
      address: "123 Mining Street",
      city: "San Francisco",
      state: "CA",
      zipCode: "94107",
      country: "United States",
      phone: "+1 (555) 123-4567",
      isDefault: true,
    },
    {
      id: "2",
      title: "Office",
      name: "John Doe",
      address: "456 Crypto Avenue",
      city: "San Jose",
      state: "CA",
      zipCode: "95113",
      country: "United States",
      phone: "+1 (555) 987-6543",
      isDefault: false,
    },
    {
      id: "3",
      title: "Warehouse",
      name: "MiningPros Inc.",
      address: "789 Mining Complex",
      city: "Sacramento",
      state: "CA",
      zipCode: "95814",
      country: "United States",
      phone: "+1 (555) 456-7890",
      isDefault: false,
    },
  ]);

  const handleBackPress = () => router.back();
  const handleAddNewAddress = () => router.push("/(essentials)/add-address");
  const handleEditAddress = (id: string) =>
    router.push(`/(essentials)/edit-address?id=${id}`);

  const handleDeleteAddress = (id: string) => {
    Alert.alert(
      "Delete Address",
      "Are you sure you want to delete this shipping address?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () =>
            setAddresses((prev) => prev.filter((a) => a.id !== id)),
        },
      ],
    );
  };

  const handleSetDefault = (id: string) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
  };

  const AddressCard = ({ address }: { address: Address }) => (
    <View className="bg-white dark:bg-slate-900 rounded-2xl border border-om-border dark:border-slate-700 mb-4 overflow-hidden">
      {/* Top row */}
      <View className="px-5 pt-5 pb-4">
        <View className="flex-row items-start justify-between">
          <View className="flex-1 pr-3">
            <View className="flex-row items-center">
              <Text className="text-[16px] font-bold text-black dark:text-slate-100">
                {address.title}
              </Text>

              {address.isDefault ? (
                <View className="ml-2 bg-om-accent/15 border border-om-accent/25 px-2 py-1 rounded-md">
                  <Text className="text-[11px] font-semibold text-black dark:text-slate-100">
                    Default
                  </Text>
                </View>
              ) : null}
            </View>

            <Text className="text-[14px] font-semibold text-black dark:text-slate-100 mt-3">
              {address.name}
            </Text>

            <View className="mt-2">
              <Text className="text-[13px] text-om-subtext dark:text-slate-400 leading-5">
                {address.address}
              </Text>
              <Text className="text-[13px] text-om-subtext dark:text-slate-400 leading-5">
                {address.city}, {address.state} {address.zipCode}
              </Text>
              <Text className="text-[13px] text-om-subtext dark:text-slate-400 leading-5">
                {address.country}
              </Text>
            </View>

            <View className="flex-row items-center mt-3">
              <View className="w-8 h-8 rounded-full bg-om-accent/10 items-center justify-center mr-2">
                <Ionicons
                  name="call-outline"
                  size={16}
                  color={themeColors.text}
                />
              </View>
              <Text className="text-[13px] font-semibold text-om-text dark:text-slate-100">
                {address.phone}
              </Text>
            </View>
          </View>

          {/* Actions */}
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => handleEditAddress(address.id)}
              activeOpacity={0.9}
              className="w-10 h-10 rounded-full bg-om-bg dark:bg-slate-950 border border-om-border dark:border-slate-700 items-center justify-center mr-2"
            >
              <Ionicons
                name="pencil-outline"
                size={18}
                color={APP_COLORS.accent}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleDeleteAddress(address.id)}
              activeOpacity={0.9}
              className="w-10 h-10 rounded-full bg-om-bg dark:bg-slate-950 border border-om-border dark:border-slate-700 items-center justify-center"
            >
              <Ionicons
                name="trash-outline"
                size={18}
                color={APP_COLORS.danger}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Bottom actions bar */}
      <View className="flex-row border-t border-om-border dark:border-slate-700">
        {!address.isDefault ? (
          <TouchableOpacity
            onPress={() => handleSetDefault(address.id)}
            activeOpacity={0.9}
            className="flex-1 py-4 items-center justify-center bg-white dark:bg-slate-900"
          >
            <View className="flex-row items-center">
              <Ionicons
                name="star-outline"
                size={16}
                color={APP_COLORS.accent}
              />
              <Text className="ml-2 text-[13px] font-semibold text-om-text dark:text-slate-100">
                Set default
              </Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View className="flex-1 py-4 items-center justify-center bg-white dark:bg-slate-900">
            <View className="flex-row items-center">
              <Ionicons
                name="checkmark-circle"
                size={16}
                color={APP_COLORS.success}
              />
              <Text className="ml-2 text-[13px] font-semibold text-om-text dark:text-slate-100">
                Default address
              </Text>
            </View>
          </View>
        )}

        <View className="w-px bg-om-border" />

        <TouchableOpacity
          activeOpacity={0.9}
          className="flex-1 py-4 items-center justify-center bg-om-accent"
        >
          <Text className="text-[13px] font-bold text-black dark:text-slate-100">
            Use this
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView
      className="flex-1 bg-om-bg dark:bg-slate-950"
      edges={["top", "bottom", "left", "right"]}
    >
      {/* Header */}
      <View className="py-3 px-5 border-b border-om-border dark:border-slate-700 flex-row items-center h-[60px] bg-white dark:bg-slate-900 ">
        <TouchableOpacity onPress={handleBackPress} className="p-1 mr-3">
          <Ionicons name="arrow-back" size={24} color={themeColors.text} />
        </TouchableOpacity>

        <Text className="text-lg font-semibold text-black dark:text-slate-100 flex-1">
          Shipping Addresses
        </Text>

        <TouchableOpacity
          onPress={handleAddNewAddress}
          className="w-10 h-10 rounded-full bg-om-accent/15 border border-om-accent/25 items-center justify-center"
        >
          <Ionicons name="add" size={22} color={themeColors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="p-4"
      >
        {/* Small helper */}
        <View className="flex-row items-center bg-om-accent/10 border border-om-accent/20 rounded-2xl p-4 mb-5">
          <View className="w-10 h-10 rounded-full bg-om-accent/20 items-center justify-center mr-3">
            <Ionicons
              name="information-circle"
              size={22}
              color={themeColors.text}
            />
          </View>
          <View className="flex-1">
            <Text className="text-[13px] font-semibold text-black dark:text-slate-100">
              Faster checkout
            </Text>
            <Text className="text-[12px] text-om-subtext dark:text-slate-400 mt-0.5 leading-5">
              Add multiple addresses and set a default for quicker orders.
            </Text>
          </View>
        </View>

        {/* Address list */}
        {addresses.length ? (
          addresses.map((a) => <AddressCard key={a.id} address={a} />)
        ) : (
          <View className="items-center bg-white dark:bg-slate-900 border border-om-border dark:border-slate-700 rounded-2xl p-10">
            <Ionicons
              name="location-outline"
              size={56}
              color={APP_COLORS.lightGray}
            />
            <Text className="text-lg font-bold text-black dark:text-slate-100 mt-4 mb-2">
              No addresses yet
            </Text>
            <Text className="text-[13px] text-om-subtext dark:text-slate-400 text-center leading-5">
              Add a shipping address to get started.
            </Text>
          </View>
        )}

        {/* Add new */}
        <TouchableOpacity
          onPress={handleAddNewAddress}
          activeOpacity={0.9}
          className="flex-row items-center justify-center bg-white dark:bg-slate-900 border-2 border-dashed border-om-accent/60 rounded-2xl p-5 mt-2"
        >
          <View className="w-9 h-9 rounded-full bg-om-accent/10 items-center justify-center mr-2">
            <Ionicons name="add" size={20} color={themeColors.text} />
          </View>
          <Text className="text-[15px] font-bold text-black dark:text-slate-100">
            Add new address
          </Text>
        </TouchableOpacity>

        {/* Tips (no shadow) */}
        <View className="bg-white dark:bg-slate-900 border border-om-border dark:border-slate-700 rounded-2xl p-5 mt-6">
          <View className="flex-row items-center mb-4">
            <View className="w-9 h-9 rounded-full bg-om-accent/10 items-center justify-center mr-2">
              <Ionicons
                name="sparkles-outline"
                size={18}
                color={themeColors.text}
              />
            </View>
            <Text className="text-[16px] font-bold text-black dark:text-slate-100">
              Shipping tips
            </Text>
          </View>

          {[
            "Double-check your street, city, and postal code to avoid delays.",
            "Add home, office, and warehouse addresses for faster repeat orders.",
            "Set a default address so checkout is one tap.",
          ].map((tip, i) => (
            <View
              key={i}
              className={`flex-row items-start ${i === 2 ? "" : "mb-3"}`}
            >
              <Ionicons
                name="checkmark-circle"
                size={18}
                color={APP_COLORS.success}
              />
              <Text className="ml-3 text-[13px] text-om-subtext dark:text-slate-400 leading-5 flex-1">
                {tip}
              </Text>
            </View>
          ))}
        </View>

        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
