import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function SignupScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Simple email check (no heavy rules)
  const isEmailValid = useMemo(() => {
    const trimmed = email.trim().toLowerCase();
    // basic pattern: something@something.something
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
  }, [email]);

  const isPasswordValid = useMemo(() => {
    // simple rule: 8+ chars (adjust if needed)
    return password.length >= 8;
  }, [password]);

  const passwordsMatch = useMemo(() => {
    return password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;
  }, [password, confirmPassword]);

  const canSubmit = useMemo(() => {
    return (
      fullName.trim().length > 0 &&
      isEmailValid &&
      isPasswordValid &&
      passwordsMatch
    );
  }, [fullName, isEmailValid, isPasswordValid, passwordsMatch]);

  const handleSignup = () => {
    if (!canSubmit) return;
    router.replace('/dashboard');
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom', 'left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 24,
            paddingVertical: 40,
            justifyContent: 'center',
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="items-center mb-10 pt-5">
            <View className="flex-row items-center mb-2">
              <Text className="text-[32px] font-bold text-[#FFC000]" style={{ textTransform: 'lowercase' }}>
                one
              </Text>
              <Text className="text-[32px] font-bold text-black" style={{ textTransform: 'lowercase' }}>
                miners
              </Text>
            </View>
            <Text className="text-base text-gray-500" style={{ textTransform: 'lowercase' }}>
              Create Your Account
            </Text>
          </View>

          {/* Signup Form */}
          <View className="bg-white rounded-[20px] p-6 border border-gray-100 shadow-sm mb-6">
            <Text className="text-2xl font-bold text-black mb-2 text-center">Join OneMiners</Text>
            <Text className="text-sm text-gray-500 mb-8 text-center">
              Start managing your mining operations today
            </Text>

            {/* Full Name Input */}
            <View className="mb-5">
              <Text className="text-sm font-medium text-gray-700 mb-2">Full Name</Text>
              <View className="flex-row items-center bg-gray-50 rounded-xl border border-gray-200 px-4">
                <View className="mr-3">
                  <Ionicons name="person-outline" size={20} color="#9CA3AF" />
                </View>
                <TextInput
                  className="flex-1 py-3.5 text-base text-gray-900"
                  style={{ minHeight: 48 }}
                  placeholder="Enter your full name"
                  placeholderTextColor="#9CA3AF"
                  value={fullName}
                  onChangeText={setFullName}
                  autoComplete="name"
                />
              </View>
            </View>

            {/* Email Input */}
            <View className="mb-5">
              <Text className="text-sm font-medium text-gray-700 mb-2">Email Address</Text>
              <View
                className={`flex-row items-center bg-gray-50 rounded-xl border px-4 ${
                  email.length === 0
                    ? 'border-gray-200'
                    : isEmailValid
                    ? 'border-green-600'
                    : 'border-red-600'
                }`}
              >
                <View className="mr-3">
                  <Ionicons name="mail-outline" size={20} color="#9CA3AF" />
                </View>
                <TextInput
                  className="flex-1 py-3.5 text-base text-gray-900"
                  style={{ minHeight: 48 }}
                  placeholder="Enter your email"
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                />
                {email.length > 0 && (
                  <Ionicons
                    name={isEmailValid ? 'checkmark-circle' : 'close-circle'}
                    size={18}
                    color={isEmailValid ? '#16A34A' : '#DC2626'}
                  />
                )}
              </View>
              {email.length > 0 && !isEmailValid && (
                <Text className="text-xs text-red-600 mt-1 ml-1">Please enter a valid email</Text>
              )}
            </View>

            {/* Password Input */}
            <View className="mb-5">
              <Text className="text-sm font-medium text-gray-700 mb-2">Password</Text>
              <View
                className={`flex-row items-center bg-gray-50 rounded-xl border px-4 ${
                  password.length === 0
                    ? 'border-gray-200'
                    : isPasswordValid
                    ? 'border-green-600'
                    : 'border-red-600'
                }`}
              >
                <View className="mr-3">
                  <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />
                </View>
                <TextInput
                  className="flex-1 py-3.5 text-base text-gray-900"
                  style={{ minHeight: 48 }}
                  placeholder="Create a password (8+ characters)"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="p-1">
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#6B7280"
                  />
                </TouchableOpacity>
              </View>
              {password.length > 0 && !isPasswordValid && (
                <Text className="text-xs text-red-600 mt-1 ml-1">Password must be at least 8 characters</Text>
              )}
            </View>

            {/* Confirm Password Input */}
            <View className="mb-5">
              <Text className="text-sm font-medium text-gray-700 mb-2">Confirm Password</Text>
              <View
                className={`flex-row items-center bg-gray-50 rounded-xl border px-4 ${
                  confirmPassword.length === 0
                    ? 'border-gray-200'
                    : passwordsMatch
                    ? 'border-green-600'
                    : 'border-red-600'
                }`}
              >
                <View className="mr-3">
                  <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />
                </View>
                <TextInput
                  className="flex-1 py-3.5 text-base text-gray-900"
                  style={{ minHeight: 48 }}
                  placeholder="Confirm your password"
                  placeholderTextColor="#9CA3AF"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="p-1"
                >
                  <Ionicons
                    name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#6B7280"
                  />
                </TouchableOpacity>
                {confirmPassword.length > 0 && (
                  <Ionicons
                    name={passwordsMatch ? 'checkmark-circle' : 'close-circle'}
                    size={18}
                    color={passwordsMatch ? '#16A34A' : '#DC2626'}
                    style={{ marginLeft: 6 }}
                  />
                )}
              </View>
              {confirmPassword.length > 0 && !passwordsMatch && (
                <Text className="text-xs text-red-600 mt-1 ml-1">Passwords do not match</Text>
              )}
            </View>

            {/* Sign Up Button (turns yellow only when valid) */}
            <TouchableOpacity
              className={`rounded-xl py-4 items-center mt-2 mb-4 ${
                canSubmit ? 'bg-[#FFC000]' : 'bg-gray-100'
              }`}
              onPress={handleSignup}
              disabled={!canSubmit}
              activeOpacity={0.85}
            >
              <Text className={`text-base font-semibold ${canSubmit ? 'text-black' : 'text-gray-400'}`}>
                Create Account
              </Text>
            </TouchableOpacity>

            {/* Terms Notice */}
            <Text className="text-xs text-gray-500 text-center leading-4 mb-6">
              By creating an account, you agree to our{' '}
              <Link href="/terms" asChild>
                <Text className="text-[#FFC000] font-semibold">
                  Terms of Service and Privacy Policy
                </Text>
              </Link>
              .
            </Text>

            {/* Divider */}
            <View className="flex-row items-center mb-6">
              <View className="flex-1 h-px bg-gray-200" />
              <Text className="mx-4 text-sm text-gray-500">Already have an account?</Text>
              <View className="flex-1 h-px bg-gray-200" />
            </View>

            {/* Login Link */}
            <View className="items-center">
              <Link href="/(auth)/login" asChild>
                <TouchableOpacity className="w-full bg-gray-50 rounded-xl py-4 items-center border border-gray-200">
                  <Text className="text-gray-700 text-base font-semibold">Sign In</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>

          {/* Footer */}
          <View className="mt-5 items-center">
            <Text className="text-xs text-gray-400 text-center">
              © 2024 OneMiners. Professional Mining Platform
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
