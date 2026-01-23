import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';

const COLORS = {
  accent: '#FFC000',
  text: '#111827',
  subtext: '#6B7280',
  border: '#E5E7EB',
  bg: '#F9FAFB',
  danger: '#FF3B30',
};

export default function ProfileScreen() {
  const router = useRouter();

  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  const [isDarkModeEnabled, setIsDarkModeEnabled] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const userInfo = useMemo(
    () => ({
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      joinDate: 'January 2024',
      miningLevel: 'Advanced Miner',
      memberSince: 'Member since January 2024',
    }),
    []
  );

  const initials =
    userInfo.name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((s) => s[0]?.toUpperCase())
      .join('') || 'U';

  const handleLogout = () => {
    setShowLogoutModal(false);
    router.replace('/login');
  };

  const Row = ({
    title,
    leftIcon,
    leftBg,
    leftColor,
    onPress,
    isLast,
    danger,
    badge,
    right,
  }: {
    title: string;
    leftIcon: any;
    leftBg: string;
    leftColor: string;
    onPress?: () => void;
    isLast?: boolean;
    danger?: boolean;
    badge?: string;
    right?: React.ReactNode;
  }) => (
    <TouchableOpacity
      activeOpacity={onPress ? 0.85 : 1}
      onPress={onPress}
      disabled={!onPress}
      className={[
        'flex-row justify-between items-center py-3.5 px-3 bg-white',
        !isLast ? 'border-b border-gray-100' : '',
      ].join(' ')}
    >
      <View className="flex-row items-center flex-1">
        <View className={`w-9 h-9 rounded-xl items-center justify-center mr-3 ${leftBg}`}>
          <Ionicons name={leftIcon} size={20} color={leftColor} />
        </View>

        <Text
          className={[
            'text-[15px] font-medium',
            danger ? 'text-[#FF3B30]' : 'text-[#111827]',
          ].join(' ')}
          numberOfLines={1}
        >
          {title}
        </Text>
      </View>

      <View className="flex-row items-center">
        {badge ? (
          <Text className="text-xs font-semibold px-2 py-0.5 rounded-[10px] mr-2 min-w-[24px] text-center bg-[#FFC000] text-black">
            {badge}
          </Text>
        ) : null}

        {right}

        {onPress ? <Ionicons name="chevron-forward" size={18} color="#C7C7CC" /> : null}
      </View>
    </TouchableOpacity>
  );

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View className="bg-white rounded-2xl p-4 mb-4">
      <Text className="text-base font-bold mb-3 text-[#111827]">{title}</Text>
      <View className="rounded-xl overflow-hidden">{children}</View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]" edges={['top', 'bottom', 'left', 'right']}>
      {/* Header */}
      <View className="py-3 px-5 border-b border-[#E5E7EB] flex-row items-center h-[60px] ">
        <Text className="text-xl font-bold text-[#111827]">Profile</Text>
      </View>

      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        {/* User Card (no shadows) */}
        <View className="rounded-2xl p-5 mb-5 bg-white">
          <View className="flex-row items-center">
            <View className="w-[66px] h-[66px] rounded-full items-center justify-center mr-4 bg-[#FFC000]/20">
              <View className="w-[54px] h-[54px] rounded-full items-center justify-center bg-[#FFC000]">
                <Text className="text-xl font-bold text-black">{initials}</Text>
              </View>
            </View>

            <View className="flex-1">
              <Text className="text-xl font-bold mb-1 text-[#111827]" numberOfLines={1}>
                {userInfo.name}
              </Text>
              <Text className="text-[14px] mb-2 text-[#6B7280]" numberOfLines={1}>
                {userInfo.email}
              </Text>

              <View className="flex-row flex-wrap items-center">
                <View className="flex-row items-center px-3 py-1 rounded-full mr-2 mb-2 bg-[#FFC000]/10">
                  <Ionicons name="shield-checkmark-outline" size={14} color={COLORS.text} />
                  <Text className="text-xs font-semibold ml-1 text-[#111827]">
                    {userInfo.miningLevel}
                  </Text>
                </View>

                <View className="flex-row items-center px-3 py-1 rounded-full mr-2 mb-2 bg-gray-100">
                  <Ionicons name="calendar-outline" size={14} color={COLORS.text} />
                  <Text className="text-xs font-semibold ml-1 text-[#111827]">
                    {userInfo.joinDate}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Info rows */}
          <View className="mt-4 pt-4 border-t border-[#E5E7EB]">
            <View className="flex-row justify-between">
              <Text className="text-sm text-[#6B7280]">Phone</Text>
              <Text className="text-sm font-semibold text-[#111827]">{userInfo.phone}</Text>
            </View>

            <View className="flex-row justify-between mt-2">
              <Text className="text-sm text-[#6B7280]">Status</Text>
              <Text className="text-sm font-semibold text-[#111827]">{userInfo.memberSince}</Text>
            </View>
          </View>
        </View>

        {/* Account */}
        <Section title="Account">
          <Link href="/(essentials)/eprofile" asChild>
            <View>
              <Row
                title="Edit Profile"
                leftIcon="person-outline"
                leftBg="bg-[#FFC000]/10"
                leftColor={COLORS.accent}
                onPress={() => router.push('/(essentials)/eprofile')}
              />
            </View>
          </Link>

          <Link href="/(essentials)/eshipping" asChild>
            <View>
              <Row
                title="Shipping Addresses"
                leftIcon="location-outline"
                leftBg="bg-[#34C759]/10"
                leftColor="#34C759"
                badge="2"
                onPress={() => router.push('/(essentials)/eshipping')}
              />
            </View>
          </Link>

          <Link href="/(essentials)/security" asChild>
            <View>
              <Row
                title="Security"
                leftIcon="shield-checkmark-outline"
                leftBg="bg-[#007AFF]/10"
                leftColor="#007AFF"
                onPress={() => router.push('/(essentials)/security')}
              />
            </View>
          </Link>

          <Link href="/(essentials)/wallet-manager" asChild>
            <View>
              <Row
                title="Wallet Manager"
                leftIcon="wallet-outline"
                leftBg="bg-[#5856D6]/10"
                leftColor="#5856D6"
                isLast
                onPress={() => router.push('/(essentials)/wallet-manager')}
              />
            </View>
          </Link>
        </Section>

        {/* Mining Operations */}
        <Section title="Mining Operations">
          <Link href="/(shop)/orders" asChild>
            <View>
              <Row
                title="Orders"
                leftIcon="cart-outline"
                leftBg="bg-[#FF9500]/10"
                leftColor="#FF9500"
                badge="12"
                onPress={() => router.push('/(shop)/orders')}
              />
            </View>
          </Link>

          <Link href="/(essentials)/repairs" asChild>
            <View>
              <Row
                title="Repairs"
                leftIcon="build-outline"
                leftBg="bg-[#FF2D55]/10"
                leftColor="#FF2D55"
                badge="3"
                onPress={() => router.push('/(essentials)/repairs')}
              />
            </View>
          </Link>

          <Link href="/(essentials)/referral" asChild>
            <View>
              <Row
                title="Referrals"
                leftIcon="people-outline"
                leftBg="bg-[#32D74B]/10"
                leftColor="#32D74B"
                badge="8"
                isLast
                onPress={() => router.push('/(essentials)/referral')}
              />
            </View>
          </Link>
        </Section>

        {/* Preferences */}
        <View className="bg-white rounded-2xl p-4 mb-4">
          <Text className="text-base font-bold mb-3 text-[#111827]">Preferences</Text>

          <View className="rounded-xl overflow-hidden">
            <View className="flex-row justify-between items-center py-3.5 px-3 bg-white border-b border-gray-100">
              <View className="flex-row items-center flex-1">
                <View className="w-9 h-9 rounded-xl items-center justify-center mr-3 bg-[#007AFF]/10">
                  <Ionicons name="notifications-outline" size={20} color="#007AFF" />
                </View>
                <Text className="text-[15px] text-[#111827] font-medium">Notifications</Text>
              </View>

              <Switch
                value={isNotificationsEnabled}
                onValueChange={setIsNotificationsEnabled}
                trackColor={{ false: '#F2F2F7', true: COLORS.accent }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View className="flex-row justify-between items-center py-3.5 px-3 bg-white border-b border-gray-100">
              <View className="flex-row items-center flex-1">
                <View className="w-9 h-9 rounded-xl items-center justify-center mr-3 bg-[#111827]/10">
                  <Ionicons name="moon-outline" size={20} color="#111827" />
                </View>
                <Text className="text-[15px] text-[#111827] font-medium">Dark Mode</Text>
              </View>

              <Switch
                value={isDarkModeEnabled}
                onValueChange={setIsDarkModeEnabled}
                trackColor={{ false: '#F2F2F7', true: COLORS.accent }}
                thumbColor="#FFFFFF"
              />
            </View>

            <Link href="/(essentials)/settings" asChild>
              <View>
                <Row
                  title="Settings"
                  leftIcon="settings-outline"
                  leftBg="bg-[#5856D6]/10"
                  leftColor="#5856D6"
                  isLast
                  onPress={() => router.push('/(essentials)/settings')}
                />
              </View>
            </Link>
          </View>
        </View>

        {/* Support */}
        <Section title="Support">
          <Link href="/(essentials)/support" asChild>
            <View>
              <Row
                title="Customer Support"
                leftIcon="headset-outline"
                leftBg="bg-[#32D74B]/10"
                leftColor="#32D74B"
                onPress={() => router.push('/(essentials)/support')}
              />
            </View>
          </Link>

          <Link href="/(essentials)/terms" asChild>
            <View>
              <Row
                title="Terms & Privacy"
                leftIcon="document-text-outline"
                leftBg="bg-[#BF5AF2]/10"
                leftColor="#BF5AF2"
                isLast
                onPress={() => router.push('/(essentials)/terms')}
              />
            </View>
          </Link>
        </Section>

        {/* Logout */}
        <TouchableOpacity
          activeOpacity={0.9}
          className="rounded-2xl p-4 mb-5 bg-white"
          onPress={() => setShowLogoutModal(true)}
        >
          <View className="flex-row items-center">
            <View className="w-9 h-9 rounded-xl items-center justify-center mr-3 bg-[#FF3B30]/10">
              <Ionicons name="log-out-outline" size={20} color={COLORS.danger} />
            </View>
            <Text className="text-[15px] font-medium text-[#FF3B30]">Logout</Text>
          </View>
        </TouchableOpacity>

        {/* Version */}
        <View className="items-center pb-[30px]">
          <Text className="text-[13px] text-[#6B7280]">Oneminers v1.2.4</Text>
        </View>
      </ScrollView>

      {/* Logout Modal */}
      <Modal
        visible={showLogoutModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center p-5">
          <View className="bg-white rounded-[20px] p-6 w-full max-w-[340px] items-center border border-[#E5E7EB]">
            <View className="w-20 h-20 rounded-full justify-center items-center mb-4 bg-[#FFC000]/10">
              <Ionicons name="log-out" size={44} color={COLORS.accent} />
            </View>

            <Text className="text-2xl font-bold mb-3 text-[#111827]">Logout</Text>

            <Text className="text-base text-center mb-6 leading-[22px] text-[#6B7280]">
              Are you sure you want to logout from your account?
            </Text>

            <View className="flex-row gap-3 w-full">
              <TouchableOpacity
                activeOpacity={0.9}
                className="flex-1 py-4 rounded-xl items-center border border-[#E5E7EB] bg-[#F9FAFB]"
                onPress={() => setShowLogoutModal(false)}
              >
                <Text className="text-base font-semibold text-[#6B7280]">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.9}
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
