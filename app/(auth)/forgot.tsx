import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import AuthScreen from "../components/AuthScreen";
import BrandWordmark from "../components/BrandWordmark";
import { APP_COLORS } from "../../constants/colors";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <AuthScreen
      contentContainerStyle={{
        paddingTop: 32,
        paddingBottom: 24,
        justifyContent: "flex-start",
      }}
    >
      {/* Clean Header */}
      <View className="items-center mb-8">
        <BrandWordmark
          size={28}
          subtitle="Password Recovery"
          subtitleClassName="text-sm text-gray-500 font-medium tracking-wider"
          subtitleTransform="uppercase"
        />
      </View>

      {/* Reset Form Card */}
      <View className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
        {!submitted ? (
          <>
            <View className="flex-row items-center justify-center mb-3">
              <View className="mr-2.5">
                <Ionicons
                  name="lock-closed-outline"
                  size={32}
                  color={APP_COLORS.accent}
                />
              </View>
              <Text className="text-[22px] font-bold text-black text-center">
                Forgot Password
              </Text>
            </View>

            <Text className="text-sm text-gray-500 mb-7 text-center leading-5">
              Enter the email associated with your account and we'll send a
              reset link.
            </Text>

            {/* Email Input */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </Text>
              <View className="flex-row items-center bg-gray-50 rounded-xl border border-gray-200 px-4">
                <View className="mr-3">
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color={APP_COLORS.placeholder}
                  />
                </View>
                <TextInput
                  className="flex-1 py-3.5 text-base text-gray-900"
                  style={{ minHeight: 48 }}
                  placeholder="Enter your email"
                  placeholderTextColor={APP_COLORS.placeholder}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                  returnKeyType="send"
                  onSubmitEditing={handleSubmit}
                />
              </View>
            </View>

            {/* Reset Button */}
            <TouchableOpacity
              className={`rounded-xl py-4 items-center mb-5 ${!email ? "bg-gray-100" : "bg-om-accent"}`}
              disabled={!email}
              onPress={handleSubmit}
            >
              <Text className="text-black text-base font-semibold">
                Send Reset Link
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <View className="items-center py-2">
            <View className="mb-4">
              <Ionicons
                name="checkmark-circle"
                size={60}
                color={APP_COLORS.successAlt}
              />
            </View>
            <Text className="text-xl font-bold text-black mb-3 text-center">
              Check Your Email
            </Text>
            <Text className="text-sm text-gray-500 text-center leading-5 mb-2">
              We've sent a password reset link to:
            </Text>
            <Text className="text-[15px] font-semibold text-gray-700 text-center mb-4">
              {email}
            </Text>
            <Text className="text-[13px] text-gray-500 text-center leading-[18px] italic">
              Follow the instructions in the email to reset your password.
            </Text>
          </View>
        )}

        {/* Back to Login */}
        <View className="items-center border-t border-gray-100 pt-5">
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity className="flex-row items-center py-2 px-3">
              <View className="mr-2">
                <Ionicons
                  name="arrow-back"
                  size={16}
                  color={APP_COLORS.subtext}
                />
              </View>
              <Text className="text-sm text-gray-500 font-medium">
                Back to Sign In
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      {/* Minimal Footer */}
      <View className="mt-4 items-center pt-4 border-t border-gray-100">
        <Text className="text-xs text-gray-400 text-center">
          Need help? Contact support@oneminers.com
        </Text>
      </View>
    </AuthScreen>
  );
}
