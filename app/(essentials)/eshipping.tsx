import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

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
  const router = useRouter();

  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      title: 'Home',
      name: 'John Doe',
      address: '123 Mining Street',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94107',
      country: 'United States',
      phone: '+1 (555) 123-4567',
      isDefault: true,
    },
    {
      id: '2',
      title: 'Office',
      name: 'John Doe',
      address: '456 Crypto Avenue',
      city: 'San Jose',
      state: 'CA',
      zipCode: '95113',
      country: 'United States',
      phone: '+1 (555) 987-6543',
      isDefault: false,
    },
    {
      id: '3',
      title: 'Warehouse',
      name: 'MiningPros Inc.',
      address: '789 Mining Complex',
      city: 'Sacramento',
      state: 'CA',
      zipCode: '95814',
      country: 'United States',
      phone: '+1 (555) 456-7890',
      isDefault: false,
    },
  ]);

  const handleBackPress = () => router.back();
  const handleAddNewAddress = () => router.push('/(essentials)/add-address');
  const handleEditAddress = (id: string) => router.push(`/(essentials)/edit-address?id=${id}`);

  const handleDeleteAddress = (id: string) => {
    Alert.alert('Delete Address', 'Are you sure you want to delete this shipping address?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => setAddresses((prev) => prev.filter((a) => a.id !== id)),
      },
    ]);
  };

  const handleSetDefault = (id: string) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
  };

  const AddressCard = ({ address }: { address: Address }) => (
    <View className="bg-white rounded-2xl border border-[#E5E7EB] mb-4 overflow-hidden">
      {/* Top row */}
      <View className="px-5 pt-5 pb-4">
        <View className="flex-row items-start justify-between">
          <View className="flex-1 pr-3">
            <View className="flex-row items-center">
              <Text className="text-[16px] font-bold text-black">{address.title}</Text>

              {address.isDefault ? (
                <View className="ml-2 bg-[#FFC000]/15 border border-[#FFC000]/25 px-2 py-1 rounded-md">
                  <Text className="text-[11px] font-semibold text-black">Default</Text>
                </View>
              ) : null}
            </View>

            <Text className="text-[14px] font-semibold text-black mt-3">{address.name}</Text>

            <View className="mt-2">
              <Text className="text-[13px] text-[#6B7280] leading-5">{address.address}</Text>
              <Text className="text-[13px] text-[#6B7280] leading-5">
                {address.city}, {address.state} {address.zipCode}
              </Text>
              <Text className="text-[13px] text-[#6B7280] leading-5">{address.country}</Text>
            </View>

            <View className="flex-row items-center mt-3">
              <View className="w-8 h-8 rounded-full bg-[#FFC000]/10 items-center justify-center mr-2">
                <Ionicons name="call-outline" size={16} color="#111827" />
              </View>
              <Text className="text-[13px] font-semibold text-[#111827]">{address.phone}</Text>
            </View>
          </View>

          {/* Actions */}
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => handleEditAddress(address.id)}
              activeOpacity={0.9}
              className="w-10 h-10 rounded-full bg-[#F9FAFB] border border-[#E5E7EB] items-center justify-center mr-2"
            >
              <Ionicons name="pencil-outline" size={18} color="#FFC000" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleDeleteAddress(address.id)}
              activeOpacity={0.9}
              className="w-10 h-10 rounded-full bg-[#F9FAFB] border border-[#E5E7EB] items-center justify-center"
            >
              <Ionicons name="trash-outline" size={18} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Bottom actions bar */}
      <View className="flex-row border-t border-[#E5E7EB]">
        {!address.isDefault ? (
          <TouchableOpacity
            onPress={() => handleSetDefault(address.id)}
            activeOpacity={0.9}
            className="flex-1 py-4 items-center justify-center bg-white"
          >
            <View className="flex-row items-center">
              <Ionicons name="star-outline" size={16} color="#FFC000" />
              <Text className="ml-2 text-[13px] font-semibold text-[#111827]">Set default</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View className="flex-1 py-4 items-center justify-center bg-white">
            <View className="flex-row items-center">
              <Ionicons name="checkmark-circle" size={16} color="#34C759" />
              <Text className="ml-2 text-[13px] font-semibold text-[#111827]">Default address</Text>
            </View>
          </View>
        )}

        <View className="w-px bg-[#E5E7EB]" />

        <TouchableOpacity activeOpacity={0.9} className="flex-1 py-4 items-center justify-center bg-[#FFC000]">
          <Text className="text-[13px] font-bold text-black">Use this</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]" edges={['top', 'bottom', 'left', 'right']}>
      {/* Header */}
      <View className="py-3 px-5 border-b border-[#E5E7EB] flex-row items-center h-[60px] ">
        <TouchableOpacity onPress={handleBackPress} className="p-1 mr-3">
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text className="text-lg font-semibold text-black flex-1">Shipping Addresses</Text>

        <TouchableOpacity onPress={handleAddNewAddress} className="w-10 h-10 rounded-full bg-[#FFC000]/15 border border-[#FFC000]/25 items-center justify-center">
          <Ionicons name="add" size={22} color="#111827" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerClassName="p-4">
        {/* Small helper */}
        <View className="flex-row items-center bg-[#FFC000]/10 border border-[#FFC000]/20 rounded-2xl p-4 mb-5">
          <View className="w-10 h-10 rounded-full bg-[#FFC000]/20 items-center justify-center mr-3">
            <Ionicons name="information-circle" size={22} color="#111827" />
          </View>
          <View className="flex-1">
            <Text className="text-[13px] font-semibold text-black">Faster checkout</Text>
            <Text className="text-[12px] text-[#6B7280] mt-0.5 leading-5">
              Add multiple addresses and set a default for quicker orders.
            </Text>
          </View>
        </View>

        {/* Address list */}
        {addresses.length ? (
          addresses.map((a) => <AddressCard key={a.id} address={a} />)
        ) : (
          <View className="items-center bg-white border border-[#E5E7EB] rounded-2xl p-10">
            <Ionicons name="location-outline" size={56} color="#D1D5DB" />
            <Text className="text-lg font-bold text-black mt-4 mb-2">No addresses yet</Text>
            <Text className="text-[13px] text-[#6B7280] text-center leading-5">
              Add a shipping address to get started.
            </Text>
          </View>
        )}

        {/* Add new */}
        <TouchableOpacity
          onPress={handleAddNewAddress}
          activeOpacity={0.9}
          className="flex-row items-center justify-center bg-white border-2 border-dashed border-[#FFC000]/60 rounded-2xl p-5 mt-2"
        >
          <View className="w-9 h-9 rounded-full bg-[#FFC000]/10 items-center justify-center mr-2">
            <Ionicons name="add" size={20} color="#111827" />
          </View>
          <Text className="text-[15px] font-bold text-black">Add new address</Text>
        </TouchableOpacity>

        {/* Tips (no shadow) */}
        <View className="bg-white border border-[#E5E7EB] rounded-2xl p-5 mt-6">
          <View className="flex-row items-center mb-4">
            <View className="w-9 h-9 rounded-full bg-[#FFC000]/10 items-center justify-center mr-2">
              <Ionicons name="sparkles-outline" size={18} color="#111827" />
            </View>
            <Text className="text-[16px] font-bold text-black">Shipping tips</Text>
          </View>

          {[
            'Double-check your street, city, and postal code to avoid delays.',
            'Add home, office, and warehouse addresses for faster repeat orders.',
            'Set a default address so checkout is one tap.',
          ].map((tip, i) => (
            <View key={i} className={`flex-row items-start ${i === 2 ? '' : 'mb-3'}`}>
              <Ionicons name="checkmark-circle" size={18} color="#34C759" />
              <Text className="ml-3 text-[13px] text-[#6B7280] leading-5 flex-1">{tip}</Text>
            </View>
          ))}
        </View>

        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
