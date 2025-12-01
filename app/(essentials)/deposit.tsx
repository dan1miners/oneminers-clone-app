import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';

// --- Mock Data & Types ---

// Define the structure for a cryptocurrency asset
type CryptoAsset = {
  id: string; // e.g., 'btc'
  name: string; // e.g., 'Bitcoin'
  symbol: string; // e.g., 'BTC'
  balance: string;
  network: string;
};

// Define the structure for a single transaction entry
type TransactionItem = {
  id: string;
  assetId: string; // To link the transaction to a crypto asset
  amount: string;
  status: 'Completed' | 'Pending' | 'Failed';
  timestamp: string;
};

// Mock data for available crypto assets
const mockCryptoAssets: CryptoAsset[] = [
  { id: 'btc', name: 'Bitcoin', symbol: 'BTC', balance: '0.01234567', network: 'Bitcoin Network' },
  { id: 'eth', name: 'Ethereum', symbol: 'ETH', balance: '1.57890', network: 'ERC20 Network' },
  { id: 'usdt', name: 'Tether', symbol: 'USDT', balance: '500.00', network: 'TRC20 Network' },
];

// Mock data for transactions
const mockTransactions: TransactionItem[] = [
  { id: 'tx1', assetId: 'btc', amount: '0.005', status: 'Completed', timestamp: '2023-10-27 10:30 AM' },
  { id: 'tx2', assetId: 'eth', amount: '0.8', status: 'Completed', timestamp: '2023-10-26 09:15 PM' },
  { id: 'tx3', assetId: 'btc', amount: '0.021', status: 'Pending', timestamp: '2023-10-26 05:00 PM' },
  { id: 'tx4', assetId: 'usdt', amount: '150.00', status: 'Completed', timestamp: '2023-10-25 11:00 AM' },
  { id: 'tx5', assetId: 'eth', amount: '1.2', status: 'Failed', timestamp: '2023-10-24 04:45 PM' },
];

// Mock deposit addresses for each crypto
const depositAddresses: { [key: string]: string } = {
  btc: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
  eth: '0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7',
  usdt: 'TRX9cQiVWtPAGaG8tKxYRnkGfQmXk3m3Jf',
};

// QR Code generation function
const generateQRCode = (text: string): string => {
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`;
};

// --- Main Component ---

export default function DepositPage() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState(mockCryptoAssets[0].id);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  // Find the data for the currently selected crypto
  const currentCryptoData = mockCryptoAssets.find(crypto => crypto.id === selectedCrypto);
  const currentAddress = depositAddresses[selectedCrypto];

  // Generate QR code when crypto changes
  useEffect(() => {
    if (currentAddress) {
      const qrUrl = generateQRCode(currentAddress);
      setQrCodeUrl(qrUrl);
    }
  }, [currentAddress]);

  // Filter transactions based on the selected crypto
  const filteredTransactions = mockTransactions.filter(tx => tx.assetId === selectedCrypto);

  const handleBackPress = () => {
    router.back();
  };

  const handleCopyAddress = async () => {
    if (currentAddress) {
      await Clipboard.setStringAsync(currentAddress);
      setCopied(true);
      Alert.alert('Copied!', 'Deposit address copied to clipboard.');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const renderTransactionItem = ({ item }: { item: TransactionItem }) => (
    <View style={styles.transactionItemContainer}>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionAmount}>+ {item.amount} {currentCryptoData?.symbol}</Text>
        <Text style={styles.transactionTimestamp}>{item.timestamp}</Text>
      </View>
      <View style={[
        styles.statusContainer, 
        item.status === 'Completed' ? styles.statusCompleted : 
        item.status === 'Pending' ? styles.statusPending : 
        styles.statusFailed
      ]}>
        <Text style={[
          styles.statusText,
          item.status === 'Completed' ? styles.statusTextCompleted :
          item.status === 'Pending' ? styles.statusTextPending :
          styles.statusTextFailed
        ]}>{item.status}</Text>
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
        <Text style={styles.headerTitle}>Deposit</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Crypto Selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cryptoSelectorContainer}>
          {mockCryptoAssets.map((crypto) => (
            <TouchableOpacity
              key={crypto.id}
              style={[
                styles.cryptoButton,
                selectedCrypto === crypto.id && styles.cryptoButtonActive,
              ]}
              onPress={() => setSelectedCrypto(crypto.id)}
            >
              <Text style={[
                styles.cryptoButtonText,
                selectedCrypto === crypto.id && styles.cryptoButtonTextActive,
              ]}>
                {crypto.symbol}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Deposit Card */}
        <View style={styles.depositCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Deposit {currentCryptoData?.name}</Text>
            <TouchableOpacity onPress={handleCopyAddress} style={styles.copyButton}>
              <Ionicons 
                name={copied ? "checkmark-circle" : "copy-outline"} 
                size={20} 
                color="#FFC000" 
              />
            </TouchableOpacity>
          </View>
          
          {/* QR Code */}
          <View style={styles.qrCodeContainer}>
            {qrCodeUrl ? (
              <Image 
                source={{ uri: qrCodeUrl }}
                style={styles.qrCodeImage}
                resizeMode="contain"
              />
            ) : (
              <View style={styles.qrCodePlaceholder}>
                <Text>Loading QR Code...</Text>
              </View>
            )}
          </View>

          <Text style={styles.depositAddress}>{currentAddress}</Text>
          
          <View style={styles.warningBox}>
            <Ionicons name="warning-outline" size={16} color="#FF9500" />
            <Text style={styles.warningText}>
              Only send {currentCryptoData?.symbol} to this address. Sending other coins may result in permanent loss.
            </Text>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{currentCryptoData?.balance}</Text>
              <Text style={styles.statLabel}>{currentCryptoData?.symbol} Balance</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{currentCryptoData?.network}</Text>
              <Text style={styles.statLabel}>Network</Text>
            </View>
          </View>
        </View>

        {/* Transactions List */}
        <Text style={styles.listTitle}>Recent Transactions</Text>
        <View style={{ marginBottom: 30 }}>
            <FlatList
            data={filteredTransactions}
            keyExtractor={(item) => item.id}
            renderItem={renderTransactionItem}
            scrollEnabled={false} // Main ScrollView handles scrolling
            ListEmptyComponent={<Text style={styles.emptyText}>No transactions yet.</Text>}
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
  cryptoSelectorContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  cryptoButton: {
    marginRight: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#E9ECEF',
  },
  cryptoButtonActive: {
    backgroundColor: '#FFC000',
  },
  cryptoButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
  },
  cryptoButtonTextActive: {
    color: '#FFFFFF',
  },
  depositCard: {
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
    backgroundColor: '#F0F8FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  qrCodeContainer: {
    marginVertical: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrCodeImage: {
    width: Dimensions.get('window').width * 0.5,
    height: Dimensions.get('window').width * 0.5,
  },
  qrCodePlaceholder: {
    width: Dimensions.get('window').width * 0.5,
    height: Dimensions.get('window').width * 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
  },
  depositAddress: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: '#FFF8E1',
    padding: 12,
    borderRadius: 8,
    width: '100%',
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  warningText: {
    fontSize: 12,
    color: '#8B6914', // Dark yellow
    marginLeft: 8,
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
    paddingTop: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
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
  transactionItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
  },
  transactionTimestamp: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  statusContainer: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusCompleted: {
    backgroundColor: '#E8F5E9',
  },
  statusPending: {
    backgroundColor: '#FFF8E1',
  },
  statusFailed: {
    backgroundColor: '#FFEBEE',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusTextCompleted: {
    color: '#2E7D32', // Green
  },
  statusTextPending: {
    color: '#F57C00', // Orange
  },
  statusTextFailed: {
    color: '#C62828', // Red
  },
  emptyText: {
    textAlign: 'center',
    color: '#8E8E93',
    marginTop: 20,
  },
});