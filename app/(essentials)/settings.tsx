import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const router = useRouter();

  const [settings, setSettings] = useState({
    autoUpdate: true,
    saveLogin: true,
    dataSaver: false,
    clearCache: false,
    analytics: true,
    crashReports: true,
    language: 'English',
    currency: 'USD',
    region: 'United States',
  });

  const handleToggleSetting = (setting: string) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof settings],
    }));
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will remove temporary files and free up storage space. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () =>
            Alert.alert('Success', 'Cache cleared successfully.'),
        },
      ]
    );
  };

  const handleResetSettings = () => {
    Alert.alert(
      'Reset Settings',
      'This will reset all settings to their default values. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () =>
            setSettings({
              autoUpdate: true,
              saveLogin: true,
              dataSaver: false,
              clearCache: false,
              analytics: true,
              crashReports: true,
              language: 'English',
              currency: 'USD',
              region: 'United States',
            }),
        },
      ]
    );
  };

  const appSettings = [
    {
      id: 'general',
      title: 'General',
      items: [
        { id: 'language', title: 'Language', value: settings.language, icon: 'language', color: '#007AFF' },
        { id: 'currency', title: 'Currency', value: settings.currency, icon: 'cash', color: '#FFC000' },
        { id: 'region', title: 'Region', value: settings.region, icon: 'earth', color: '#34C759' },
      ],
    },
    {
      id: 'app',
      title: 'App Settings',
      items: [
        { id: 'autoUpdate', title: 'Auto Update', value: settings.autoUpdate, icon: 'cloud-download', color: '#5856D6' },
        { id: 'saveLogin', title: 'Save Login', value: settings.saveLogin, icon: 'key', color: '#FF9500' },
        { id: 'dataSaver', title: 'Data Saver', value: settings.dataSaver, icon: 'cellular', color: '#32D74B' },
      ],
    },
    {
      id: 'privacy',
      title: 'Privacy',
      items: [
        { id: 'analytics', title: 'Analytics', value: settings.analytics, icon: 'analytics', color: '#BF5AF2' },
        { id: 'crashReports', title: 'Crash Reports', value: settings.crashReports, icon: 'bug', color: '#FF453A' },
      ],
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top', 'bottom', 'left', 'right']}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 bg-white border-b border-[#E9ECEF]">
        <TouchableOpacity onPress={() => router.back()} className="p-1 mr-3">
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-xl font-semibold text-black">Settings</Text>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16 }}
      >
        {/* App Info */}
        <View className="bg-white rounded-2xl p-5 mb-4 flex-row items-center shadow-sm">
          <View className="w-16 h-16 rounded-xl bg-[#FFF8E6] items-center justify-center mr-4">
            <Ionicons name="cube" size={32} color="#FFC000" />
          </View>
          <View className="flex-1">
            <Text className="text-2xl font-bold text-black">Oneminers</Text>
            <Text className="text-sm text-[#8E8E93] mt-1">
              Version 1.2.4 (Build 124)
            </Text>
            <Text className="text-sm text-[#6C757D]">
              Mining Equipment Marketplace
            </Text>
          </View>
        </View>

        {/* Sections */}
        {appSettings.map(section => (
          <View key={section.id} className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
            <Text className="text-lg font-bold text-black mb-4">
              {section.title}
            </Text>

            {section.items.map(item => (
              <View
                key={item.id}
                className="flex-row justify-between items-center py-4 border-b border-[#F2F2F7]"
              >
                <View className="flex-row items-center flex-1">
                  <View
                    className="w-8 h-8 rounded-lg items-center justify-center mr-3"
                    style={{ backgroundColor: `${item.color}20` }}
                  >
                    <Ionicons name={item.icon as any} size={20} color={item.color} />
                  </View>
                  <Text className="text-base font-medium text-black">
                    {item.title}
                  </Text>
                </View>

                {typeof item.value === 'boolean' ? (
                  <Switch
                    value={item.value}
                    onValueChange={() => handleToggleSetting(item.id)}
                    trackColor={{ false: '#F2F2F7', true: item.color }}
                    thumbColor="#FFFFFF"
                  />
                ) : (
                  <View className="flex-row items-center">
                    <Text className="text-sm text-[#8E8E93] mr-2">
                      {item.value}
                    </Text>
                    <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
                  </View>
                )}
              </View>
            ))}
          </View>
        ))}

        {/* Storage */}
        <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
          <Text className="text-lg font-bold text-black mb-4">Storage</Text>

          <View className="h-2 bg-[#F2F2F7] rounded-full mb-2 overflow-hidden">
            <View className="h-full bg-[#FFC000] w-[35%] rounded-full" />
          </View>

          <Text className="text-sm text-[#8E8E93] mb-4">
            2.1 GB of 6 GB used
          </Text>

          <TouchableOpacity
            onPress={handleClearCache}
            className="flex-row items-center bg-[#FFF8E6] px-4 py-3 rounded-xl self-start"
          >
            <Ionicons name="trash-outline" size={20} color="#FFC000" />
            <Text className="ml-2 font-semibold text-black">
              Clear Cache
            </Text>
          </TouchableOpacity>
        </View>

        {/* Reset */}
        <TouchableOpacity
          onPress={handleResetSettings}
          className="bg-white rounded-2xl p-5 mb-4 flex-row items-center justify-center shadow-sm"
        >
          <Ionicons name="refresh" size={20} color="#FF9500" />
          <Text className="ml-3 text-base font-semibold text-[#FF9500]">
            Reset All Settings
          </Text>
        </TouchableOpacity>

        {/* Developer Info */}
        <View className="items-center py-6">
          <Text className="text-base font-semibold text-black mb-2">
            Developer Information
          </Text>
          <Text className="text-sm text-[#8E8E93]">
            Oneminers Technologies Inc.
          </Text>
          <Text className="text-sm text-[#8E8E93]">
            © 2024 All rights reserved
          </Text>
          <Text className="text-xs text-[#C7C7CC] mt-2">
            Build: 124 • API: v2.1
          </Text>
        </View>

        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
