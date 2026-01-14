import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
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
  const handleEditAddress = (id: string) =>
    router.push(`/(essentials)/edit-address?id=${id}`);

  const handleDeleteAddress = (id: string) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this shipping address?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () =>
            setAddresses(prev => prev.filter(a => a.id !== id)),
        },
      ]
    );
  };

  const handleSetDefault = (id: string) => {
    setAddresses(prev =>
      prev.map(a => ({ ...a, isDefault: a.id === id }))
    );
  };

  const renderAddressCard = (address: Address) => (
    <View
      key={address.id}
      className="bg-white rounded-2xl p-5 mb-4 shadow-sm"
    >
      {/* Header */}
      <View className="mb-4">
        <View className="flex-row justify-between items-center mb-3">
          <View className="flex-row items-center">
            <Text className="text-lg font-bold text-black mr-2">
              {address.title}
            </Text>

            {address.isDefault && (
              <View className="bg-[#FFC000] px-2 py-1 rounded-md">
                <Text className="text-xs font-semibold text-black">
                  Default
                </Text>
              </View>
            )}
          </View>

          <View className="flex-row space-x-3">
            <TouchableOpacity
              onPress={() => handleEditAddress(address.id)}
              className="w-9 h-9 rounded-full bg-[#F8F9FA] items-center justify-center"
            >
              <Ionicons name="pencil" size={18} color="#FFC000" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleDeleteAddress(address.id)}
              className="w-9 h-9 rounded-full bg-[#F8F9FA] items-center justify-center"
            >
              <Ionicons name="trash-outline" size={18} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <View className="flex-row justify-between">
          <View className="flex-1">
            <Text className="text-base font-semibold text-black mb-2">
              {address.name}
            </Text>
            <Text className="text-sm text-[#6C757D] mb-1">
              {address.address}
            </Text>
            <Text className="text-sm text-[#6C757D] mb-1">
              {address.city}, {address.state} {address.zipCode}
            </Text>
            <Text className="text-sm text-[#6C757D] mb-1">
              {address.country}
            </Text>
            <Text className="text-sm font-medium text-[#FFC000] mt-1">
              {address.phone}
            </Text>
          </View>

          <View className="items-end ml-3">
            {!address.isDefault && (
              <TouchableOpacity
                onPress={() => handleSetDefault(address.id)}
                className="flex-row items-center bg-[#FFF8E6] px-3 py-2 rounded-lg mb-3"
              >
                <Ionicons
                  name="star-outline"
                  size={16}
                  color="#FFC000"
                />
                <Text className="ml-1.5 text-sm font-medium text-black">
                  Set as Default
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity className="bg-[#FFC000] px-4 py-2.5 rounded-lg">
              <Text className="text-sm font-semibold text-black">
                Use This Address
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top', 'bottom', 'left', 'right']}>
      {/* Header */}
      <View className="flex-row justify-between items-center px-4 py-3 bg-white border-b border-[#E9ECEF]">
        <TouchableOpacity onPress={handleBackPress} className="p-1">
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text className="text-lg font-semibold text-black">
          Shipping Addresses
        </Text>

        <TouchableOpacity onPress={handleAddNewAddress} className="p-1">
          <Ionicons name="add" size={24} color="#FFC000" />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16 }}
      >
        {/* Instruction */}
        <View className="flex-row items-center bg-[#FFF8E6] rounded-xl p-4 mb-5">
          <Ionicons
            name="information-circle"
            size={24}
            color="#FFC000"
          />
          <Text className="ml-3 text-sm text-black flex-1 leading-5">
            Add and manage your shipping addresses for faster checkout
          </Text>
        </View>

        {/* Address List */}
        {addresses.length > 0 ? (
          addresses.map(renderAddressCard)
        ) : (
          <View className="items-center bg-white rounded-2xl p-10">
            <Ionicons
              name="location-outline"
              size={64}
              color="#E5E5EA"
            />
            <Text className="text-lg font-bold text-black mt-4 mb-2">
              No Addresses Yet
            </Text>
            <Text className="text-base text-[#8E8E93] text-center">
              Add a shipping address to get started
            </Text>
          </View>
        )}

        {/* Add New Button */}
        <TouchableOpacity
          onPress={handleAddNewAddress}
          className="flex-row items-center justify-center bg-white border-2 border-dashed border-[#FFC000] rounded-2xl p-5 mt-5"
        >
          <Ionicons
            name="add-circle"
            size={24}
            color="#FFC000"
          />
          <Text className="ml-3 text-lg font-semibold text-black">
            Add New Address
          </Text>
        </TouchableOpacity>

        {/* Tips */}
        <View className="bg-white rounded-2xl p-5 mt-6 shadow-sm">
          <Text className="text-lg font-bold text-black mb-4">
            Shipping Tips
          </Text>

          {[
            'Ensure your address is correct to avoid delivery delays',
            'Add multiple addresses for home, office, or warehouse',
            'Set a default address for faster checkout',
          ].map((tip, i) => (
            <View key={i} className="flex-row items-start mb-3">
              <Ionicons
                name="checkmark-circle"
                size={18}
                color="#34C759"
              />
              <Text className="ml-3 text-sm text-[#6C757D] leading-5 flex-1">
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
