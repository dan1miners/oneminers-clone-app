import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function TermsScreen() {
  const router = useRouter();
  const [acceptedTerms, setAcceptedTerms] = useState(true);

  const handleAcceptTerms = () => {
    setAcceptedTerms(true);
    Alert.alert(
      'Terms Accepted',
      'Thank you for accepting our terms and conditions.'
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FA]" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 bg-white border-b border-neutral-200">
        <TouchableOpacity onPress={() => router.back()} className="p-1 mr-3">
          <Ionicons name="arrow-back" size={22} color="#000" />
        </TouchableOpacity>

        {/* Brand Text Logo */}
        <View className="flex-row items-baseline">
          <Text className="text-xl font-extrabold text-[#FFC000]">
            one
          </Text>
          <Text className="text-xl font-extrabold text-black">
            miners
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16 }}
      >
        {/* Intro */}
        <View className="bg-white rounded-2xl p-6 mb-4">
          <Text className="text-2xl font-bold text-black mb-2">
            Terms of Service & Privacy Policy
          </Text>
          <Text className="text-sm text-neutral-500">
            Last updated: January 15, 2024
          </Text>
          <Text className="text-sm text-neutral-600 mt-3">
            Please review these terms carefully before using Oneminers products
            and services.
          </Text>
        </View>

        {/* Sections */}
        {[
          {
            title: '1. Acceptance of Terms',
            text:
              'By using the Oneminers platform, you agree to comply with these terms. If you do not agree, please do not use our services.',
          },
          {
            title: '2. User Accounts',
            text:
              'You are responsible for maintaining the security of your account and all activities under it.',
          },
          {
            title: '3. Mining Equipment',
            text:
              'Mining hardware specifications and performance figures are provided by manufacturers and may vary.',
          },
          {
            title: '4. Payments & Fees',
            text:
              'Payments may be made via supported methods. Network, processing, or service fees may apply.',
          },
          {
            title: '5. Privacy Policy',
            text:
              'We collect only necessary data to provide services and support. We do not sell personal information.',
          },
          {
            title: '6. Limitation of Liability',
            text:
              'Oneminers is not responsible for indirect or consequential losses related to service usage.',
          },
        ].map((section, idx) => (
          <View
            key={idx}
            className="bg-white rounded-2xl p-5 mb-4"
          >
            <Text className="text-lg font-semibold text-black mb-3">
              {section.title}
            </Text>
            <Text className="text-sm text-neutral-600 leading-6">
              {section.text}
            </Text>
          </View>
        ))}

        {/* Contact */}
        <View className="bg-white rounded-2xl p-5 mb-6">
          <Text className="text-lg font-semibold text-black mb-3">
            Contact
          </Text>
          <Text className="text-sm text-neutral-600">
            For questions about these terms, please contact our support team at
            {' '}
            <Text className="font-medium text-black">
              legal@oneminers.com
            </Text>
          </Text>
        </View>

        {/* Accept Button */}
        {!acceptedTerms && (
          <TouchableOpacity
            onPress={handleAcceptTerms}
            className="bg-[#FFC000] rounded-xl py-4 items-center mb-6"
          >
            <Text className="text-base font-bold text-black">
              Accept Terms & Conditions
            </Text>
          </TouchableOpacity>
        )}

        {/* Footer */}
        <View className="items-center pb-8">
          <Text className="text-xs text-neutral-400">
            © 2024 Oneminers. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
