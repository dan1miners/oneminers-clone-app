import {
  View,
  Text,
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
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newWallet, setNewWallet] = useState({
    name: '',
    address: '',
    coin: 'BTC',
  });

  const coins = [
    { symbol: 'BTC', icon: '₿', color: '#F7931A' },
    { symbol: 'ETH', icon: 'Ξ', color: '#627EEA' },
    { symbol: 'LTC', icon: 'Ł', color: '#BFBBBB' },
    { symbol: 'DOGE', icon: 'Ð', color: '#C2A633' },
  ];

  const handleAddWallet = () => {
    if (!newWallet.name || !newWallet.address) {
      Alert.alert('Missing Information', 'Please fill in all fields.');
      return;
    }

    setWallets(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        name: newWallet.name,
        address: newWallet.address,
        coin: newWallet.coin,
        balance: '0.00',
        valueUSD: '$0.00',
        icon: '₿',
        color: '#FFC000',
        isDefault: false,
      },
    ]);

    setNewWallet({ name: '', address: '', coin: 'BTC' });
    setShowAddForm(false);
    Alert.alert('Success', 'New wallet address added successfully!');
  };

  const handleSetDefault = (id: string) => {
    setWallets(prev =>
      prev.map(w => ({ ...w, isDefault: w.id === id }))
    );
  };

  const handleDeleteWallet = (id: string) => {
    Alert.alert('Delete Wallet', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () =>
          setWallets(prev => prev.filter(w => w.id !== id)),
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FA]">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-[#E9ECEF]">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>

        <Text className="text-lg font-semibold">Wallet Manager</Text>

        <TouchableOpacity onPress={() => setShowAddForm(true)}>
          <Ionicons name="add" size={24} color="#FFC000" />
        </TouchableOpacity>
      </View>

      <ScrollView className="p-4">
        {/* Balance */}
        <View className="bg-white rounded-2xl p-6 items-center mb-4 shadow-sm">
          <Text className="text-sm text-[#8E8E93] mb-2">
            Total Balance
          </Text>
          <Text className="text-4xl font-bold text-black mb-1">
            $42,789.09
          </Text>
          <Text className="text-sm text-[#8E8E93] mb-6">
            Across all wallets
          </Text>

          <View className="flex-row w-full gap-3">
            {['Send', 'Receive', 'Swap'].map((label, i) => (
              <TouchableOpacity
                key={i}
                className="flex-1 flex-row items-center justify-center bg-[#FFC000] py-3 rounded-xl"
              >
                <Ionicons
                  name={
                    label === 'Send'
                      ? 'arrow-up'
                      : label === 'Receive'
                      ? 'arrow-down'
                      : 'swap-horizontal'
                  }
                  size={18}
                />
                <Text className="ml-2 font-semibold">
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Add Wallet */}
        {showAddForm && (
          <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold">
                Add New Wallet
              </Text>
              <TouchableOpacity onPress={() => setShowAddForm(false)}>
                <Ionicons name="close" size={22} color="#8E8E93" />
              </TouchableOpacity>
            </View>

            <Text className="text-sm text-[#6C757D] mb-2">
              Wallet Name
            </Text>
            <TextInput
              className="bg-[#F8F9FA] border border-[#E9ECEF] rounded-xl px-4 py-3 mb-4"
              value={newWallet.name}
              onChangeText={t =>
                setNewWallet(p => ({ ...p, name: t }))
              }
              placeholder="e.g. Mining Wallet"
            />

            <Text className="text-sm text-[#6C757D] mb-2">
              Coin
            </Text>
            <ScrollView horizontal className="mb-4">
              {coins.map(c => (
                <TouchableOpacity
                  key={c.symbol}
                  onPress={() =>
                    setNewWallet(p => ({ ...p, coin: c.symbol }))
                  }
                  className={`flex-row items-center px-4 py-3 mr-3 rounded-xl border ${
                    newWallet.coin === c.symbol
                      ? 'bg-[#FFF8E6] border-[#FFC000]'
                      : 'bg-[#F8F9FA] border-[#E9ECEF]'
                  }`}
                >
                  <Text className="mr-2">{c.icon}</Text>
                  <Text className="font-semibold">{c.symbol}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text className="text-sm text-[#6C757D] mb-2">
              Wallet Address
            </Text>
            <TextInput
              multiline
              className="bg-[#F8F9FA] border border-[#E9ECEF] rounded-xl px-4 py-3 h-24 mb-5"
              value={newWallet.address}
              onChangeText={t =>
                setNewWallet(p => ({ ...p, address: t }))
              }
              placeholder="Paste wallet address"
            />

            <TouchableOpacity
              onPress={handleAddWallet}
              className="bg-[#FFC000] py-4 rounded-xl items-center"
            >
              <Text className="font-bold text-base">
                Add Wallet
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Wallets */}
        <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
          <Text className="text-lg font-bold mb-4">
            Your Wallets
          </Text>

          {wallets.map(w => (
            <View
              key={w.id}
              className="bg-[#F8F9FA] border border-[#E9ECEF] rounded-xl p-4 mb-3"
            >
              <View className="flex-row justify-between mb-3">
                <View className="flex-row items-center">
                  <View
                    className="w-10 h-10 rounded-full items-center justify-center mr-3"
                    style={{ backgroundColor: w.color }}
                  >
                    <Text className="text-white font-bold">
                      {w.icon}
                    </Text>
                  </View>
                  <View>
                    <Text className="font-semibold">
                      {w.name}
                    </Text>
                    <Text className="text-sm text-[#8E8E93]">
                      {w.coin}
                    </Text>
                  </View>
                </View>

                <View className="flex-row">
                  {!w.isDefault && (
                    <TouchableOpacity
                      onPress={() => handleSetDefault(w.id)}
                      className="mr-2"
                    >
                      <Ionicons
                        name="star-outline"
                        size={18}
                        color="#FFC000"
                      />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    onPress={() => handleDeleteWallet(w.id)}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={18}
                      color="#FF3B30"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View className="flex-row justify-between mb-3">
                <View>
                  <Text className="text-xl font-bold">
                    {w.balance} {w.coin}
                  </Text>
                  <Text className="text-sm text-[#8E8E93]">
                    {w.valueUSD}
                  </Text>
                </View>

                {w.isDefault && (
                  <View className="bg-[#FFC000] px-3 py-1 rounded-lg flex-row items-center">
                    <Ionicons name="star" size={14} />
                    <Text className="ml-1 text-sm font-semibold">
                      Default
                    </Text>
                  </View>
                )}
              </View>

              <View className="flex-row justify-between">
                {['Send', 'Receive', 'Swap', 'View'].map(a => (
                  <TouchableOpacity
                    key={a}
                    className="items-center flex-1"
                  >
                    <Ionicons
                      name={
                        a === 'Send'
                          ? 'arrow-up'
                          : a === 'Receive'
                          ? 'arrow-down'
                          : a === 'Swap'
                          ? 'swap-horizontal'
                          : 'eye-outline'
                      }
                      size={18}
                      color="#FFC000"
                    />
                    <Text className="text-xs mt-1">{a}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}

          {!wallets.length && (
            <View className="items-center py-10">
              <MaterialCommunityIcons
                name="wallet-outline"
                size={64}
                color="#E5E5EA"
              />
              <Text className="mt-4 font-bold">
                No Wallets Added
              </Text>
              <Text className="text-[#8E8E93] mt-1">
                Add your first wallet to get started
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
