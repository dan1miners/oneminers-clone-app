import React, { useState } from 'react';
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

  const passwordsMatch = password && confirmPassword && password === confirmPassword;
  const canSubmit = fullName && email && password && confirmPassword && passwordsMatch;

  const handleSignup = () => {
    if (!canSubmit) return;
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingVertical: 40, justifyContent: 'center' }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="items-center mb-10 pt-5">
            <View className="flex-row items-center mb-2">
              <Text className="text-[32px] font-bold text-[#FFC000]" style={{ textTransform: 'lowercase' }}>one</Text>
              <Text className="text-[32px] font-bold text-black" style={{ textTransform: 'lowercase' }}>miners</Text>
            </View>
            <Text className="text-base text-gray-500" style={{ textTransform: 'lowercase' }}>Create Your Account</Text>
          </View>

          {/* Signup Form */}
          <View className="bg-white rounded-[20px] p-6 border border-gray-100 shadow-sm mb-6">
            <Text className="text-2xl font-bold text-black mb-2 text-center">Join OneMiners</Text>
            <Text className="text-sm text-gray-500 mb-8 text-center">Start managing your mining operations today</Text>

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
              <View className="flex-row items-center bg-gray-50 rounded-xl border border-gray-200 px-4">
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
              </View>
            </View>

            {/* Password Input */}
            <View className="mb-5">
              <Text className="text-sm font-medium text-gray-700 mb-2">Password</Text>
              <View className="flex-row items-center bg-gray-50 rounded-xl border border-gray-200 px-4">
                <View className="mr-3">
                  <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />
                </View>
                <TextInput
                  className="flex-1 py-3.5 text-base text-gray-900"
                  style={{ minHeight: 48 }}
                  placeholder="Create a password"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  className="p-1"
                >
                  <Ionicons 
                    name={showPassword ? "eye-off-outline" : "eye-outline"} 
                    size={20} 
                    color="#6B7280" 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password Input */}
            <View className="mb-5">
              <Text className="text-sm font-medium text-gray-700 mb-2">Confirm Password</Text>
              <View className={`flex-row items-center bg-gray-50 rounded-xl border px-4 ${confirmPassword && !passwordsMatch ? 'border-red-600' : 'border-gray-200'}`}>
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
                    name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                    size={20} 
                    color="#6B7280" 
                  />
                </TouchableOpacity>
              </View>
              {confirmPassword && !passwordsMatch && (
                <Text className="text-xs text-red-600 mt-1 ml-1">Passwords do not match</Text>
              )}
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity
              className={`rounded-xl py-4 items-center mt-2 mb-4 ${!canSubmit ? 'bg-gray-100' : 'bg-[#FFC000]'}`}
              onPress={handleSignup}
              disabled={!canSubmit}
            >
              <Text className="text-black text-base font-semibold">Create Account</Text>
            </TouchableOpacity>

            {/* Terms Notice */}
            <Text className="text-xs text-gray-500 text-center leading-4 mb-6">
              By creating an account, you agree to our Terms of Service and Privacy Policy.
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
            <Text className="text-xs text-gray-400 text-center">© 2024 OneMiners. Professional Mining Platform</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
