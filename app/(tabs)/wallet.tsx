import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function WalletScreen() {
  const assets = [
    {
      name: 'Bitcoin',
      ticker: 'BTC',
      holdings: '0.362113 BTC',
      estimated: '$31,694.80',
      change: '+2.3%',
      icon: '🟠'
    },
    {
      name: 'Aleo',
      ticker: 'ALEO',
      holdings: '1,250.50 ALEO',
      estimated: '$2,845.25',
      change: '+5.7%',
      icon: '🔵'
    },
    {
      name: 'Kaspa',
      ticker: 'KAS',
      holdings: '320,931.17 KAS',
      estimated: '$15,913.54',
      change: '+1.2%',
      icon: '🟢'
    },
    {
      name: 'Ethereum',
      ticker: 'ETH',
      holdings: '2.45 ETH',
      estimated: '$8,245.60',
      change: '-0.8%',
      icon: '🟣'
    },
    {
      name: 'Solana',
      ticker: 'SOL',
      holdings: '15.75 SOL',
      estimated: '$2,835.00',
      change: '+3.1%',
      icon: '🟡'
    },
    {
      name: 'USDT',
      ticker: 'USDT',
      holdings: '5,250.00 USDT',
      estimated: '$5,250.00',
      change: '0.0%',
      icon: '💎'
    }
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Gold Balance Card */}
        <View style={styles.goldCard}>
          <View style={styles.balanceHeader}>
            <Text style={styles.totalBalanceLabel}>Total Balance</Text>
            <TouchableOpacity>
              <Ionicons name="eye-outline" size={20} color="#000" />
            </TouchableOpacity>
          </View>
          <Text style={styles.totalBalance}>$50,770.46</Text>
          
          <View style={styles.unpaidSection}>
            <View style={styles.unpaidRow}>
              <Text style={styles.unpaidLabel}>Unpaid Balance</Text>
              <Text style={styles.unpaidAmount}>$13.66</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={styles.progressFill} />
            </View>
          </View>
        </View>

        {/* Circular Action Buttons */}
        <View style={styles.actionGrid}>
          <View style={styles.actionColumn}>
            <TouchableOpacity style={styles.circleButton}>
              <View style={styles.circleButtonIcon}>
                <Ionicons name="arrow-down" size={20} color="#000" />
              </View>
              <Text style={styles.circleButtonText}>Deposit</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.actionColumn}>
            <TouchableOpacity style={styles.circleButton}>
              <View style={styles.circleButtonIcon}>
                <Ionicons name="arrow-up" size={20} color="#000" />
              </View>
              <Text style={styles.circleButtonText}>Withdraw</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.actionColumn}>
            <TouchableOpacity style={styles.circleButton}>
              <View style={styles.circleButtonIcon}>
                <Ionicons name="swap-horizontal" size={20} color="#000" />
              </View>
              <Text style={styles.circleButtonText}>Exchange</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.actionColumn}>
            <TouchableOpacity style={styles.circleButton}>
              <View style={styles.circleButtonIcon}>
                <Ionicons name="list" size={20} color="#000" />
              </View>
              <Text style={styles.circleButtonText}>Transactions</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Assets Section - NEW LAYOUT */}
        <View style={styles.assetsSection}>
          <Text style={styles.sectionTitle}>Assets</Text>
          
          {/* Single Card Container for the entire list */}
          <View style={styles.assetsListContainer}>
            {assets.map((asset, index) => (
              <TouchableOpacity key={asset.ticker} style={styles.assetItem}>
                <View style={styles.assetLeft}>
                  <View style={styles.assetIconContainer}>
                    <Text style={styles.assetIcon}>{asset.icon}</Text>
                  </View>
                  <View style={styles.assetInfo}>
                    <Text style={styles.assetName}>{asset.name}</Text>
                    <Text style={styles.assetHoldings}>{asset.holdings}</Text>
                  </View>
                </View>
                
                <View style={styles.assetRight}>
                  <Text style={styles.assetEstimated}>{asset.estimated}</Text>
                  <Text style={[
                    styles.assetChange,
                    { color: asset.change.startsWith('+') ? '#34C759' : asset.change.startsWith('-') ? '#FF3B30' : '#8E8E93' }
                  ]}>
                    {asset.change}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  // Gold Card Styles
  goldCard: {
    backgroundColor: '#FFD700',
    borderRadius: 20,
    padding: 24,
    marginBottom: 32,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  totalBalanceLabel: {
    fontSize: 16,
    color: '#000000',
    opacity: 0.7,
    fontWeight: '600',
  },
  totalBalance: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 20,
  },
  unpaidSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 12,
    padding: 16,
  },
  unpaidRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  unpaidLabel: {
    fontSize: 14,
    color: '#000000',
    opacity: 0.8,
  },
  unpaidAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    width: '30%',
    backgroundColor: '#000000',
    borderRadius: 3,
  },
  // Circular Action Buttons
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  actionColumn: {
    alignItems: 'center',
    flex: 1,
  },
  circleButton: {
    alignItems: 'center',
    width: 72,
  },
  circleButtonIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  circleButtonText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
    marginTop: 4,
  },
  // Assets Section
  assetsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
  },
  // NEW: Single Card Container for the list
  assetsListContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
 
  },
  // NEW: Style for each row in the list
  assetItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    // Add a bottom border to all items except the last one
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  assetLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  assetIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  assetIcon: {
    fontSize: 20,
  },
  assetInfo: {
    flex: 1,
  },
  assetName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  assetHoldings: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  assetRight: {
    alignItems: 'flex-end',
  },
  assetEstimated: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  assetChange: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
});