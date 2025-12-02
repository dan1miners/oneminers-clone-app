import {
  View,
  Text,
  StyleSheet,
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

  const handleBackPress = () => {
    router.back();
  };

  const handleAcceptTerms = () => {
    setAcceptedTerms(true);
    // In a real app, you would save this to user preferences
    Alert.alert('Terms Accepted', 'Thank you for accepting our terms and conditions.');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Terms & Privacy</Text>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Terms Summary */}
        <View style={styles.summaryCard}>
          <Ionicons name="document-text" size={32} color="#FFC000" />
          <Text style={styles.summaryTitle}>Oneminers Terms</Text>
          <Text style={styles.summaryText}>
            Last updated: January 15, 2024
          </Text>
          <Text style={styles.summarySubtext}>
            Please read these terms carefully before using our services.
          </Text>
        </View>

        {/* Table of Contents */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Table of Contents</Text>
          
          <TouchableOpacity style={styles.tocItem}>
            <Text style={styles.tocNumber}>1.</Text>
            <Text style={styles.tocText}>Acceptance of Terms</Text>
            <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.tocItem}>
            <Text style={styles.tocNumber}>2.</Text>
            <Text style={styles.tocText}>User Accounts</Text>
            <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.tocItem}>
            <Text style={styles.tocNumber}>3.</Text>
            <Text style={styles.tocText}>Mining Equipment</Text>
            <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.tocItem}>
            <Text style={styles.tocNumber}>4.</Text>
            <Text style={styles.tocText}>Payments & Fees</Text>
            <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.tocItem}>
            <Text style={styles.tocNumber}>5.</Text>
            <Text style={styles.tocText}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.tocItem}>
            <Text style={styles.tocNumber}>6.</Text>
            <Text style={styles.tocText}>Limitation of Liability</Text>
            <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
          <Text style={styles.contentText}>
            By accessing or using the Oneminers platform, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access our services.
          </Text>
          
          <Text style={styles.subSectionTitle}>1.1 Service Description</Text>
          <Text style={styles.contentText}>
            Oneminers provides a marketplace for buying, selling, and managing cryptocurrency mining equipment, along with repair services, mining optimization tools, and related services.
          </Text>
          
          <Text style={styles.subSectionTitle}>1.2 Eligibility</Text>
          <Text style={styles.contentText}>
            You must be at least 18 years old to use our services. By using Oneminers, you represent that you are at least 18 years old and have the legal capacity to enter into this agreement.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. User Accounts</Text>
          
          <Text style={styles.subSectionTitle}>2.1 Account Creation</Text>
          <Text style={styles.contentText}>
            To access certain features, you must create an account. You agree to provide accurate, current, and complete information during registration.
          </Text>
          
          <Text style={styles.subSectionTitle}>2.2 Account Security</Text>
          <Text style={styles.contentText}>
            You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
          </Text>
          
          <Text style={styles.subSectionTitle}>2.3 Account Termination</Text>
          <Text style={styles.contentText}>
            We reserve the right to suspend or terminate accounts that violate our terms or engage in fraudulent activities.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Mining Equipment</Text>
          
          <Text style={styles.subSectionTitle}>3.1 Equipment Sales</Text>
          <Text style={styles.contentText}>
            All mining equipment is sold "as is" unless otherwise specified. Specifications and performance metrics are provided by manufacturers and may vary.
          </Text>
          
          <Text style={styles.subSectionTitle}>3.2 Warranty</Text>
          <Text style={styles.contentText}>
            Warranty terms vary by manufacturer and product. We facilitate warranty claims but are not responsible for manufacturer warranties.
          </Text>
          
          <Text style={styles.subSectionTitle}>3.3 Returns & Refunds</Text>
          <Text style={styles.contentText}>
            Return policies are specified on each product page. Returns must be initiated within the specified timeframe and equipment must be in original condition.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Payments & Fees</Text>
          
          <Text style={styles.subSectionTitle}>4.1 Payment Methods</Text>
          <Text style={styles.contentText}>
            We accept various payment methods including cryptocurrency, credit cards, and bank transfers. Payment processing fees may apply.
          </Text>
          
          <Text style={styles.subSectionTitle}>4.2 Taxes</Text>
          <Text style={styles.contentText}>
            You are responsible for any taxes, duties, or fees associated with your purchases. We may collect sales tax where required by law.
          </Text>
          
          <Text style={styles.subSectionTitle}>4.3 Service Fees</Text>
          <Text style={styles.contentText}>
            We may charge service fees for certain features like repairs, maintenance, or premium services. All fees will be clearly disclosed before you commit.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Privacy Policy</Text>
          
          <Text style={styles.subSectionTitle}>5.1 Data Collection</Text>
          <Text style={styles.contentText}>
            We collect information necessary to provide our services, including personal information, device information, and usage data.
          </Text>
          
          <Text style={styles.subSectionTitle}>5.2 Data Usage</Text>
          <Text style={styles.contentText}>
            Your data is used to provide and improve our services, process transactions, communicate with you, and ensure security.
          </Text>
          
          <Text style={styles.subSectionTitle}>5.3 Data Protection</Text>
          <Text style={styles.contentText}>
            We implement industry-standard security measures to protect your data. However, no method of transmission over the internet is 100% secure.
          </Text>
          
          <Text style={styles.subSectionTitle}>5.4 Third-Party Services</Text>
          <Text style={styles.contentText}>
            We may use third-party services for payment processing, analytics, and other functions. These services have their own privacy policies.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Limitation of Liability</Text>
          
          <Text style={styles.contentText}>
            To the maximum extent permitted by law, Oneminers shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services.
          </Text>
          
          <Text style={styles.contentText}>
            Our total liability for any claims related to our services shall not exceed the amount you paid us in the last 12 months.
          </Text>
        </View>

        {/* Contact Information */}
        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>Contact Information</Text>
          
          <View style={styles.contactItem}>
            <Ionicons name="mail" size={18} color="#FFC000" />
            <Text style={styles.contactText}>legal@oneminers.com</Text>
          </View>
          
          <View style={styles.contactItem}>
            <Ionicons name="call" size={18} color="#FFC000" />
            <Text style={styles.contactText}>+1 (555) 123-4567</Text>
          </View>
          
          <View style={styles.contactItem}>
            <Ionicons name="location" size={18} color="#FFC000" />
            <Text style={styles.contactText}>123 Mining Street, San Francisco, CA 94107</Text>
          </View>
        </View>

        {/* Acceptance Button */}
        {!acceptedTerms && (
          <TouchableOpacity 
            style={styles.acceptButton}
            onPress={handleAcceptTerms}
          >
            <Text style={styles.acceptButtonText}>Accept Terms & Conditions</Text>
          </TouchableOpacity>
        )}

        {/* Version Info */}
        <View style={styles.versionSection}>
          <Text style={styles.versionText}>Document Version: 3.2</Text>
          <Text style={styles.versionSubtext}>Effective Date: January 15, 2024</Text>
          <Text style={styles.versionSubtext}>Next Review: July 15, 2024</Text>
        </View>
        
        {/* Bottom Spacer */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    marginTop: 16,
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 4,
  },
  summarySubtext: {
    fontSize: 14,
    color: '#6C757D',
    textAlign: 'center',
    marginTop: 8,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 16,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginTop: 16,
    marginBottom: 8,
  },
  contentText: {
    fontSize: 14,
    color: '#6C757D',
    lineHeight: 22,
    marginBottom: 12,
  },
  tocItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  tocNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFC000',
    marginRight: 12,
    width: 24,
  },
  tocText: {
    fontSize: 16,
    color: '#000000',
    flex: 1,
  },
  contactSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactText: {
    fontSize: 14,
    color: '#6C757D',
    marginLeft: 12,
    flex: 1,
  },
  acceptButton: {
    backgroundColor: '#FFC000',
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 16,
  },
  acceptButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  versionSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  versionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  versionSubtext: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 4,
  },
  bottomSpacer: {
    height: 30,
  },
});