import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// --- Mock Data & Types ---

type CryptoAsset = {
  id: string;
  name: string;
  symbol: string;
  balance: string;
  network: string;
  fee: string;
};

type WithdrawalTransaction = {
  id: string;
  assetId: string;
  amount: string;
  address: string;
  status: 'Completed' | 'Pending' | 'Failed' | 'Processing';
  timestamp: string;
  txHash?: string;
};

// Mock data for available crypto assets
const mockCryptoAssets: CryptoAsset[] = [
  { 
    id: 'btc', 
    name: 'Bitcoin', 
    symbol: 'BTC', 
    balance: '0.01234567', 
    network: 'Bitcoin Network',
    fee: '0.0005'
  },
  { 
    id: 'eth', 
    name: 'Ethereum', 
    symbol: 'ETH', 
    balance: '1.57890', 
    network: 'ERC20 Network',
    fee: '0.003'
  },
  { 
    id: 'usdt', 
    name: 'Tether', 
    symbol: 'USDT', 
    balance: '500.00', 
    network: 'TRC20 Network',
    fee: '1.0'
  },
];

// Mock data for withdrawal transactions
const mockWithdrawals: WithdrawalTransaction[] = [
  { 
    id: 'wd1', 
    assetId: 'btc', 
    amount: '0.001', 
    address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    status: 'Completed', 
    timestamp: '2023-10-27 10:30 AM',
    txHash: 'a1b2c3d4e5f6...'
  },
  { 
    id: 'wd2', 
    assetId: 'eth', 
    amount: '0.5', 
    address: '0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7',
    status: 'Processing', 
    timestamp: '2023-10-26 09:15 PM',
    txHash: 'x1y2z3...'
  },
  { 
    id: 'wd3', 
    assetId: 'btc', 
    amount: '0.002', 
    address: 'bc1qwertyuiopasdfghjklzxcvbnm123456',
    status: 'Pending', 
    timestamp: '2023-10-26 05:00 PM'
  },
  { 
    id: 'wd4', 
    assetId: 'usdt', 
    amount: '100.00', 
    address: 'TRX9cQiVWtPAGaG8tKxYRnkGfQmXk3m3Jf',
    status: 'Completed', 
    timestamp: '2023-10-25 11:00 AM',
    txHash: 'q1w2e3r4...'
  },
  { 
    id: 'wd5', 
    assetId: 'eth', 
    amount: '1.0', 
    address: '0xinvalidaddress123',
    status: 'Failed', 
    timestamp: '2023-10-24 04:45 PM'
  },
];

// --- Main Component ---

export default function WithdrawPage() {
  const router = useRouter();
  const [selectedCrypto, setSelectedCrypto] = useState(mockCryptoAssets[0].id);
  const [withdrawalAddress, setWithdrawalAddress] = useState('');
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Find the data for the currently selected crypto
  const currentCryptoData = mockCryptoAssets.find(crypto => crypto.id === selectedCrypto);

  // Filter withdrawals based on the selected crypto
  const filteredWithdrawals = mockWithdrawals.filter(tx => tx.assetId === selectedCrypto);

  // Calculate available balance (subtract fee)
  const availableBalance = currentCryptoData ? 
    (parseFloat(currentCryptoData.balance) - parseFloat(currentCryptoData.fee)).toFixed(8) : '0';

  const handleBackPress = () => {
    router.back();
  };

  const handleMaxAmount = () => {
    if (currentCryptoData) {
      setWithdrawalAmount(availableBalance);
    }
  };

  const handleWithdraw = () => {
    if (!withdrawalAddress.trim()) {
      Alert.alert('Error', 'Please enter a valid withdrawal address.');
      return;
    }

    if (!withdrawalAmount || parseFloat(withdrawalAmount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount.');
      return;
    }

    if (currentCryptoData && parseFloat(withdrawalAmount) > parseFloat(availableBalance)) {
      Alert.alert('Error', 'Insufficient balance.');
      return;
    }

    setShowConfirmModal(true);
  };

  const confirmWithdrawal = () => {
    setIsProcessing(true);
    setShowConfirmModal(false);
    
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      Alert.alert(
        'Success', 
        `Withdrawal of ${withdrawalAmount} ${currentCryptoData?.symbol} has been submitted for processing.`,
        [{ text: 'OK', onPress: () => {
          setWithdrawalAddress('');
          setWithdrawalAmount('');
        }}]
      );
    }, 2000);
  };

  const renderWithdrawalItem = ({ item }: { item: WithdrawalTransaction }) => (
    <View style={styles.withdrawalItemContainer}>
      <View style={styles.withdrawalDetails}>
        <Text style={styles.withdrawalAmount}>- {item.amount} {currentCryptoData?.symbol}</Text>
        <Text style={styles.withdrawalAddress} numberOfLines={1}>
          To: {item.address}
        </Text>
        <Text style={styles.withdrawalTimestamp}>{item.timestamp}</Text>
        {item.txHash && (
          <Text style={styles.txHash} numberOfLines={1}>
            TX: {item.txHash}
          </Text>
        )}
      </View>
      <View style={[
        styles.statusContainer, 
        item.status === 'Completed' ? styles.statusCompleted : 
        item.status === 'Processing' ? styles.statusProcessing :
        item.status === 'Pending' ? styles.statusPending : 
        styles.statusFailed
      ]}>
        <Text style={[
          styles.statusText,
          item.status === 'Completed' ? styles.statusTextCompleted :
          item.status === 'Processing' ? styles.statusTextProcessing :
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
        <Text style={styles.headerTitle}>Withdraw</Text>
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

        {/* Withdrawal Form Card */}
        <View style={styles.withdrawalCard}>
          <Text style={styles.cardTitle}>Withdraw {currentCryptoData?.name}</Text>
          
          {/* Balance Info */}
          <View style={styles.balanceInfo}>
            <View style={styles.balanceRow}>
              <Text style={styles.balanceLabel}>Available Balance:</Text>
              <Text style={styles.balanceValue}>{availableBalance} {currentCryptoData?.symbol}</Text>
            </View>
            <View style={styles.balanceRow}>
              <Text style={styles.balanceLabel}>Network Fee:</Text>
              <Text style={styles.balanceValue}>{currentCryptoData?.fee} {currentCryptoData?.symbol}</Text>
            </View>
            <View style={styles.balanceRow}>
              <Text style={styles.balanceLabel}>Network:</Text>
              <Text style={styles.balanceValue}>{currentCryptoData?.network}</Text>
            </View>
          </View>

          {/* Withdrawal Address */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Withdrawal Address</Text>
            <TextInput
              style={styles.textInput}
              placeholder={`Enter ${currentCryptoData?.symbol} address`}
              value={withdrawalAddress}
              onChangeText={setWithdrawalAddress}
              placeholderTextColor="#8E8E93"
            />
          </View>

          {/* Amount Input */}
          <View style={styles.inputContainer}>
            <View style={styles.amountHeader}>
              <Text style={styles.inputLabel}>Amount</Text>
              <TouchableOpacity onPress={handleMaxAmount}>
                <Text style={styles.maxButton}>MAX</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.amountInputContainer}>
              <TextInput
                style={styles.amountInput}
                placeholder="0.00"
                value={withdrawalAmount}
                onChangeText={setWithdrawalAmount}
                keyboardType="decimal-pad"
                placeholderTextColor="#8E8E93"
              />
              <Text style={styles.currencySymbol}>{currentCryptoData?.symbol}</Text>
            </View>
          </View>

          {/* Calculation Preview */}
          {withdrawalAmount && parseFloat(withdrawalAmount) > 0 && (
            <View style={styles.calculationContainer}>
              <View style={styles.calcRow}>
                <Text style={styles.calcLabel}>You will receive:</Text>
                <Text style={styles.calcValue}>
                  {(parseFloat(withdrawalAmount) - parseFloat(currentCryptoData?.fee || '0')).toFixed(8)} {currentCryptoData?.symbol}
                </Text>
              </View>
              <View style={styles.calcRow}>
                <Text style={styles.calcLabel}>Network fee:</Text>
                <Text style={styles.calcValue}>{currentCryptoData?.fee} {currentCryptoData?.symbol}</Text>
              </View>
            </View>
          )}

          {/* Withdraw Button */}
          <TouchableOpacity 
            style={[
              styles.withdrawButton,
              (!withdrawalAddress || !withdrawalAmount || isProcessing) && styles.withdrawButtonDisabled
            ]}
            onPress={handleWithdraw}
            disabled={!withdrawalAddress || !withdrawalAmount || isProcessing}
          >
            {isProcessing ? (
              <Text style={styles.withdrawButtonText}>Processing...</Text>
            ) : (
              <Text style={styles.withdrawButtonText}>Withdraw</Text>
            )}
          </TouchableOpacity>

          {/* Warning Box */}
          <View style={styles.warningBox}>
            <Ionicons name="warning-outline" size={16} color="#FF9500" />
            <Text style={styles.warningText}>
              Please double-check the withdrawal address. Transactions cannot be reversed once confirmed.
            </Text>
          </View>
        </View>

        {/* Recent Withdrawals List */}
        <Text style={styles.listTitle}>Recent Withdrawals</Text>
        <View style={{ marginBottom: 30 }}>
          <FlatList
            data={filteredWithdrawals}
            keyExtractor={(item) => item.id}
            renderItem={renderWithdrawalItem}
            scrollEnabled={false}
            ListEmptyComponent={<Text style={styles.emptyText}>No withdrawal history.</Text>}
          />
        </View>
      </ScrollView>

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Withdrawal</Text>
            
            <View style={styles.confirmationDetails}>
              <View style={styles.confirmRow}>
                <Text style={styles.confirmLabel}>Amount:</Text>
                <Text style={styles.confirmValue}>{withdrawalAmount} {currentCryptoData?.symbol}</Text>
              </View>
              <View style={styles.confirmRow}>
                <Text style={styles.confirmLabel}>Network Fee:</Text>
                <Text style={styles.confirmValue}>{currentCryptoData?.fee} {currentCryptoData?.symbol}</Text>
              </View>
              <View style={styles.confirmRow}>
                <Text style={styles.confirmLabel}>You Receive:</Text>
                <Text style={styles.confirmValue}>
                  {(parseFloat(withdrawalAmount) - parseFloat(currentCryptoData?.fee || '0')).toFixed(8)} {currentCryptoData?.symbol}
                </Text>
              </View>
              <View style={styles.confirmRow}>
                <Text style={styles.confirmLabel}>To Address:</Text>
                <Text style={styles.confirmAddress} numberOfLines={2}>{withdrawalAddress}</Text>
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowConfirmModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.confirmButton}
                onPress={confirmWithdrawal}
              >
                <Text style={styles.confirmButtonText}>Confirm Withdrawal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  withdrawalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 16,
  },
  balanceInfo: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  balanceValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212529',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  amountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  maxButton: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFC000',
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  amountInput: {
    flex: 1,
    padding: 16,
    fontSize: 18,
    fontWeight: '600',
  },
  currencySymbol: {
    padding: 16,
    fontSize: 16,
    fontWeight: '600',
    color: '#8E8E93',
  },
  calculationContainer: {
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  calcRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  calcLabel: {
    fontSize: 14,
    color: '#FFC000',
  },
  calcValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFC000',
  },
  withdrawButton: {
    backgroundColor: '#FFC000',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  withdrawButtonDisabled: {
    backgroundColor: '#E9ECEF',
  },
  withdrawButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: '#FFF8E1',
    padding: 12,
    borderRadius: 8,
    alignItems: 'flex-start',
  },
  warningText: {
    fontSize: 12,
    color: '#8B6914',
    marginLeft: 8,
    flex: 1,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 16,
  },
  withdrawalItemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  withdrawalDetails: {
    flex: 1,
    marginRight: 12,
  },
  withdrawalAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
  },
  withdrawalAddress: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
  },
  withdrawalTimestamp: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  txHash: {
    fontSize: 10,
    color: '#8E8E93',
    marginTop: 2,
  },
  statusContainer: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    minWidth: 80,
    alignItems: 'center',
  },
  statusCompleted: {
    backgroundColor: '#E8F5E9',
  },
  statusProcessing: {
    backgroundColor: '#E3F2FD',
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
    color: '#2E7D32',
  },
  statusTextProcessing: {
    color: '#1565C0',
  },
  statusTextPending: {
    color: '#F57C00',
  },
  statusTextFailed: {
    color: '#C62828',
  },
  emptyText: {
    textAlign: 'center',
    color: '#8E8E93',
    marginTop: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 20,
    textAlign: 'center',
  },
  confirmationDetails: {
    marginBottom: 24,
  },
  confirmRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  confirmLabel: {
    fontSize: 14,
    color: '#8E8E93',
    flex: 1,
  },
  confirmValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212529',
    flex: 1,
    textAlign: 'right',
  },
  confirmAddress: {
    fontSize: 12,
    color: '#8E8E93',
    flex: 1,
    textAlign: 'right',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#E9ECEF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8E8E93',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#FFC000',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});