import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

type Wallet = {
  id: string;
  name: string;
  address: string;
  coin: string;
  balance: string;
  valueUSD: string;
  icon: string;
  color: string;
  isDefault: boolean;
};

export default function WalletScreen() {
  const router = useRouter();
  
  const [wallets, setWallets] = useState<Wallet[]>([
    {
      id: '1',
      name: 'Primary Bitcoin Wallet',
      address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      coin: 'BTC',
      balance: '0.5234',
      valueUSD: '$25,847.32',
      icon: '₿',
      color: '#F7931A',
      isDefault: true,
    },
    {
      id: '2',
      name: 'Ethereum Mining Wallet',
      address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
      coin: 'ETH',
      balance: '4.21',
      valueUSD: '$12,847.65',
      icon: 'Ξ',
      color: '#627EEA',
      isDefault: false,
    },
    {
      id: '3',
      name: 'Litecoin Payments',
      address: 'LbTjMx9TjF8b8v8Y8v8Y8v8Y8v8Y8v8Y8v8',
      coin: 'LTC',
      balance: '28.56',
      valueUSD: '$2,845.12',
      icon: 'Ł',
      color: '#BFBBBB',
      isDefault: false,
    },
    {
      id: '4',
      name: 'Dogecoin Wallet',
      address: 'D9iRh3XWq9q9q9q9q9q9q9q9q9q9q9q9q9q',
      coin: 'DOGE',
      balance: '12500',
      valueUSD: '$1,250.00',
      icon: 'Ð',
      color: '#C2A633',
      isDefault: false,
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newWallet, setNewWallet] = useState({
    name: '',
    address: '',
    coin: 'BTC',
  });

  const handleBackPress = () => {
    router.back();
  };

  const handleAddWallet = () => {
    if (!newWallet.name || !newWallet.address) {
      Alert.alert('Missing Information', 'Please fill in all fields.');
      return;
    }

    const newWalletObj: Wallet = {
      id: Date.now().toString(),
      name: newWallet.name,
      address: newWallet.address,
      coin: newWallet.coin,
      balance: '0.00',
      valueUSD: '$0.00',
      icon: '₿',
      color: '#FFC000',
      isDefault: false,
    };

    setWallets(prev => [...prev, newWalletObj]);
    setNewWallet({ name: '', address: '', coin: 'BTC' });
    setShowAddForm(false);
    
    Alert.alert('Success', 'New wallet address added successfully!');
  };

  const handleSetDefault = (walletId: string) => {
    setWallets(prev =>
      prev.map(wallet => ({
        ...wallet,
        isDefault: wallet.id === walletId
      }))
    );
  };

  const handleDeleteWallet = (walletId: string) => {
    Alert.alert(
      'Delete Wallet',
      'Are you sure you want to delete this wallet address?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setWallets(prev => prev.filter(wallet => wallet.id !== walletId));
          }
        }
      ]
    );
  };

  const handleCopyAddress = (address: string) => {
    // In a real app, you would use Clipboard API
    Alert.alert('Copied!', 'Wallet address copied to clipboard.');
  };

  const coins = [
    { symbol: 'BTC', name: 'Bitcoin', icon: '₿', color: '#F7931A' },
    { symbol: 'ETH', name: 'Ethereum', icon: 'Ξ', color: '#627EEA' },
    { symbol: 'LTC', name: 'Litecoin', icon: 'Ł', color: '#BFBBBB' },
    { symbol: 'DOGE', name: 'Dogecoin', icon: 'Ð', color: '#C2A633' },
    { symbol: 'ADA', name: 'Cardano', icon: 'A', color: '#0033AD' },
    { symbol: 'XRP', name: 'Ripple', icon: 'X', color: '#23292F' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Wallet Manager</Text>
        
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddForm(true)}
        >
          <Ionicons name="add" size={24} color="#FFC000" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Total Balance */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceAmount}>$42,789.09</Text>
          <Text style={styles.balanceSubtext}>Across all wallets</Text>
          
          <View style={styles.balanceActions}>
            <TouchableOpacity style={styles.balanceActionButton}>
              <Ionicons name="arrow-up" size={20} color="#000" />
              <Text style={styles.balanceActionText}>Send</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.balanceActionButton}>
              <Ionicons name="arrow-down" size={20} color="#000" />
              <Text style={styles.balanceActionText}>Receive</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.balanceActionButton}>
              <Ionicons name="swap-horizontal" size={20} color="#000" />
              <Text style={styles.balanceActionText}>Swap</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Add Wallet Form */}
        {showAddForm && (
          <View style={styles.addFormCard}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>Add New Wallet</Text>
              <TouchableOpacity onPress={() => setShowAddForm(false)}>
                <Ionicons name="close" size={24} color="#8E8E93" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Wallet Name</Text>
              <TextInput
                style={styles.input}
                value={newWallet.name}
                onChangeText={(text) => setNewWallet(prev => ({ ...prev, name: text }))}
                placeholder="e.g., Mining Wallet"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Coin</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.coinSelector}>
                {coins.map(coin => (
                  <TouchableOpacity
                    key={coin.symbol}
                    style={[
                      styles.coinOption,
                      newWallet.coin === coin.symbol && styles.coinOptionActive
                    ]}
                    onPress={() => setNewWallet(prev => ({ ...prev, coin: coin.symbol }))}
                  >
                    <Text style={styles.coinIcon}>{coin.icon}</Text>
                    <Text style={styles.coinSymbol}>{coin.symbol}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Wallet Address</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={newWallet.address}
                onChangeText={(text) => setNewWallet(prev => ({ ...prev, address: text }))}
                placeholder="Paste wallet address here"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
            
            <TouchableOpacity 
              style={styles.addWalletButton}
              onPress={handleAddWallet}
            >
              <Text style={styles.addWalletButtonText}>Add Wallet</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Wallets List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Wallets</Text>
          
          {wallets.length > 0 ? (
            wallets.map((wallet) => (
              <View key={wallet.id} style={styles.walletCard}>
                <View style={styles.walletHeader}>
                  <View style={styles.walletInfo}>
                    <View style={[styles.walletIcon, { backgroundColor: wallet.color }]}>
                      <Text style={styles.walletIconText}>{wallet.icon}</Text>
                    </View>
                    <View>
                      <Text style={styles.walletName}>{wallet.name}</Text>
                      <Text style={styles.walletCoin}>{wallet.coin}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.walletActions}>
                    {!wallet.isDefault && (
                      <TouchableOpacity
                        style={styles.walletActionButton}
                        onPress={() => handleSetDefault(wallet.id)}
                      >
                        <Ionicons name="star-outline" size={18} color="#FFC000" />
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={styles.walletActionButton}
                      onPress={() => handleDeleteWallet(wallet.id)}
                    >
                      <Ionicons name="trash-outline" size={18} color="#FF3B30" />
                    </TouchableOpacity>
                  </View>
                </View>
                
                <View style={styles.walletBalance}>
                  <View>
                    <Text style={styles.balanceAmountSmall}>{wallet.balance} {wallet.coin}</Text>
                    <Text style={styles.balanceUSD}>{wallet.valueUSD}</Text>
                  </View>
                  
                  {wallet.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Ionicons name="star" size={14} color="#000" />
                      <Text style={styles.defaultBadgeText}>Default</Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.walletAddress}>
                  <Text style={styles.addressLabel}>Address:</Text>
                  <View style={styles.addressContainer}>
                    <Text style={styles.addressText} numberOfLines={1}>
                      {wallet.address}
                    </Text>
                    <TouchableOpacity
                      style={styles.copyButton}
                      onPress={() => handleCopyAddress(wallet.address)}
                    >
                      <Ionicons name="copy-outline" size={18} color="#007AFF" />
                    </TouchableOpacity>
                  </View>
                </View>
                
                <View style={styles.walletActionsRow}>
                  <TouchableOpacity style={styles.walletAction}>
                    <Ionicons name="arrow-up" size={18} color="#FFC000" />
                    <Text style={styles.walletActionText}>Send</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.walletAction}>
                    <Ionicons name="arrow-down" size={18} color="#FFC000" />
                    <Text style={styles.walletActionText}>Receive</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.walletAction}>
                    <Ionicons name="swap-horizontal" size={18} color="#FFC000" />
                    <Text style={styles.walletActionText}>Swap</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.walletAction}>
                    <Ionicons name="eye-outline" size={18} color="#FFC000" />
                    <Text style={styles.walletActionText}>View</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="wallet-outline" size={64} color="#E5E5EA" />
              <Text style={styles.emptyTitle}>No Wallets Added</Text>
              <Text style={styles.emptySubtitle}>
                Add your first wallet address to get started
              </Text>
            </View>
          )}
        </View>

        {/* Wallet Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Wallet Safety Tips</Text>
          
          <View style={styles.tipItem}>
            <Ionicons name="shield-checkmark" size={18} color="#34C759" />
            <Text style={styles.tipText}>
              Never share your private keys or seed phrases with anyone
            </Text>
          </View>
          
          <View style={styles.tipItem}>
            <Ionicons name="shield-checkmark" size={18} color="#34C759" />
            <Text style={styles.tipText}>
              Use hardware wallets for large amounts of cryptocurrency
            </Text>
          </View>
          
          <View style={styles.tipItem}>
            <Ionicons name="shield-checkmark" size={18} color="#34C759" />
            <Text style={styles.tipText}>
              Double-check wallet addresses before sending transactions
            </Text>
          </View>
          
          <View style={styles.tipItem}>
            <Ionicons name="shield-checkmark" size={18} color="#34C759" />
            <Text style={styles.tipText}>
              Keep multiple backups of your wallet recovery phrases
            </Text>
          </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  addButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  balanceCard: {
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
  balanceLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  balanceSubtext: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 24,
  },
  balanceActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  balanceActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFC000',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  balanceActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  addFormCard: {
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
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6C757D',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#212529',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  textArea: {
    minHeight: 80,
    paddingTop: 14,
  },
  coinSelector: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  coinOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    minWidth: 80,
  },
  coinOptionActive: {
    backgroundColor: '#FFF8E6',
    borderColor: '#FFC000',
  },
  coinIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  coinSymbol: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  addWalletButton: {
    backgroundColor: '#FFC000',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  addWalletButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
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
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 20,
  },
  walletCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  walletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  walletInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  walletIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  walletIconText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  walletName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  walletCoin: {
    fontSize: 14,
    color: '#8E8E93',
  },
  walletActions: {
    flexDirection: 'row',
    gap: 8,
  },
  walletActionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  walletBalance: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  balanceAmountSmall: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  balanceUSD: {
    fontSize: 16,
    color: '#8E8E93',
  },
  defaultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFC000',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  defaultBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
  },
  walletAddress: {
    marginBottom: 16,
  },
  addressLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 4,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  addressText: {
    flex: 1,
    fontSize: 14,
    color: '#212529',
    fontFamily: 'monospace',
  },
  copyButton: {
    padding: 4,
  },
  walletActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  walletAction: {
    alignItems: 'center',
    paddingVertical: 8,
    flex: 1,
  },
  walletActionText: {
    fontSize: 12,
    color: '#000000',
    marginTop: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 24,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    color: '#6C757D',
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  bottomSpacer: {
    height: 30,
  },
});