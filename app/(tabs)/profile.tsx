import { View, Text, ScrollView, TouchableOpacity, Switch, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  const [isDarkModeEnabled, setIsDarkModeEnabled] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(false);
    Alert.alert('Logged Out', 'You have been successfully logged out.');
    router.replace('/login');
  };

  const userInfo = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    joinDate: 'January 2024',
    miningLevel: 'Advanced Miner',
    memberSince: 'Member since January 2024',
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top', 'bottom', 'left', 'right']}>
      {/* Header */}
      <View className="py-4 px-5 border-b border-gray-200">
        <Text className="text-xl font-bold text-black">Profile</Text>
      </View>

      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        {/* User Information Card */}
        <View className="bg-white rounded-2xl p-5 mb-5">
          <View className="flex-row items-start">
            <View className="mr-4">
              <View className="w-[70px] h-[70px] rounded-full bg-[#FFC000] justify-center items-center">
                <Text className="text-2xl font-bold text-black">JD</Text>
              </View>
            </View>
            
            <View className="flex-1 justify-center">
              <Text className="text-xl font-bold text-black mb-1">{userInfo.name}</Text>
              <Text className="text-[15px] text-gray-400 mb-3">{userInfo.email}</Text>
              <TouchableOpacity className="flex-row items-center bg-[#FFF8E6] px-4 py-2 rounded-lg self-start">
                <Ionicons name="pencil" size={16} color="#8E8E93" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Account Section */}
        <View className="bg-white rounded-2xl p-4 mb-4">
          <Text className="text-base font-bold text-black mb-3">Account</Text>
          <View className="rounded-xl overflow-hidden">
            <Link href="/(essentials)/eprofile" asChild>
              <TouchableOpacity className="flex-row justify-between items-center py-3.5 px-3 bg-white border-b border-gray-100">
                <View className="flex-row items-center flex-1">
                  <View className="w-8 h-8 rounded-lg justify-center items-center mr-3 bg-[#FFC000]/20">
                    <Ionicons name="person-outline" size={20} color="#FFC000" />
                  </View>
                  <Text className="text-[15px] text-black font-medium">Edit Profile</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
              </TouchableOpacity>
            </Link>

            <Link href="/(essentials)/eshipping" asChild>
              <TouchableOpacity className="flex-row justify-between items-center py-3.5 px-3 bg-white border-b border-gray-100">
                <View className="flex-row items-center flex-1">
                  <View className="w-8 h-8 rounded-lg justify-center items-center mr-3 bg-[#34C759]/20">
                    <Ionicons name="location-outline" size={20} color="#34C759" />
                  </View>
                  <Text className="text-[15px] text-black font-medium">Shipping Addresses</Text>
                </View>
                <View className="flex-row items-center">
                  <Text className="bg-[#FFC000] text-black text-xs font-semibold px-2 py-0.5 rounded-[10px] mr-2 min-w-[24px] text-center">2</Text>
                  <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
                </View>
              </TouchableOpacity>
            </Link>
            
            <Link href="/(essentials)/security" asChild>
              <TouchableOpacity className="flex-row justify-between items-center py-3.5 px-3 bg-white border-b border-gray-100">
                <View className="flex-row items-center flex-1">
                  <View className="w-8 h-8 rounded-lg justify-center items-center mr-3 bg-[#007AFF]/20">
                    <Ionicons name="shield-checkmark-outline" size={20} color="#007AFF" />
                  </View>
                  <Text className="text-[15px] text-black font-medium">Security</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
              </TouchableOpacity>
            </Link>
            
            <Link href="/(essentials)/wallet-manager" asChild>
              <TouchableOpacity className="flex-row justify-between items-center py-3.5 px-3 bg-white">
                <View className="flex-row items-center flex-1">
                  <View className="w-8 h-8 rounded-lg justify-center items-center mr-3 bg-[#5856D6]/20">
                    <Ionicons name="wallet-outline" size={20} color="#5856D6" />
                  </View>
                  <Text className="text-[15px] text-black font-medium">Wallet Manager</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        {/* Mining Operations */}
        <View className="bg-white rounded-2xl p-4 mb-4">
          <Text className="text-base font-bold text-black mb-3">Mining Operations</Text>
          <View className="rounded-xl overflow-hidden">
            <Link href="/(shop)/orders" asChild>
              <TouchableOpacity className="flex-row justify-between items-center py-3.5 px-3 bg-white border-b border-gray-100">
                <View className="flex-row items-center flex-1">
                  <View className="w-8 h-8 rounded-lg justify-center items-center mr-3 bg-[#FF9500]/20">
                    <Ionicons name="cart-outline" size={20} color="#FF9500" />
                  </View>
                  <Text className="text-[15px] text-black font-medium">Orders</Text>
                </View>
                <View className="flex-row items-center">
                  <Text className="bg-[#FFC000] text-black text-xs font-semibold px-2 py-0.5 rounded-[10px] mr-2 min-w-[24px] text-center">12</Text>
                  <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
                </View>
              </TouchableOpacity>
            </Link>
            
            <Link href="/(essentials)/repairs" asChild>
              <TouchableOpacity className="flex-row justify-between items-center py-3.5 px-3 bg-white border-b border-gray-100">
                <View className="flex-row items-center flex-1">
                  <View className="w-8 h-8 rounded-lg justify-center items-center mr-3 bg-[#FF2D55]/20">
                    <Ionicons name="build-outline" size={20} color="#FF2D55" />
                  </View>
                  <Text className="text-[15px] text-black font-medium">Repairs</Text>
                </View>
                <View className="flex-row items-center">
                  <Text className="bg-[#FFC000] text-black text-xs font-semibold px-2 py-0.5 rounded-[10px] mr-2 min-w-[24px] text-center">3</Text>
                  <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
                </View>
              </TouchableOpacity>
            </Link>
            
            <Link href="/(essentials)/referral" asChild>
              <TouchableOpacity className="flex-row justify-between items-center py-3.5 px-3 bg-white">
                <View className="flex-row items-center flex-1">
                  <View className="w-8 h-8 rounded-lg justify-center items-center mr-3 bg-[#32D74B]/20">
                    <Ionicons name="people-outline" size={20} color="#32D74B" />
                  </View>
                  <Text className="text-[15px] text-black font-medium">Referrals</Text>
                </View>
                <View className="flex-row items-center">
                  <Text className="bg-[#FFC000] text-black text-xs font-semibold px-2 py-0.5 rounded-[10px] mr-2 min-w-[24px] text-center">8</Text>
                  <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
                </View>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        {/* Preferences */}
        <View className="bg-white rounded-2xl p-4 mb-4">
          <Text className="text-base font-bold text-black mb-3">Preferences</Text>
          <View className="rounded-xl overflow-hidden">
            <View className="flex-row justify-between items-center py-3.5 px-3 bg-white border-b border-gray-100">
              <View className="flex-row items-center flex-1">
                <View className="w-8 h-8 rounded-lg justify-center items-center mr-3 bg-[#007AFF]/20">
                  <Ionicons name="notifications-outline" size={20} color="#007AFF" />
                </View>
                <Text className="text-[15px] text-black font-medium">Notifications</Text>
              </View>
              <Switch
                value={isNotificationsEnabled}
                onValueChange={setIsNotificationsEnabled}
                trackColor={{ false: '#F2F2F7', true: '#007AFF' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View className="flex-row justify-between items-center py-3.5 px-3 bg-white border-b border-gray-100">
              <View className="flex-row items-center flex-1">
                <View className="w-8 h-8 rounded-lg justify-center items-center mr-3 bg-[#4A4A4A]/20">
                  <Ionicons name="moon-outline" size={20} color="#4A4A4A" />
                </View>
                <Text className="text-[15px] text-black font-medium">Dark Mode</Text>
              </View>
              <Switch
                value={isDarkModeEnabled}
                onValueChange={setIsDarkModeEnabled}
                trackColor={{ false: '#F2F2F7', true: '#007AFF' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <Link href="/(essentials)/settings" asChild>
              <TouchableOpacity className="flex-row justify-between items-center py-3.5 px-3 bg-white">
                <View className="flex-row items-center flex-1">
                  <View className="w-8 h-8 rounded-lg justify-center items-center mr-3 bg-[#5856D6]/20">
                    <Ionicons name="settings-outline" size={20} color="#5856D6" />
                  </View>
                  <Text className="text-[15px] text-black font-medium">Settings</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        {/* Support */}
        <View className="bg-white rounded-2xl p-4 mb-4">
          <Text className="text-base font-bold text-black mb-3">Support</Text>
          <View className="rounded-xl overflow-hidden">
            <Link href="/(essentials)/support" asChild>
              <TouchableOpacity className="flex-row justify-between items-center py-3.5 px-3 bg-white border-b border-gray-100">
                <View className="flex-row items-center flex-1">
                  <View className="w-8 h-8 rounded-lg justify-center items-center mr-3 bg-[#32D74B]/20">
                    <Ionicons name="headset-outline" size={20} color="#32D74B" />
                  </View>
                  <Text className="text-[15px] text-black font-medium">Customer Support</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
              </TouchableOpacity>
            </Link>

            <Link href="/(essentials)/terms" asChild>
              <TouchableOpacity className="flex-row justify-between items-center py-3.5 px-3 bg-white">
                <View className="flex-row items-center flex-1">
                  <View className="w-8 h-8 rounded-lg justify-center items-center mr-3 bg-[#BF5AF2]/20">
                    <Ionicons name="document-text-outline" size={20} color="#BF5AF2" />
                  </View>
                  <Text className="text-[15px] text-black font-medium">Terms & Privacy</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity 
          className="bg-white rounded-2xl p-4 mb-5"
          onPress={() => setShowLogoutModal(true)}
        >
          <View className="flex-row items-center flex-1">
            <View className="w-8 h-8 rounded-lg justify-center items-center mr-3 bg-[#FF453A]/20">
              <Ionicons name="log-out-outline" size={20} color="#FF453A" />
            </View>
            <Text className="text-[15px] text-[#FF3B30] font-medium">Logout</Text>
          </View>
        </TouchableOpacity>

        {/* App Version */}
        <View className="items-center pb-[30px]">
          <Text className="text-[13px] text-gray-400">Oneminers v1.2.4</Text>
        </View>
      </ScrollView>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={showLogoutModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center p-5">
          <View className="bg-white rounded-[20px] p-6 w-full max-w-[340px] items-center">
            <View className="w-20 h-20 rounded-full bg-[#FFF8E6] justify-center items-center mb-4">
              <Ionicons name="log-out" size={48} color="#FFC000" />
            </View>
            
            <Text className="text-2xl font-bold text-black mb-3">Logout</Text>
            <Text className="text-base text-gray-600 text-center mb-6 leading-[22px]">
              Are you sure you want to logout from your account?
            </Text>
            
            <View className="flex-row gap-3 w-full">
              <TouchableOpacity 
                className="flex-1 py-4 rounded-xl items-center bg-gray-50 border border-gray-200"
                onPress={() => setShowLogoutModal(false)}
              >
                <Text className="text-base font-semibold text-gray-600">Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="flex-1 py-4 rounded-xl items-center bg-[#FFC000]"
                onPress={handleLogout}
              >
                <Text className="text-base font-bold text-black">Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

