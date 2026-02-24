import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { APP_COLORS } from "../../constants/colors";
import { useAppTheme } from "../../providers/theme-provider";

export default function ProfileScreen() {
  const router = useRouter();
  const { colors, isDark, setDarkMode } = useAppTheme();

  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const userInfo = useMemo(
    () => ({
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      joinDate: "January 2024",
      miningLevel: "Advanced Miner",
      memberSince: "Member since January 2024",
    }),
    [],
  );

  const initials =
    userInfo.name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((s) => s[0]?.toUpperCase())
      .join("") || "U";

  const handleLogout = () => {
    setShowLogoutModal(false);
    router.replace("/(auth)/login");
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
    leftIcon: React.ComponentProps<typeof Ionicons>["name"];
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
      className="flex-row justify-between items-center py-3.5 px-3"
      style={{
        backgroundColor: colors.surface,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: colors.borderSoft,
      }}
    >
      <View className="flex-row items-center flex-1">
        <View
          className={`w-9 h-9 rounded-xl items-center justify-center mr-3 ${leftBg}`}
        >
          <Ionicons name={leftIcon} size={20} color={leftColor} />
        </View>

        <Text
          className="text-[15px] font-medium"
          style={{ color: danger ? colors.danger : colors.text }}
          numberOfLines={1}
        >
          {title}
        </Text>
      </View>

      <View className="flex-row items-center">
        {badge ? (
          <Text className="text-xs font-semibold px-2 py-0.5 rounded-[10px] mr-2 min-w-[24px] text-center bg-om-accent text-black">
            {badge}
          </Text>
        ) : null}

        {right}

        {onPress ? (
          <Ionicons name="chevron-forward" size={18} color={colors.subtext} />
        ) : null}
      </View>
    </TouchableOpacity>
  );

  const Section = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <View
      className="rounded-2xl p-4 mb-4"
      style={{ backgroundColor: colors.surface }}
    >
      <Text className="text-base font-bold mb-3" style={{ color: colors.text }}>
        {title}
      </Text>
      <View className="rounded-xl overflow-hidden">{children}</View>
    </View>
  );

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors.background }}
      edges={["top", "bottom", "left", "right"]}
    >
      {/* Header */}
      <View
        className="flex-row items-center h-[60px] px-5 py-3 border-b"
        style={{ borderBottomColor: colors.border }}
      >
        <Text className="text-xl font-bold" style={{ color: colors.text }}>
          Profile
        </Text>
      </View>

      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        {/* User Card (no shadows) */}
        <View
          className="rounded-2xl p-5 mb-5"
          style={{ backgroundColor: colors.surface }}
        >
          <View className="flex-row items-center">
            <View className="w-[66px] h-[66px] rounded-full items-center justify-center mr-4 bg-om-accent/20">
              <View className="w-[54px] h-[54px] rounded-full items-center justify-center bg-om-accent">
                <Text className="text-xl font-bold text-black">{initials}</Text>
              </View>
            </View>

            <View className="flex-1">
              <Text
                className="text-xl font-bold mb-1"
                style={{ color: colors.text }}
                numberOfLines={1}
              >
                {userInfo.name}
              </Text>
              <Text
                className="text-[14px] mb-2"
                style={{ color: colors.subtext }}
                numberOfLines={1}
              >
                {userInfo.email}
              </Text>

              <View className="flex-row flex-wrap items-center">
                <View className="flex-row items-center px-3 py-1 rounded-full mr-2 mb-2 bg-om-accent/10">
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={14}
                    color={colors.text}
                  />
                  <Text
                    className="text-xs font-semibold ml-1"
                    style={{ color: colors.text }}
                  >
                    {userInfo.miningLevel}
                  </Text>
                </View>

                <View
                  className="flex-row items-center px-3 py-1 rounded-full mr-2 mb-2"
                  style={{ backgroundColor: colors.surfaceAlt }}
                >
                  <Ionicons
                    name="calendar-outline"
                    size={14}
                    color={colors.text}
                  />
                  <Text
                    className="text-xs font-semibold ml-1"
                    style={{ color: colors.text }}
                  >
                    {userInfo.joinDate}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Info rows */}
          <View
            className="mt-4 pt-4 border-t"
            style={{ borderTopColor: colors.border }}
          >
            <View className="flex-row justify-between">
              <Text className="text-sm" style={{ color: colors.subtext }}>
                Phone
              </Text>
              <Text
                className="text-sm font-semibold"
                style={{ color: colors.text }}
              >
                {userInfo.phone}
              </Text>
            </View>

            <View className="flex-row justify-between mt-2">
              <Text className="text-sm" style={{ color: colors.subtext }}>
                Status
              </Text>
              <Text
                className="text-sm font-semibold"
                style={{ color: colors.text }}
              >
                {userInfo.memberSince}
              </Text>
            </View>
          </View>
        </View>

        {/* Account */}
        <Section title="Account">
          <Row
            title="Edit Profile"
            leftIcon="person-outline"
            leftBg="bg-om-accent/10"
            leftColor={APP_COLORS.accent}
            onPress={() => router.push("/(essentials)/eprofile")}
          />
          <Row
            title="Shipping Addresses"
            leftIcon="location-outline"
            leftBg="bg-om-success/10"
            leftColor={APP_COLORS.success}
            badge="2"
            onPress={() => router.push("/(essentials)/eshipping")}
          />
          <Row
            title="Security"
            leftIcon="shield-checkmark-outline"
            leftBg="bg-om-info/10"
            leftColor={APP_COLORS.info}
            onPress={() => router.push("/(essentials)/security")}
          />
          <Row
            title="Wallet Manager"
            leftIcon="wallet-outline"
            leftBg="bg-om-purple/10"
            leftColor={APP_COLORS.purple}
            isLast
            onPress={() => router.push("/(essentials)/wallet-manager")}
          />
        </Section>

        {/* Mining Operations */}
        <Section title="Mining Operations">
          <Row
            title="Orders"
            leftIcon="cart-outline"
            leftBg="bg-om-warning/10"
            leftColor={APP_COLORS.warning}
            badge="12"
            onPress={() => router.push("/(shop)/orders")}
          />
          <Row
            title="Repairs"
            leftIcon="build-outline"
            leftBg="bg-om-rose/10"
            leftColor={APP_COLORS.rose}
            badge="3"
            onPress={() => router.push("/(essentials)/repairs")}
          />
          <Row
            title="Referrals"
            leftIcon="people-outline"
            leftBg="bg-om-lime/10"
            leftColor={APP_COLORS.lime}
            badge="8"
            isLast
            onPress={() => router.push("/(essentials)/referral")}
          />
        </Section>

        {/* Preferences */}
        <View
          className="rounded-2xl p-4 mb-4"
          style={{ backgroundColor: colors.surface }}
        >
          <Text
            className="text-base font-bold mb-3"
            style={{ color: colors.text }}
          >
            Preferences
          </Text>

          <View className="rounded-xl overflow-hidden">
            <View
              className="flex-row justify-between items-center py-3.5 px-3 border-b"
              style={{
                backgroundColor: colors.surface,
                borderBottomColor: colors.borderSoft,
              }}
            >
              <View className="flex-row items-center flex-1">
                <View className="w-9 h-9 rounded-xl items-center justify-center mr-3 bg-om-info/10">
                  <Ionicons
                    name="notifications-outline"
                    size={20}
                    color={APP_COLORS.info}
                  />
                </View>
                <Text
                  className="text-[15px] font-medium"
                  style={{ color: colors.text }}
                >
                  Notifications
                </Text>
              </View>

              <Switch
                value={isNotificationsEnabled}
                onValueChange={setIsNotificationsEnabled}
                trackColor={{ false: colors.borderSoft, true: colors.accent }}
                thumbColor={APP_COLORS.white}
              />
            </View>

            <View
              className="flex-row justify-between items-center py-3.5 px-3 border-b"
              style={{
                backgroundColor: colors.surface,
                borderBottomColor: colors.borderSoft,
              }}
            >
              <View className="flex-row items-center flex-1">
                <View className="w-9 h-9 rounded-xl items-center justify-center mr-3 bg-om-text/10">
                  <Ionicons name="moon-outline" size={20} color={colors.text} />
                </View>
                <Text
                  className="text-[15px] font-medium"
                  style={{ color: colors.text }}
                >
                  Dark Mode
                </Text>
              </View>

              <Switch
                value={isDark}
                onValueChange={setDarkMode}
                trackColor={{ false: colors.borderSoft, true: colors.accent }}
                thumbColor={APP_COLORS.white}
              />
            </View>

            <Row
              title="Settings"
              leftIcon="settings-outline"
              leftBg="bg-om-purple/10"
              leftColor={APP_COLORS.purple}
              isLast
              onPress={() => router.push("/(essentials)/settings")}
            />
          </View>
        </View>

        {/* Support */}
        <Section title="Support">
          <Row
            title="Customer Support"
            leftIcon="headset-outline"
            leftBg="bg-om-lime/10"
            leftColor={APP_COLORS.lime}
            onPress={() => router.push("/(essentials)/support")}
          />
          <Row
            title="Terms & Privacy"
            leftIcon="document-text-outline"
            leftBg="bg-om-pink/10"
            leftColor={APP_COLORS.pink}
            isLast
            onPress={() => router.push("/(essentials)/terms")}
          />
        </Section>

        {/* Logout */}
        <TouchableOpacity
          activeOpacity={0.9}
          className="rounded-2xl p-4 mb-5"
          style={{ backgroundColor: colors.surface }}
          onPress={() => setShowLogoutModal(true)}
        >
          <View className="flex-row items-center">
            <View className="w-9 h-9 rounded-xl items-center justify-center mr-3 bg-om-danger/10">
              <Ionicons
                name="log-out-outline"
                size={20}
                color={colors.danger}
              />
            </View>
            <Text className="text-[15px] font-medium text-om-danger">
              Logout
            </Text>
          </View>
        </TouchableOpacity>

        {/* Version */}
        <View className="items-center pb-[30px]">
          <Text className="text-[13px]" style={{ color: colors.subtext }}>
            Oneminers v1.2.4
          </Text>
        </View>
      </ScrollView>

      {/* Logout Modal */}
      <Modal
        visible={showLogoutModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View
          className="flex-1 justify-center items-center p-5"
          style={{ backgroundColor: colors.overlay }}
        >
          <View
            className="rounded-[20px] p-6 w-full max-w-[340px] items-center border"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
            }}
          >
            <View className="w-20 h-20 rounded-full justify-center items-center mb-4 bg-om-accent/10">
              <Ionicons name="log-out" size={44} color={colors.accent} />
            </View>

            <Text
              className="text-2xl font-bold mb-3"
              style={{ color: colors.text }}
            >
              Logout
            </Text>

            <Text
              className="text-base text-center mb-6 leading-[22px]"
              style={{ color: colors.subtext }}
            >
              Are you sure you want to logout from your account?
            </Text>

            <View className="flex-row gap-3 w-full">
              <TouchableOpacity
                activeOpacity={0.9}
                className="flex-1 py-4 rounded-xl items-center border"
                style={{
                  borderColor: colors.border,
                  backgroundColor: colors.background,
                }}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text
                  className="text-base font-semibold"
                  style={{ color: colors.subtext }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.9}
                className="flex-1 py-4 rounded-xl items-center bg-om-accent"
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
