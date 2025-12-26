import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function SecurityScreen() {
  const router = useRouter();

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: true,
    biometricLogin: true,
    autoLogout: true,
    autoLogoutMinutes: 15,
    sessionAlerts: true,
    loginAlerts: true,
  });

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Missing Information', 'Please fill in all password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long.');
      return;
    }

    Alert.alert('Password Changed', 'Your password has been successfully updated.', [
      {
        text: 'OK',
        onPress: () => {
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
        },
      },
    ]);
  };

  const handleToggleSetting = (setting: keyof typeof securitySettings) => {
    setSecuritySettings(prev => ({ ...prev, [setting]: !prev[setting] }));
  };

  const handleAutoLogoutChange = (value: string) => {
    const minutes = parseInt(value) || 15;
    setSecuritySettings(prev => ({
      ...prev,
      autoLogoutMinutes: Math.min(Math.max(minutes, 1), 60),
    }));
  };

  const securityFeatures = [
    {
      id: 'twoFactor',
      title: 'Two-Factor Authentication',
      description: 'Add an extra layer of security to your account',
      icon: 'shield-checkmark',
      color: '#FFC000',
    },
    {
      id: 'biometric',
      title: 'Biometric Login',
      description: 'Use fingerprint or face ID to log in',
      icon: 'finger-print-outline',
      color: '#34C759',
    },
    {
      id: 'session',
      title: 'Session Management',
      description: 'Manage active sessions and devices',
      icon: 'phone-portrait-sharp',
      color: '#007AFF',
    },
    {
      id: 'recovery',
      title: 'Account Recovery',
      description: 'Set up recovery options for your account',
      icon: 'key',
      color: '#5856D6',
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FA]" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 bg-white border-b border-[#E9ECEF]">
        <TouchableOpacity onPress={() => router.back()} className="p-1 mr-3">
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-xl font-semibold text-black">Security</Text>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16 }}
      >
        {/* Security Score */}
        <View className="bg-white rounded-2xl p-5 mb-4">
          <View className="flex-row items-center mb-4">
            <MaterialCommunityIcons name="shield-lock" size={24} color="#FFC000" />
            <Text className="text-lg font-bold text-black ml-3">
              Security Score
            </Text>
          </View>

          <View className="h-2 bg-[#F2F2F7] rounded-full mb-3 overflow-hidden">
            <View className="h-full bg-[#FFC000] rounded-full w-[85%]" />
          </View>

          <Text className="text-base font-bold text-black mb-1">
            85% - Excellent
          </Text>
          <Text className="text-sm text-[#8E8E93]">
            Your account is well protected
          </Text>
        </View>

        {/* Change Password */}
        <View className="bg-white rounded-2xl p-5 mb-4">
          <Text className="text-lg font-bold text-black mb-5">
            Change Password
          </Text>

          <View className="mb-5">
            <Text className="text-sm font-medium text-[#6C757D] mb-2">
              Current Password
            </Text>
            <TextInput
              className="bg-[#F8F9FA] border border-[#E9ECEF] rounded-xl px-4 py-3.5 text-base"
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="Enter current password"
            />
          </View>

          <View className="mb-5">
            <Text className="text-sm font-medium text-[#6C757D] mb-2">
              New Password
            </Text>
            <TextInput
              className="bg-[#F8F9FA] border border-[#E9ECEF] rounded-xl px-4 py-3.5 text-base"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Enter new password"
            />
            <Text className="text-xs text-[#8E8E93] mt-2">
              Use at least 8 characters with letters, numbers, and symbols
            </Text>
          </View>

          <View className="mb-6">
            <Text className="text-sm font-medium text-[#6C757D] mb-2">
              Confirm New Password
            </Text>
            <TextInput
              className="bg-[#F8F9FA] border border-[#E9ECEF] rounded-xl px-4 py-3.5 text-base"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm new password"
            />
          </View>

          <TouchableOpacity
            onPress={handleChangePassword}
            className="bg-[#FFC000] rounded-xl py-4 items-center"
          >
            <Text className="text-base font-bold text-black">
              Change Password
            </Text>
          </TouchableOpacity>
        </View>

        {/* Security Features */}
        <View className="bg-white rounded-2xl p-5 mb-4">
          <Text className="text-lg font-bold text-black mb-4">
            Security Features
          </Text>

          {securityFeatures.map(feature => (
            <TouchableOpacity
              key={feature.id}
              className="flex-row items-center py-4 border-b border-[#F2F2F7]"
            >
              <View
                className="w-11 h-11 rounded-xl items-center justify-center mr-3"
                style={{ backgroundColor: `${feature.color}20` }}
              >
                <Ionicons
                  name={feature.icon as any}
                  size={22}
                  color={feature.color}
                />
              </View>

              <View className="flex-1">
                <Text className="text-base font-semibold text-black mb-0.5">
                  {feature.title}
                </Text>
                <Text className="text-sm text-[#8E8E93]">
                  {feature.description}
                </Text>
              </View>

              <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Security Settings */}
        <View className="bg-white rounded-2xl p-5 mb-4">
          <Text className="text-lg font-bold text-black mb-4">
            Security Settings
          </Text>

          {/* 2FA */}
          <View className="flex-row justify-between items-center py-4 border-b border-[#F2F2F7]">
            <View className="flex-row items-center flex-1">
              <Ionicons name="shield-checkmark" size={22} color="#FFC000" />
              <View className="ml-3 flex-1">
                <Text className="text-base font-medium text-black">
                  Two-Factor Authentication
                </Text>
                <Text className="text-sm text-[#8E8E93]">
                  Requires a code from your authenticator app
                </Text>
              </View>
            </View>
            <Switch
              value={securitySettings.twoFactorEnabled}
              onValueChange={() => handleToggleSetting('twoFactorEnabled')}
              trackColor={{ false: '#F2F2F7', true: '#FFC000' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Biometric */}
          <View className="flex-row justify-between items-center py-4 border-b border-[#F2F2F7]">
            <View className="flex-row items-center flex-1">
              <Ionicons name="finger-print-outline" size={22} color="#FFC000" />
              <View className="ml-3 flex-1">
                <Text className="text-base font-medium text-black">
                  Biometric Login
                </Text>
                <Text className="text-sm text-[#8E8E93]">
                  Use fingerprint or face recognition
                </Text>
              </View>
            </View>
            <Switch
              value={securitySettings.biometricLogin}
              onValueChange={() => handleToggleSetting('biometricLogin')}
              trackColor={{ false: '#F2F2F7', true: '#FFC000' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Auto Logout */}
          <View className="flex-row justify-between items-center py-4 border-b border-[#F2F2F7]">
            <View className="flex-row items-center flex-1">
              <Ionicons name="timer-outline" size={22} color="#FFC000" />
              <View className="ml-3 flex-1">
                <Text className="text-base font-medium text-black">
                  Auto Logout
                </Text>
                <Text className="text-sm text-[#8E8E93]">
                  Log out after inactivity
                </Text>
              </View>
            </View>

            <View className="flex-row items-center">
              <TextInput
                className="bg-[#F8F9FA] border border-[#E9ECEF] rounded-lg px-2 py-1 text-sm w-10 text-center mr-2"
                keyboardType="numeric"
                maxLength={2}
                value={securitySettings.autoLogoutMinutes.toString()}
                onChangeText={handleAutoLogoutChange}
              />
              <Text className="text-sm text-[#8E8E93]">minutes</Text>
            </View>
          </View>

          {/* Login Alerts */}
          <View className="flex-row justify-between items-center py-4">
            <View className="flex-row items-center flex-1">
              <Ionicons name="notifications-outline" size={22} color="#FFC000" />
              <View className="ml-3 flex-1">
                <Text className="text-base font-medium text-black">
                  Login Alerts
                </Text>
                <Text className="text-sm text-[#8E8E93]">
                  Get notified of new logins
                </Text>
              </View>
            </View>
            <Switch
              value={securitySettings.loginAlerts}
              onValueChange={() => handleToggleSetting('loginAlerts')}
              trackColor={{ false: '#F2F2F7', true: '#FFC000' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Active Sessions */}
        <View className="bg-white rounded-2xl p-5 mb-4">
          <Text className="text-lg font-bold text-black mb-4">
            Active Sessions
          </Text>

          <View className="flex-row justify-between items-center py-4 border-b border-[#F2F2F7]">
            <View className="flex-row items-center flex-1">
              <Ionicons name="phone-portrait" size={24} color="#FFC000" />
              <View className="ml-3 flex-1">
                <Text className="text-base font-semibold text-black">
                  iPhone 14 Pro
                </Text>
                <Text className="text-sm text-[#8E8E93]">
                  San Francisco, USA • Current
                </Text>
                <Text className="text-xs text-[#C7C7CC]">
                  Last active: Just now
                </Text>
              </View>
            </View>
            <TouchableOpacity className="bg-[#F8F9FA] px-3 py-1.5 rounded-lg">
              <Text className="text-sm font-medium text-red-500">
                Logout
              </Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-between items-center py-4">
            <View className="flex-row items-center flex-1">
              <Ionicons name="laptop" size={24} color="#007AFF" />
              <View className="ml-3 flex-1">
                <Text className="text-base font-semibold text-black">
                  MacBook Pro
                </Text>
                <Text className="text-sm text-[#8E8E93]">
                  San Jose, USA
                </Text>
                <Text className="text-xs text-[#C7C7CC]">
                  Last active: 2 hours ago
                </Text>
              </View>
            </View>
            <TouchableOpacity className="bg-[#F8F9FA] px-3 py-1.5 rounded-lg">
              <Text className="text-sm font-medium text-red-500">
                Logout
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity className="flex-row items-center justify-center py-3">
            <Text className="text-base font-medium text-[#007AFF] mr-1">
              View All Sessions
            </Text>
            <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
          </TouchableOpacity>
        </View>

        {/* Security Tips */}
        <View className="bg-white rounded-2xl p-5 mb-6">
          <Text className="text-lg font-bold text-black mb-4">
            Security Tips
          </Text>

          {[
            'Use a unique password for your Oneminers account',
            'Enable two-factor authentication for extra security',
            'Never share your password or 2FA codes with anyone',
            'Log out from shared or public computers',
          ].map((tip, idx) => (
            <View key={idx} className="flex-row items-start mb-3">
              <Ionicons name="checkmark-circle" size={18} color="#34C759" />
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
