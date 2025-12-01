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
  price: number; // USD price
  change24h: string;
  icon: string;
};

type ExchangePair = {
  from: string;
  to: string;
  rate: number;
  fee: number; // percentage
  minAmount: number;
};

type ExchangeTransaction = {
  id: string;
  fromAsset: string;
  toAsset: string;
  fromAmount: string;
  toAmount: string;
  rate: number;
  status: 'Completed' | 'Pending' | 'Failed' | 'Processing';
  timestamp: string;
};

// Mock data for available crypto assets
const mockCryptoAssets: CryptoAsset[] = [
  { 
    id: 'btc', 
    name: 'Bitcoin', 
    symbol: 'BTC', 
    balance: '0.01234567', 
    price: 45000,
    change24h: '+2.3%',
    icon: '🟠'
  },
  { 
    id: 'eth', 
    name: 'Ethereum', 
    symbol: 'ETH', 
    balance: '1.57890', 
    price: 3200,
    change24h: '+1.8%',
    icon: '🟣'
  },
  { 
    id: 'usdt', 
    name: 'Tether', 
    symbol: 'USDT', 
    balance: '500.00', 
    price: 1,
    change24h: '0.0%',
    icon: '💎'
  },
  { 
    id: 'aleo', 
    name: 'Aleo', 
    symbol: 'ALEO', 
    balance: '1250.50', 
    price: 2.25,
    change24h: '+5.7%',
    icon: '🔵'
  },
  { 
    id: 'kas', 
    name: 'Kaspa', 
    symbol: 'KAS', 
    balance: '320931.17', 
    price: 0.05,
    change24h: '+1.2%',
    icon: '🟢'
  },
  { 
    id: 'sol', 
    name: 'Solana', 
    symbol: 'SOL', 
    balance: '15.75', 
    price: 180,
    change24h: '+3.1%',
    icon: '🟡'
  },
];

// Mock exchange rates
const exchangeRates: ExchangePair[] = [
  { from: 'btc', to: 'eth', rate: 14.0625, fee: 0.1, minAmount: 0.001 },
  { from: 'btc', to: 'usdt', rate: 45000, fee: 0.1, minAmount: 0.001 },
  { from: 'btc', to: 'aleo', rate: 20000, fee: 0.1, minAmount: 0.001 },
  { from: 'btc', to: 'kas', rate: 900000, fee: 0.1, minAmount: 0.001 },
  { from: 'btc', to: 'sol', rate: 250, fee: 0.1, minAmount: 0.001 },
  
  { from: 'eth', to: 'btc', rate: 0.0711, fee: 0.1, minAmount: 0.01 },
  { from: 'eth', to: 'usdt', rate: 3200, fee: 0.1, minAmount: 0.01 },
  { from: 'eth', to: 'aleo', rate: 1422.22, fee: 0.1, minAmount: 0.01 },
  { from: 'eth', to: 'kas', rate: 64000, fee: 0.1, minAmount: 0.01 },
  { from: 'eth', to: 'sol', rate: 17.78, fee: 0.1, minAmount: 0.01 },
  
  { from: 'usdt', to: 'btc', rate: 0.00002222, fee: 0.1, minAmount: 10 },
  { from: 'usdt', to: 'eth', rate: 0.0003125, fee: 0.1, minAmount: 10 },
  { from: 'usdt', to: 'aleo', rate: 0.4444, fee: 0.1, minAmount: 10 },
  { from: 'usdt', to: 'kas', rate: 20, fee: 0.1, minAmount: 10 },
  { from: 'usdt', to: 'sol', rate: 0.00556, fee: 0.1, minAmount: 10 },
  
  { from: 'aleo', to: 'btc', rate: 0.00005, fee: 0.1, minAmount: 10 },
  { from: 'aleo', to: 'eth', rate: 0.000703, fee: 0.1, minAmount: 10 },
  { from: 'aleo', to: 'usdt', rate: 2.25, fee: 0.1, minAmount: 10 },
  { from: 'aleo', to: 'kas', rate: 45, fee: 0.1, minAmount: 10 },
  { from: 'aleo', to: 'sol', rate: 0.0125, fee: 0.1, minAmount: 10 },
  
  { from: 'kas', to: 'btc', rate: 0.00000111, fee: 0.1, minAmount: 1000 },
  { from: 'kas', to: 'eth', rate: 0.00001563, fee: 0.1, minAmount: 1000 },
  { from: 'kas', to: 'usdt', rate: 0.05, fee: 0.1, minAmount: 1000 },
  { from: 'kas', to: 'aleo', rate: 0.02222, fee: 0.1, minAmount: 1000 },
  { from: 'kas', to: 'sol', rate: 0.000278, fee: 0.1, minAmount: 1000 },
  
  { from: 'sol', to: 'btc', rate: 0.004, fee: 0.1, minAmount: 0.1 },
  { from: 'sol', to: 'eth', rate: 0.05625, fee: 0.1, minAmount: 0.1 },
  { from: 'sol', to: 'usdt', rate: 180, fee: 0.1, minAmount: 0.1 },
  { from: 'sol', to: 'aleo', rate: 80, fee: 0.1, minAmount: 0.1 },
  { from: 'sol', to: 'kas', rate: 3600, fee: 0.1, minAmount: 0.1 },
];

// Mock exchange transactions
const mockExchanges: ExchangeTransaction[] = [
  { 
    id: 'ex1', 
    fromAsset: 'btc', 
    toAsset: 'eth', 
    fromAmount: '0.001', 
    toAmount: '0.01406',
    rate: 14.06,
    status: 'Completed', 
    timestamp: '2023-10-27 10:30 AM'
  },
  { 
    id: 'ex2', 
    fromAsset: 'eth', 
    toAsset: 'sol', 
    fromAmount: '0.5', 
    toAmount: '8.89',
    rate: 17.78,
    status: 'Processing', 
    timestamp: '2023-10-26 09:15 PM'
  },
  { 
    id: 'ex3', 
    fromAsset: 'usdt', 
    toAsset: 'aleo', 
    fromAmount: '100.00', 
    toAmount: '44.44',
    rate: 0.4444,
    status: 'Pending', 
    timestamp: '2023-10-26 05:00 PM'
  },
  { 
    id: 'ex4', 
    fromAsset: 'kas', 
    toAsset: 'btc', 
    fromAmount: '50000.00', 
    toAmount: '0.0555',
    rate: 0.00000111,
    status: 'Completed', 
    timestamp: '2023-10-25 11:00 AM'
  },
  { 
    id: 'ex5', 
    fromAsset: 'sol', 
    toAsset: 'eth', 
    fromAmount: '2.0', 
    toAmount: '0.1125',
    rate: 0.05625,
    status: 'Failed', 
    timestamp: '2023-10-24 04:45 PM'
  },
];

// --- Main Component ---

export default function ExchangePage() {
  const router = useRouter();
  const [fromAsset, setFromAsset] = useState(mockCryptoAssets[0].id);
  const [toAsset, setToAsset] = useState(mockCryptoAssets[1].id);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [showFromSelector, setShowFromSelector] = useState(false);
  const [showToSelector, setShowToSelector] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Find selected assets data
  const fromAssetData = mockCryptoAssets.find(crypto => crypto.id === fromAsset);
  const toAssetData = mockCryptoAssets.find(crypto => crypto.id === toAsset);

  // Find exchange rate
  const currentExchangeRate = exchangeRates.find(
    rate => rate.from === fromAsset && rate.to === toAsset
  );

  // Filter exchanges based on selected assets
  const filteredExchanges = mockExchanges.filter(
    ex => ex.fromAsset === fromAsset && ex.toAsset === toAsset
  );

  // Calculate exchange amount
  useEffect(() => {
    if (fromAmount && currentExchangeRate) {
      const amount = parseFloat(fromAmount);
      if (!isNaN(amount)) {
        const calculatedAmount = amount * currentExchangeRate.rate * (1 - currentExchangeRate.fee / 100);
        setToAmount(calculatedAmount.toFixed(8));
      } else {
        setToAmount('');
      }
    } else {
      setToAmount('');
    }
  }, [fromAmount, currentExchangeRate]);

  const handleBackPress = () => {
    router.back();
  };

  const handleSwapAssets = () => {
    const tempFrom = fromAsset;
    setFromAsset(toAsset);
    setToAsset(tempFrom);
    setFromAmount(toAmount);
  };

  const handleMaxAmount = () => {
    if (fromAssetData) {
      setFromAmount(fromAssetData.balance);
    }
  };

  const handleExchange = () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount.');
      return;
    }

    if (currentExchangeRate && parseFloat(fromAmount) < currentExchangeRate.minAmount) {
      Alert.alert('Error', `Minimum exchange amount is ${currentExchangeRate.minAmount} ${fromAssetData?.symbol}`);
      return;
    }

    if (fromAssetData && parseFloat(fromAmount) > parseFloat(fromAssetData.balance)) {
      Alert.alert('Error', 'Insufficient balance.');
      return;
    }

    setShowConfirmModal(true);
  };

  const confirmExchange = () => {
    setIsProcessing(true);
    setShowConfirmModal(false);
    
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      Alert.alert(
        'Success', 
        `Exchange of ${fromAmount} ${fromAssetData?.symbol} to ${toAmount} ${toAssetData?.symbol} has been submitted.`,
        [{ text: 'OK', onPress: () => {
          setFromAmount('');
          setToAmount('');
        }}]
      );
    }, 2000);
  };

  const renderAssetItem = (asset: CryptoAsset, onSelect: (id: string) => void, isFrom: boolean) => (
    <TouchableOpacity
      style={styles.assetItem}
      onPress={() => {
        onSelect(asset.id);
        isFrom ? setShowFromSelector(false) : setShowToSelector(false);
      }}
    >
      <View style={styles.assetIconContainer}>
        <Text style={styles.assetIcon}>{asset.icon}</Text>
      </View>
      <View style={styles.assetInfo}>
        <Text style={styles.assetName}>{asset.name}</Text>
        <Text style={styles.assetBalance}>{asset.balance} {asset.symbol}</Text>
      </View>
      <View style={styles.assetPrice}>
        <Text style={styles.assetPriceText}>${asset.price.toLocaleString()}</Text>
        <Text style={[
          styles.assetChange,
          { color: asset.change24h.startsWith('+') ? '#34C759' : asset.change24h.startsWith('-') ? '#FF3B30' : '#8E8E93' }
        ]}>
          {asset.change24h}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderExchangeItem = ({ item }: { item: ExchangeTransaction }) => {
    const fromAsset = mockCryptoAssets.find(a => a.id === item.fromAsset);
    const toAsset = mockCryptoAssets.find(a => a.id === item.toAsset);
    
    return (
      <View style={styles.exchangeItemContainer}>
        <View style={styles.exchangeDetails}>
          <View style={styles.exchangePair}>
            <View style={styles.assetPair}>
              <Text style={styles.assetPairIcon}>{fromAsset?.icon}</Text>
              <Text style={styles.assetPairIcon}>{toAsset?.icon}</Text>
            </View>
            <View style={styles.exchangeAmounts}>
              <Text style={styles.exchangeFromAmount}>- {item.fromAmount} {fromAsset?.symbol}</Text>
              <Text style={styles.exchangeToAmount}>+ {item.toAmount} {toAsset?.symbol}</Text>
            </View>
          </View>
          <Text style={styles.exchangeTimestamp}>{item.timestamp}</Text>
          <Text style={styles.exchangeRate}>Rate: 1 {fromAsset?.symbol} = {item.rate} {toAsset?.symbol}</Text>
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
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Exchange</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Exchange Card */}
        <View style={styles.exchangeCard}>
          <Text style={styles.cardTitle}>Quick Exchange</Text>
          
          {/* From Asset */}
          <View style={styles.assetSection}>
            <Text style={styles.sectionLabel}>From</Text>
            <TouchableOpacity 
              style={styles.assetSelector}
              onPress={() => setShowFromSelector(true)}
            >
              <View style={styles.selectedAsset}>
                <View style={styles.assetIconContainer}>
                  <Text style={styles.assetIcon}>{fromAssetData?.icon}</Text>
                </View>
                <View style={styles.assetSelectorInfo}>
                  <Text style={styles.assetSelectorName}>{fromAssetData?.name}</Text>
                  <Text style={styles.assetSelectorBalance}>
                    Balance: {fromAssetData?.balance} {fromAssetData?.symbol}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-down" size={20} color="#8E8E93" />
            </TouchableOpacity>
            
            <View style={styles.amountInputContainer}>
              <TextInput
                style={styles.amountInput}
                placeholder="0.00"
                value={fromAmount}
                onChangeText={setFromAmount}
                keyboardType="decimal-pad"
                placeholderTextColor="#8E8E93"
              />
              <TouchableOpacity onPress={handleMaxAmount}>
                <Text style={styles.maxButton}>MAX</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Swap Button */}
          <TouchableOpacity style={styles.swapButton} onPress={handleSwapAssets}>
            <Ionicons name="swap-vertical" size={24} color="#FFC000" />
          </TouchableOpacity>

          {/* To Asset */}
          <View style={styles.assetSection}>
            <Text style={styles.sectionLabel}>To</Text>
            <TouchableOpacity 
              style={styles.assetSelector}
              onPress={() => setShowToSelector(true)}
            >
              <View style={styles.selectedAsset}>
                <View style={styles.assetIconContainer}>
                  <Text style={styles.assetIcon}>{toAssetData?.icon}</Text>
                </View>
                <View style={styles.assetSelectorInfo}>
                  <Text style={styles.assetSelectorName}>{toAssetData?.name}</Text>
                  <Text style={styles.assetSelectorBalance}>
                    Balance: {toAssetData?.balance} {toAssetData?.symbol}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-down" size={20} color="#8E8E93" />
            </TouchableOpacity>
            
            <View style={styles.amountInputContainer}>
              <TextInput
                style={styles.amountInput}
                placeholder="0.00"
                value={toAmount}
                editable={false}
                placeholderTextColor="#8E8E93"
              />
              <Text style={styles.currencySymbol}>{toAssetData?.symbol}</Text>
            </View>
          </View>

          {/* Exchange Rate & Fee */}
          {currentExchangeRate && fromAmount && (
            <View style={styles.exchangeInfo}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Exchange Rate</Text>
                <Text style={styles.infoValue}>
                  1 {fromAssetData?.symbol} = {currentExchangeRate.rate} {toAssetData?.symbol}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Fee</Text>
                <Text style={styles.infoValue}>{currentExchangeRate.fee}%</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>You Receive</Text>
                <Text style={styles.infoValue}>
                  {toAmount} {toAssetData?.symbol}
                </Text>
              </View>
              {parseFloat(fromAmount) > 0 && parseFloat(fromAmount) < currentExchangeRate.minAmount && (
                <View style={styles.warningRow}>
                  <Ionicons name="warning-outline" size={16} color="#FF9500" />
                  <Text style={styles.warningText}>
                    Minimum exchange: {currentExchangeRate.minAmount} {fromAssetData?.symbol}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Exchange Button */}
          <TouchableOpacity 
            style={[
              styles.exchangeButton,
              (!fromAmount || !toAmount || isProcessing) && styles.exchangeButtonDisabled
            ]}
            onPress={handleExchange}
            disabled={!fromAmount || !toAmount || isProcessing}
          >
            {isProcessing ? (
              <Text style={styles.exchangeButtonText}>Processing...</Text>
            ) : (
              <Text style={styles.exchangeButtonText}>Exchange</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Recent Exchanges */}
        <Text style={styles.listTitle}>Recent Exchanges</Text>
        <View style={{ marginBottom: 30 }}>
          <FlatList
            data={filteredExchanges}
            keyExtractor={(item) => item.id}
            renderItem={renderExchangeItem}
            scrollEnabled={false}
            ListEmptyComponent={<Text style={styles.emptyText}>No exchange history.</Text>}
          />
        </View>
      </ScrollView>

      {/* From Asset Selector Modal */}
      <Modal
        visible={showFromSelector}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Asset</Text>
              <TouchableOpacity onPress={() => setShowFromSelector(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={mockCryptoAssets.filter(asset => asset.id !== toAsset)}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => renderAssetItem(item, setFromAsset, true)}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>

      {/* To Asset Selector Modal */}
      <Modal
        visible={showToSelector}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Asset</Text>
              <TouchableOpacity onPress={() => setShowToSelector(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={mockCryptoAssets.filter(asset => asset.id !== fromAsset)}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => renderAssetItem(item, setToAsset, false)}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Exchange</Text>
            
            <View style={styles.confirmationDetails}>
              <View style={styles.confirmRow}>
                <Text style={styles.confirmLabel}>You Send:</Text>
                <Text style={styles.confirmValue}>{fromAmount} {fromAssetData?.symbol}</Text>
              </View>
              <View style={styles.confirmRow}>
                <Text style={styles.confirmLabel}>You Receive:</Text>
                <Text style={styles.confirmValue}>{toAmount} {toAssetData?.symbol}</Text>
              </View>
              <View style={styles.confirmRow}>
                <Text style={styles.confirmLabel}>Exchange Rate:</Text>
                <Text style={styles.confirmValue}>
                  1 {fromAssetData?.symbol} = {currentExchangeRate?.rate} {toAssetData?.symbol}
                </Text>
              </View>
              <View style={styles.confirmRow}>
                <Text style={styles.confirmLabel}>Fee:</Text>
                <Text style={styles.confirmValue}>{currentExchangeRate?.fee}%</Text>
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
                onPress={confirmExchange}
              >
                <Text style={styles.confirmButtonText}>Confirm Exchange</Text>
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
  exchangeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 20,
    textAlign: 'center',
  },
  assetSection: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 8,
  },
  assetSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
  },
  selectedAsset: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  assetIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  assetIcon: {
    fontSize: 18,
  },
  assetSelectorInfo: {
    flex: 1,
  },
  assetSelectorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
  },
  assetSelectorBalance: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
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
  maxButton: {
    padding: 16,
    fontSize: 14,
    fontWeight: '600',
    color: '#FFC000',
  },
  currencySymbol: {
    padding: 16,
    fontSize: 16,
    fontWeight: '600',
    color: '#8E8E93',
  },
  swapButton: {
    alignSelf: 'center',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0F8FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  exchangeInfo: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212529',
  },
  warningRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  warningText: {
    fontSize: 12,
    color: '#FF9500',
    marginLeft: 8,
    flex: 1,
  },
  exchangeButton: {
    backgroundColor: '#FFC000',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  exchangeButtonDisabled: {
    backgroundColor: '#E9ECEF',
  },
  exchangeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 16,
  },
  exchangeItemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  exchangeDetails: {
    flex: 1,
    marginRight: 12,
  },
  exchangePair: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  assetPair: {
    flexDirection: 'row',
    marginRight: 12,
  },
  assetPairIcon: {
    fontSize: 16,
    marginRight: -8,
  },
  exchangeAmounts: {
    flex: 1,
  },
  exchangeFromAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
  },
  exchangeToAmount: {
    fontSize: 14,
    color: '#34C759',
    marginTop: 2,
  },
  exchangeTimestamp: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  exchangeRate: {
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
    padding: 20,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529',
  },
  assetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  assetInfo: {
    flex: 1,
    marginLeft: 12,
  },
  assetName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
  },
  assetBalance: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  assetPrice: {
    alignItems: 'flex-end',
  },
  assetPriceText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212529',
  },
  assetChange: {
    fontSize: 12,
    marginTop: 2,
  },
  confirmationDetails: {
    marginBottom: 24,
  },
  confirmRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  confirmLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  confirmValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212529',
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