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
      <View className="flex-row items-center px-4 py-3 bg-white border-b border-[#E9ECEF]">
        <TouchableOpacity onPress={() => router.back()} className="p-1 mr-3">
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-xl font-semibold text-black">
          Terms & Privacy
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16 }}
      >
        {/* Summary */}
        <View className="bg-white rounded-2xl p-6 mb-4 items-center shadow-sm">
          <Ionicons name="document-text" size={32} color="#FFC000" />
          <Text className="text-2xl font-bold text-black mt-4 mb-2">
            Oneminers Terms
          </Text>
          <Text className="text-base text-[#8E8E93]">
            Last updated: January 15, 2024
          </Text>
          <Text className="text-sm text-[#6C757D] text-center mt-3">
            Please read these terms carefully before using our services.
          </Text>
        </View>

        {/* Table of Contents */}
        <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
          <Text className="text-xl font-bold text-black mb-4">
            Table of Contents
          </Text>

          {[
            'Acceptance of Terms',
            'User Accounts',
            'Mining Equipment',
            'Payments & Fees',
            'Privacy Policy',
            'Limitation of Liability',
          ].map((item, idx) => (
            <TouchableOpacity
              key={idx}
              className="flex-row items-center py-3 border-b border-[#F2F2F7]"
            >
              <Text className="w-6 text-sm font-semibold text-[#FFC000]">
                {idx + 1}.
              </Text>
              <Text className="flex-1 text-base text-black">
                {item}
              </Text>
              <Ionicons
                name="chevron-forward"
                size={18}
                color="#C7C7CC"
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Sections */}
        {[
          {
            title: '1. Acceptance of Terms',
            text:
              'By accessing or using the Oneminers platform, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access our services.',
          },
          {
            title: '2. User Accounts',
            text:
              'You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.',
          },
          {
            title: '3. Mining Equipment',
            text:
              'All mining equipment is sold "as is" unless otherwise specified. Specifications and performance metrics are provided by manufacturers.',
          },
          {
            title: '4. Payments & Fees',
            text:
              'We accept various payment methods including cryptocurrency, credit cards, and bank transfers. Processing fees may apply.',
          },
          {
            title: '5. Privacy Policy',
            text:
              'We collect information necessary to provide our services and protect your data using industry-standard security measures.',
          },
          {
            title: '6. Limitation of Liability',
            text:
              'Oneminers shall not be liable for any indirect or consequential damages arising from your use of our services.',
          },
        ].map((section, idx) => (
          <View
            key={idx}
            className="bg-white rounded-2xl p-5 mb-4 shadow-sm"
          >
            <Text className="text-xl font-bold text-black mb-4">
              {section.title}
            </Text>
            <Text className="text-sm text-[#6C757D] leading-6">
              {section.text}
            </Text>
          </View>
        ))}

        {/* Contact */}
        <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
          <Text className="text-lg font-bold text-black mb-4">
            Contact Information
          </Text>

          {[
            { icon: 'mail', text: 'legal@oneminers.com' },
            { icon: 'call', text: '+1 (555) 123-4567' },
            {
              icon: 'location',
              text: '123 Mining Street, San Francisco, CA 94107',
            },
          ].map((c, i) => (
            <View key={i} className="flex-row items-center mb-3">
              <Ionicons name={c.icon as any} size={18} color="#FFC000" />
              <Text className="ml-3 text-sm text-[#6C757D] flex-1">
                {c.text}
              </Text>
            </View>
          ))}
        </View>

        {/* Accept Button */}
        {!acceptedTerms && (
          <TouchableOpacity
            onPress={handleAcceptTerms}
            className="bg-[#FFC000] rounded-xl py-4 items-center mb-4"
          >
            <Text className="text-lg font-bold text-black">
              Accept Terms & Conditions
            </Text>
          </TouchableOpacity>
        )}

        {/* Version Info */}
        <View className="items-center py-6">
          <Text className="text-sm font-semibold text-black mb-1">
            Document Version: 3.2
          </Text>
          <Text className="text-xs text-[#8E8E93]">
            Effective Date: January 15, 2024
          </Text>
          <Text className="text-xs text-[#8E8E93]">
            Next Review: July 15, 2024
          </Text>
        </View>

        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
