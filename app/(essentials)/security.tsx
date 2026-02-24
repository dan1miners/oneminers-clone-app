import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { APP_COLORS } from "../../constants/colors";
import { useAppTheme } from "../../providers/theme-provider";

export default function SecurityScreen() {
  const { colors: themeColors } = useAppTheme();
  const router = useRouter();

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: true,
    biometricLogin: true,
    autoLogout: true,
    autoLogoutMinutes: 15,
    sessionAlerts: true,
    loginAlerts: true,
  });

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Missing Information", "Please fill in all password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters long.");
      return;
    }

    Alert.alert(
      "Password Changed",
      "Your password has been successfully updated.",
      [
        {
          text: "OK",
          onPress: () => {
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
          },
        },
      ],
    );
  };

  const handleToggleSetting = (setting: keyof typeof securitySettings) => {
    setSecuritySettings((prev) => ({ ...prev, [setting]: !prev[setting] }));
  };

  const handleAutoLogoutChange = (value: string) => {
    const minutes = parseInt(value) || 15;
    setSecuritySettings((prev) => ({
      ...prev,
      autoLogoutMinutes: Math.min(Math.max(minutes, 1), 60),
    }));
  };

  const securityFeatures = [
    {
      id: "twoFactor",
      title: "Two-Factor Authentication",
      description: "Add an extra layer of security to your account",
      icon: "shield-checkmark",
      color: APP_COLORS.accent,
    },
    {
      id: "biometric",
      title: "Biometric Login",
      description: "Use fingerprint or face ID to log in",
      icon: "finger-print-outline",
      color: APP_COLORS.success,
    },
    {
      id: "session",
      title: "Session Management",
      description: "Manage active sessions and devices",
      icon: "phone-portrait-sharp",
      color: APP_COLORS.info,
    },
    {
      id: "recovery",
      title: "Account Recovery",
      description: "Set up recovery options for your account",
      icon: "key",
      color: APP_COLORS.purple,
    },
  ];

  return (
    <SafeAreaView
      className="flex-1 bg-gray-50 dark:bg-slate-950"
      edges={["top", "bottom", "left", "right"]}
    >
      {/* Header */}
      <View className="py-3 px-5 border-b border-om-border dark:border-slate-700 flex-row items-center h-[60px] bg-white dark:bg-slate-900 ">
        <TouchableOpacity onPress={() => router.back()} className="p-1 mr-3">
          <Ionicons name="arrow-back" size={24} color={themeColors.text} />
        </TouchableOpacity>
        <Text className="text-xl font-semibold text-black dark:text-slate-100">
          Security
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16 }}
      >
        {/* Security Score */}
        <View className="bg-white dark:bg-slate-900 rounded-2xl p-5 mb-4">
          <View className="flex-row items-center mb-4">
            <MaterialCommunityIcons
              name="shield-lock"
              size={24}
              color={APP_COLORS.accent}
            />
            <Text className="text-lg font-bold text-black dark:text-slate-100 ml-3">
              Security Score
            </Text>
          </View>

          <View className="h-2 bg-om-surface rounded-full mb-3 overflow-hidden">
            <View className="h-full bg-om-accent rounded-full w-[85%]" />
          </View>

          <Text className="text-base font-bold text-black dark:text-slate-100 mb-1">
            85% - Excellent
          </Text>
          <Text className="text-sm text-om-muted dark:text-slate-400">
            Your account is well protected
          </Text>
        </View>

        {/* Change Password */}
        <View className="bg-white dark:bg-slate-900 rounded-2xl p-5 mb-4">
          <Text className="text-lg font-bold text-black dark:text-slate-100 mb-5">
            Change Password
          </Text>

          <View className="mb-5">
            <Text className="text-sm font-medium text-om-muted-2 dark:text-slate-400 mb-2">
              Current Password
            </Text>
            <TextInput
              className="bg-om-bg-soft dark:bg-slate-800 border border-om-border-soft dark:border-slate-700 rounded-xl px-4 py-3.5 text-base"
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="Enter current password"
            />
          </View>

          <View className="mb-5">
            <Text className="text-sm font-medium text-om-muted-2 dark:text-slate-400 mb-2">
              New Password
            </Text>
            <TextInput
              className="bg-om-bg-soft dark:bg-slate-800 border border-om-border-soft dark:border-slate-700 rounded-xl px-4 py-3.5 text-base"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Enter new password"
            />
            <Text className="text-xs text-om-muted dark:text-slate-400 mt-2">
              Use at least 8 characters with letters, numbers, and symbols
            </Text>
          </View>

          <View className="mb-6">
            <Text className="text-sm font-medium text-om-muted-2 dark:text-slate-400 mb-2">
              Confirm New Password
            </Text>
            <TextInput
              className="bg-om-bg-soft dark:bg-slate-800 border border-om-border-soft dark:border-slate-700 rounded-xl px-4 py-3.5 text-base"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm new password"
            />
          </View>

          <TouchableOpacity
            onPress={handleChangePassword}
            className="bg-om-accent rounded-xl py-4 items-center"
          >
            <Text className="text-base font-bold text-white">
              Change Password
            </Text>
          </TouchableOpacity>
        </View>

        {/* Security Features */}
        <View className="bg-white dark:bg-slate-900 rounded-2xl p-5 mb-4">
          <Text className="text-lg font-bold text-black dark:text-slate-100 mb-4">
            Security Features
          </Text>

          {securityFeatures.map((feature) => (
            <TouchableOpacity
              key={feature.id}
              className="flex-row items-center py-4 border-b border-om-surface dark:border-slate-700"
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
                <Text className="text-base font-semibold text-black dark:text-slate-100 mb-0.5">
                  {feature.title}
                </Text>
                <Text className="text-sm text-om-muted dark:text-slate-400">
                  {feature.description}
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={18}
                color={APP_COLORS.lightGray}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Security Settings */}
        <View className="bg-white dark:bg-slate-900 rounded-2xl p-5 mb-4">
          <Text className="text-lg font-bold text-black dark:text-slate-100 mb-4">
            Security Settings
          </Text>

          {/* 2FA */}
          <View className="flex-row justify-between items-center py-4 border-b border-om-surface dark:border-slate-700">
            <View className="flex-row items-center flex-1">
              <Ionicons
                name="shield-checkmark"
                size={22}
                color={APP_COLORS.accent}
              />
              <View className="ml-3 flex-1">
                <Text className="text-base font-medium text-black dark:text-slate-100">
                  Two-Factor Authentication
                </Text>
                <Text className="text-sm text-om-muted dark:text-slate-400">
                  Requires a code from your authenticator app
                </Text>
              </View>
            </View>
            <Switch
              value={securitySettings.twoFactorEnabled}
              onValueChange={() => handleToggleSetting("twoFactorEnabled")}
              trackColor={{
                false: APP_COLORS.surface,
                true: APP_COLORS.accent,
              }}
              thumbColor={APP_COLORS.white}
            />
          </View>

          {/* Biometric */}
          <View className="flex-row justify-between items-center py-4 border-b border-om-surface dark:border-slate-700">
            <View className="flex-row items-center flex-1">
              <Ionicons
                name="finger-print-outline"
                size={22}
                color={APP_COLORS.accent}
              />
              <View className="ml-3 flex-1">
                <Text className="text-base font-medium text-black dark:text-slate-100">
                  Biometric Login
                </Text>
                <Text className="text-sm text-om-muted dark:text-slate-400">
                  Use fingerprint or face recognition
                </Text>
              </View>
            </View>
            <Switch
              value={securitySettings.biometricLogin}
              onValueChange={() => handleToggleSetting("biometricLogin")}
              trackColor={{
                false: APP_COLORS.surface,
                true: APP_COLORS.accent,
              }}
              thumbColor={APP_COLORS.white}
            />
          </View>

          {/* Auto Logout */}
          <View className="flex-row justify-between items-center py-4 border-b border-om-surface dark:border-slate-700">
            <View className="flex-row items-center flex-1">
              <Ionicons
                name="timer-outline"
                size={22}
                color={APP_COLORS.accent}
              />
              <View className="ml-3 flex-1">
                <Text className="text-base font-medium text-black dark:text-slate-100">
                  Auto Logout
                </Text>
                <Text className="text-sm text-om-muted dark:text-slate-400">
                  Log out after inactivity
                </Text>
              </View>
            </View>

            <View className="flex-row items-center">
              <TextInput
                className="bg-om-bg-soft dark:bg-slate-800 border border-om-border-soft dark:border-slate-700 rounded-lg px-2 py-1 text-sm w-10 text-center mr-2"
                keyboardType="numeric"
                maxLength={2}
                value={securitySettings.autoLogoutMinutes.toString()}
                onChangeText={handleAutoLogoutChange}
              />
              <Text className="text-sm text-om-muted dark:text-slate-400">
                minutes
              </Text>
            </View>
          </View>

          {/* Login Alerts */}
          <View className="flex-row justify-between items-center py-4">
            <View className="flex-row items-center flex-1">
              <Ionicons
                name="notifications-outline"
                size={22}
                color={APP_COLORS.accent}
              />
              <View className="ml-3 flex-1">
                <Text className="text-base font-medium text-black dark:text-slate-100">
                  Login Alerts
                </Text>
                <Text className="text-sm text-om-muted dark:text-slate-400">
                  Get notified of new logins
                </Text>
              </View>
            </View>
            <Switch
              value={securitySettings.loginAlerts}
              onValueChange={() => handleToggleSetting("loginAlerts")}
              trackColor={{
                false: APP_COLORS.surface,
                true: APP_COLORS.accent,
              }}
              thumbColor={APP_COLORS.white}
            />
          </View>
        </View>

        {/* Active Sessions */}
        <View className="bg-white dark:bg-slate-900 rounded-2xl p-5 mb-4">
          <Text className="text-lg font-bold text-black dark:text-slate-100 mb-4">
            Active Sessions
          </Text>

          <View className="flex-row justify-between items-center py-4 border-b border-om-surface dark:border-slate-700">
            <View className="flex-row items-center flex-1">
              <Ionicons
                name="phone-portrait"
                size={24}
                color={APP_COLORS.accent}
              />
              <View className="ml-3 flex-1">
                <Text className="text-base font-semibold text-black dark:text-slate-100">
                  iPhone 14 Pro
                </Text>
                <Text className="text-sm text-om-muted dark:text-slate-400">
                  San Francisco, USA • Current
                </Text>
                <Text className="text-xs text-om-gray-200">
                  Last active: Just now
                </Text>
              </View>
            </View>
            <TouchableOpacity className="bg-om-bg-soft dark:bg-slate-800 px-3 py-1.5 rounded-lg">
              <Text className="text-sm font-medium text-red-500">Logout</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-between items-center py-4">
            <View className="flex-row items-center flex-1">
              <Ionicons name="laptop" size={24} color={APP_COLORS.info} />
              <View className="ml-3 flex-1">
                <Text className="text-base font-semibold text-black dark:text-slate-100">
                  MacBook Pro
                </Text>
                <Text className="text-sm text-om-muted dark:text-slate-400">
                  San Jose, USA
                </Text>
                <Text className="text-xs text-om-gray-200">
                  Last active: 2 hours ago
                </Text>
              </View>
            </View>
            <TouchableOpacity className="bg-om-bg-soft dark:bg-slate-800 px-3 py-1.5 rounded-lg">
              <Text className="text-sm font-medium text-red-500">Logout</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity className="flex-row items-center justify-center py-3">
            <Text className="text-base font-medium text-black dark:text-slate-100 mr-1">
              View All Sessions
            </Text>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={APP_COLORS.lightGray}
            />
          </TouchableOpacity>
        </View>

        {/* Security Tips */}
        <View className="bg-white dark:bg-slate-900 rounded-2xl p-5 mb-6">
          <Text className="text-lg font-bold text-black dark:text-slate-100 mb-4">
            Security Tips
          </Text>

          {[
            "Use a unique password for your Oneminers account",
            "Enable two-factor authentication for extra security",
            "Never share your password or 2FA codes with anyone",
            "Log out from shared or public computers",
          ].map((tip, idx) => (
            <View key={idx} className="flex-row items-start mb-3">
              <Ionicons
                name="checkmark-circle"
                size={18}
                color={APP_COLORS.success}
              />
              <Text className="ml-3 text-sm text-om-muted-2 dark:text-slate-400 leading-5 flex-1">
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
