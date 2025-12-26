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
import { StatusBar } from 'expo-status-bar';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (email && password) {
      router.replace('/(tabs)/dashboard');
    }
  };

  return (
    <>
      <StatusBar style="dark" />
      
      <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <ScrollView 
            contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingVertical: 40, justifyContent: 'center' }}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View className="items-center mb-12 pt-5">
              <View className="flex-row items-center mb-2">
                <Text className="text-[32px] font-bold text-[#FFC000]" style={{ textTransform: 'lowercase' }}>one</Text>
                <Text className="text-[32px] font-bold text-black" style={{ textTransform: 'lowercase' }}>miners</Text>
              </View>
              <Text className="text-base text-gray-500" style={{ textTransform: 'lowercase' }}>Professional Mining Management</Text>
            </View>

            {/* Login Card */}
            <View className="bg-white rounded-[20px] p-6 border border-gray-100 shadow-sm mb-6">
              <Text className="text-2xl font-bold text-black mb-2 text-center">Welcome Back</Text>
              <Text className="text-sm text-gray-500 mb-8 text-center">Sign in to manage your mining operations</Text>

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
                    placeholder="Enter your password"
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

              {/* Forgot Password */}
              <Link href="/(auth)/forgot" asChild>
                <TouchableOpacity className="self-end mb-6">
                  <Text className="text-sm text-[#FFC000] font-medium">Forgot Password?</Text>
                </TouchableOpacity>
              </Link>
              
              {/* Login Button */}
              <TouchableOpacity
                className={`rounded-xl py-4 items-center mb-6 ${(!email || !password) ? 'bg-gray-100' : 'bg-[#FFC000]'}`}
                onPress={handleLogin}
                disabled={!email || !password}
              >
                <Text className="text-black text-base font-semibold">Sign In</Text>
              </TouchableOpacity>

              {/* Divider */}
              <View className="flex-row items-center mb-6">
                <View className="flex-1 h-px bg-gray-200" />
                <Text className="mx-4 text-sm text-gray-500">or</Text>
                <View className="flex-1 h-px bg-gray-200" />
              </View>

              {/* Sign Up Link */}
              <View className="flex-row justify-center items-center">
                <Text className="text-sm text-gray-500">Don't have an account? </Text>
                <Link href="/(auth)/register" asChild>
                  <TouchableOpacity>
                    <Text className="text-sm text-[#FFC000] font-semibold">Sign Up</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>

            {/* Footer */}
            <View className="mt-10 items-center">
              <Text className="text-xs text-gray-400">© 2024 OneMiners. All rights reserved.</Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}
