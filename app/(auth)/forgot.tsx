import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
// FIX 1: Import the StatusBar component
import { StatusBar } from 'expo-status-bar';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <>
      {/* FIX 2: Add the StatusBar component to control its appearance */}
      <StatusBar style="dark" />
      
      {/* FIX 3: Update SafeAreaView to handle the top edge */}
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <ScrollView 
            // FIX 4: Removed justifyContent to prevent layout shifts. Use paddingTop for spacing.
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Clean Header */}
            <View style={styles.header}>
              <View style={styles.brandContainer}>
                <Text style={styles.brandOne}>one</Text>
                <Text style={styles.brandMiners}>miners</Text>
              </View>
              <Text style={styles.tagline}>Password Recovery</Text>
            </View>

            {/* Reset Form Card */}
            <View style={styles.card}>
              {!submitted ? (
                <>
                  <View style={styles.titleContainer}>
                    <Ionicons name="lock-closed-outline" size={32} color="#FFC000" style={styles.titleIcon} />
                    <Text style={styles.title}>Forgot Password</Text>
                  </View>
                  
                  <Text style={styles.subtitle}>
                    Enter the email associated with your account and we'll send a reset link.
                  </Text>

                  {/* Email Input */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Email Address</Text>
                    <View style={styles.inputWrapper}>
                      <Ionicons name="mail-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="Enter your email"
                        placeholderTextColor="#9CA3AF"
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
                    style={[styles.resetButton, !email && styles.resetButtonDisabled]}
                    disabled={!email}
                    onPress={handleSubmit}
                  >
                    <Text style={styles.resetButtonText}>Send Reset Link</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <View style={styles.successContainer}>
                  <View style={styles.successIcon}>
                    <Ionicons name="checkmark-circle" size={60} color="#10B981" />
                  </View>
                  <Text style={styles.successTitle}>Check Your Email</Text>
                  <Text style={styles.successText}>
                    We've sent a password reset link to:
                  </Text>
                  <Text style={styles.emailHighlight}>{email}</Text>
                  <Text style={styles.successNote}>
                    Follow the instructions in the email to reset your password.
                  </Text>
                </View>
              )}

              {/* Back to Login */}
              <View style={styles.backContainer}>
                <Link href="/(auth)/login" asChild>
                  <TouchableOpacity style={styles.backButton}>
                    <Ionicons name="arrow-back" size={16} color="#6B7280" style={styles.backIcon} />
                    <Text style={styles.backText}>Back to Sign In</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>

            {/* Minimal Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Need help? Contact support@oneminers.com</Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    // FIX 5: Adjusted padding for better initial positioning without centering
    paddingTop: 32, 
    paddingBottom: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    paddingTop: 0,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  brandOne: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFC000',
    textTransform: 'lowercase',
  },
  brandMiners: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
    textTransform: 'lowercase',
  },
  tagline: {
    fontSize: 14,
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 24,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  titleIcon: {
    marginRight: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 28,
    textAlign: 'center',
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#111827',
    minHeight: 48,
  },
  resetButton: {
    backgroundColor: '#FFC000',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  resetButtonDisabled: {
    backgroundColor: '#F3F4F6',
  },
  resetButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  successIcon: {
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 12,
    textAlign: 'center',
  },
  successText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 8,
  },
  emailHighlight: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 16,
  },
  successNote: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
    fontStyle: 'italic',
  },
  backContainer: {
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  backIcon: {
    marginRight: 8,
  },
  backText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  footer: {
    marginTop: 16,
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});