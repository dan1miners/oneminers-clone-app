import React, { useState } from 'react'; // Re-added useState
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard'; // Import Clipboard

// --- Mock Data & Types ---

// Define the structure for a single referral entry
type ReferralItem = {
  id: string;
  name: string;
  email: string;
  pointsEarned: string;
  avatar: string; // Using emoji for avatar
};

// Mock data for referrals
const mockReferrals: ReferralItem[] = [
  { id: '1', name: 'John Doe', email: 'john.doe@example.com', pointsEarned: '150', avatar: '👨‍💻' },
  { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com', pointsEarned: '75', avatar: '👩‍🎨' },
  { id: '3', name: 'Peter Jones', email: 'peter.jones@example.com', pointsEarned: '200', avatar: '👨‍🚀' },
  { id: '4', name: 'Mary Johnson', email: 'mary.j@example.com', pointsEarned: '50', avatar: '👩‍🔬' },
  { id: '5', name: 'David Williams', email: 'd.williams@example.com', pointsEarned: '300', avatar: '👨‍🏫' },
];

// --- Main Component ---

export default function ReferralPage() {
  const router = useRouter();
  const [copied, setCopied] = useState(false); // State to track if copied

  const userReferralCode = 'GOLDMINER2024';
  const totalReferrals = mockReferrals.length;
  const totalEarnings = '$42.50'; // Example value

  const handleBackPress = () => {
    router.back();
  };

  // Function to copy code and show feedback
  const handleCopyCode = async () => {
    await Clipboard.setStringAsync(userReferralCode);
    setCopied(true);
    Alert.alert('Copied!', 'Referral code copied to clipboard.');
    // Reset the "copied" state after a few seconds
    setTimeout(() => setCopied(false), 2000);
  };

  const renderReferralItem = ({ item }: { item: ReferralItem }) => (
    <View style={styles.referralItemContainer}>
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarText}>{item.avatar}</Text>
      </View>
      <View style={styles.referralDetails}>
        <Text style={styles.referralName}>{item.name}</Text>
        <Text style={styles.referralEmail}>{item.email}</Text>
      </View>
      <View style={styles.pointsContainer}>
        <Text style={styles.pointsEarned}>{item.pointsEarned} pts</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Referral Program</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Referral Highlight Card */}
        <View style={styles.referralCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Your Referral Code</Text>
            <TouchableOpacity onPress={handleCopyCode} style={styles.copyButton}>
              <Ionicons 
                name={copied ? "checkmark-circle" : "copy-outline"} 
                size={20} 
                color="#FFC000" 
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.referralCode}>{userReferralCode}</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalReferrals}</Text>
              <Text style={styles.statLabel}>Total Referrals</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalEarnings}</Text>
              <Text style={styles.statLabel}>Total Earnings</Text>
            </View>
          </View>
        </View>

        {/* Referrals List */}
        <Text style={styles.listTitle}>History</Text>
        <View style={{ marginBottom: 30 }}>
            <FlatList
            data={mockReferrals}
            keyExtractor={(item) => item.id}
            renderItem={renderReferralItem}
            scrollEnabled={false} // Main ScrollView handles scrolling
            />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Styles ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  backButton: {
    padding: 4,
    marginEnd: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  referralCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  copyButtonText: {
    color: '#FFC000',
    fontWeight: '600',
    marginLeft: 4,
  },
  referralCode: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFC000',
    letterSpacing: 1.5,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212529',
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: '70%',
    backgroundColor: '#E9ECEF',
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 16,
  },
  referralItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 5,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 24,
  },
  referralDetails: {
    flex: 1,
  },
  referralName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
  },
  referralEmail: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  pointsContainer: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  pointsEarned: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2E7D32', // A green color
  },
});