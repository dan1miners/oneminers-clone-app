import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';

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

export default function WalletManagerScreen() {
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

  const coins = useMemo(
    () => [
      { symbol: 'BTC', icon: '₿' },
      { symbol: 'ETH', icon: 'Ξ' },
      { symbol: 'LTC', icon: 'Ł' },
      { symbol: 'DOGE', icon: 'Ð' },
    ],
    []
  );

  const [showAdd, setShowAdd] = useState(false);
  const [newWallet, setNewWallet] = useState({ name: '', address: '', coin: 'BTC' });

  const [toast, setToast] = useState<{ show: boolean; title: string; message?: string }>({
    show: false,
    title: '',
    message: '',
  });

  const showToast = (title: string, message?: string) => {
    setToast({ show: true, title, message });
    setTimeout(() => setToast({ show: false, title: '', message: '' }), 1600);
  };

  const totalUSD = useMemo(() => {
    // Using your existing displayed number (keep it stable for now)
    return '$42,789.09';
  }, []);

  const handleAddWallet = () => {
    if (!newWallet.name.trim() || !newWallet.address.trim()) {
      showToast('Missing info', 'Please fill in wallet name and address.');
      return;
    }

    const picked = coins.find((c) => c.symbol === newWallet.coin) || coins[0];

    setWallets((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: newWallet.name.trim(),
        address: newWallet.address.trim(),
        coin: newWallet.coin,
        balance: '0.00',
        valueUSD: '$0.00',
        icon: picked.icon,
        color: '#FFC000',
        isDefault: prev.length === 0,
      },
    ]);

    setNewWallet({ name: '', address: '', coin: 'BTC' });
    setShowAdd(false);
    showToast('Saved', 'Wallet added successfully.');
  };

  const handleSetDefault = (id: string) => {
    setWallets((prev) => prev.map((w) => ({ ...w, isDefault: w.id === id })));
    showToast('Default updated');
  };

  const handleDeleteWallet = (id: string) => {
    // Simple inline confirm modal pattern could be added, but keeping minimal:
    setWallets((prev) => prev.filter((w) => w.id !== id));
    showToast('Deleted', 'Wallet removed.');
  };

  const handleCopy = async (address: string) => {
    await Clipboard.setStringAsync(address);
    showToast('Copied', 'Address copied to clipboard.');
  };

  const WalletRow = ({ w }: { w: Wallet }) => (
    <View className="bg-white rounded-2xl border border-[#E5E7EB] mb-3 overflow-hidden">
      <View className="px-4 pt-4 pb-3">
        <View className="flex-row items-start justify-between">
          <View className="flex-row items-center flex-1 pr-3">
            <View className="w-10 h-10 rounded-full bg-[#FFC000]/15 items-center justify-center mr-3">
              <Text className="text-[16px] font-extrabold text-black">{w.icon}</Text>
            </View>

            <View className="flex-1">
              <View className="flex-row items-center">
                <Text className="text-[15px] font-bold text-black flex-1" numberOfLines={1}>
                  {w.name}
                </Text>

                {w.isDefault ? (
                  <View className="ml-2 px-2 py-1 rounded-md bg-[#FFC000]/15 border border-[#FFC000]/25">
                    <Text className="text-[11px] font-semibold text-black">Default</Text>
                  </View>
                ) : null}
              </View>

              <Text className="text-[12px] text-[#6B7280] mt-0.5">{w.coin}</Text>
            </View>
          </View>

          <View className="flex-row items-center">
            {!w.isDefault ? (
              <TouchableOpacity
                onPress={() => handleSetDefault(w.id)}
                activeOpacity={0.9}
                className="w-9 h-9 rounded-full bg-[#F9FAFB] border border-[#E5E7EB] items-center justify-center mr-2"
              >
                <Ionicons name="star-outline" size={18} color="#FFC000" />
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity
              onPress={() => handleDeleteWallet(w.id)}
              activeOpacity={0.9}
              className="w-9 h-9 rounded-full bg-[#F9FAFB] border border-[#E5E7EB] items-center justify-center"
            >
              <Ionicons name="trash-outline" size={18} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-row items-end justify-between mt-4">
          <View>
            <Text className="text-[20px] font-extrabold text-black">
              {w.balance} <Text className="text-[16px] font-bold">{w.coin}</Text>
            </Text>
            <Text className="text-[12px] text-[#6B7280] mt-0.5">{w.valueUSD}</Text>
          </View>

          <TouchableOpacity
            onPress={() => handleCopy(w.address)}
            activeOpacity={0.9}
            className="flex-row items-center px-3 py-2 rounded-xl bg-[#FFC000]/10 border border-[#FFC000]/20"
          >
            <Ionicons name="copy-outline" size={16} color="#111827" />
            <Text className="ml-2 text-[12px] font-semibold text-black">Copy</Text>
          </TouchableOpacity>
        </View>

        <View className="mt-3">
          <Text className="text-[12px] text-[#6B7280]" numberOfLines={1}>
            {w.address}
          </Text>
        </View>
      </View>

      {/* actions */}
      <View className="flex-row border-t border-[#E5E7EB]">
        {[
          { label: 'Send', icon: 'arrow-up' as const },
          { label: 'Receive', icon: 'arrow-down' as const },
          { label: 'Swap', icon: 'swap-horizontal' as const },
          { label: 'View', icon: 'eye-outline' as const },
        ].map((a, idx) => (
          <TouchableOpacity
            key={a.label}
            activeOpacity={0.9}
            className={[
              'flex-1 py-3 items-center justify-center bg-white',
              idx !== 3 ? 'border-r border-[#E5E7EB]' : '',
            ].join(' ')}
          >
            <Ionicons name={a.icon} size={18} color="#FFC000" />
            <Text className="text-[11px] mt-1 font-semibold text-[#111827]">{a.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]" edges={['top', 'bottom', 'left', 'right']}>
      {/* Header */}
      <View className="py-3 px-5 border-b border-[#E5E7EB] flex-row items-center h-[60px] bg-[#F9FAFB]">
        <TouchableOpacity onPress={() => router.back()} className="p-1 mr-3">
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text className="text-lg font-semibold text-black flex-1">Wallet Manager</Text>

        <TouchableOpacity
          onPress={() => setShowAdd(true)}
          activeOpacity={0.9}
          className="w-10 h-10 rounded-full bg-[#FFC000]/15 border border-[#FFC000]/25 items-center justify-center"
        >
          <Ionicons name="add" size={22} color="#111827" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerClassName="p-4">
        {/* Total Balance Card (simple, clean, no shadow) */}
        <View className="bg-white rounded-2xl border border-[#E5E7EB] p-5 mb-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-[12px] text-[#6B7280] font-semibold">Total balance</Text>
              <Text className="text-[32px] font-extrabold text-black mt-1">{totalUSD}</Text>
              <Text className="text-[12px] text-[#6B7280] mt-1">Across all wallets</Text>
            </View>

            <View className="w-12 h-12 rounded-2xl bg-[#FFC000] items-center justify-center">
              <Ionicons name="wallet-outline" size={22} color="#000" />
            </View>
          </View>

          <View className="flex-row gap-3 mt-5">
            {[
              { label: 'Send', icon: 'arrow-up' as const },
              { label: 'Receive', icon: 'arrow-down' as const },
              { label: 'Swap', icon: 'swap-horizontal' as const },
            ].map((a) => (
              <TouchableOpacity
                key={a.label}
                activeOpacity={0.9}
                className="flex-1 flex-row items-center justify-center bg-[#FFC000] py-3 rounded-xl"
              >
                <Ionicons name={a.icon} size={18} color="#000" />
                <Text className="ml-2 font-bold text-black">{a.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Your Wallets */}
        <View className="mb-3">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-[16px] font-bold text-black">Your wallets</Text>

            <TouchableOpacity
              onPress={() => setShowAdd(true)}
              activeOpacity={0.9}
              className="flex-row items-center px-3 py-2 rounded-xl bg-[#FFC000]/10 border border-[#FFC000]/20"
            >
              <Ionicons name="add" size={16} color="#111827" />
              <Text className="ml-2 text-[12px] font-semibold text-black">Add wallet</Text>
            </TouchableOpacity>
          </View>

          {wallets.length ? (
            wallets.map((w) => <WalletRow key={w.id} w={w} />)
          ) : (
            <View className="items-center bg-white border border-[#E5E7EB] rounded-2xl p-10">
              <MaterialCommunityIcons name="wallet-outline" size={56} color="#D1D5DB" />
              <Text className="mt-4 text-[16px] font-bold text-black">No wallets added</Text>
              <Text className="text-[13px] text-[#6B7280] mt-1 text-center">
                Add your first wallet to get started.
              </Text>
            </View>
          )}
        </View>

        <View className="h-8" />
      </ScrollView>

      {/* Add Wallet Modal */}
      <Modal visible={showAdd} transparent animationType="fade" onRequestClose={() => setShowAdd(false)}>
        <View className="flex-1 bg-black/50 justify-center items-center p-5">
          <View className="bg-white w-full max-w-[420px] rounded-2xl border border-[#E5E7EB] overflow-hidden">
            <View className="px-5 py-4 border-b border-[#E5E7EB] flex-row items-center">
              <Text className="text-[16px] font-bold text-black flex-1">Add wallet</Text>
              <TouchableOpacity onPress={() => setShowAdd(false)} className="w-9 h-9 rounded-full bg-[#F9FAFB] border border-[#E5E7EB] items-center justify-center">
                <Ionicons name="close" size={18} color="#111827" />
              </TouchableOpacity>
            </View>

            <View className="p-5">
              <Text className="text-[12px] font-semibold text-[#6B7280] mb-2">Wallet name</Text>
              <TextInput
                value={newWallet.name}
                onChangeText={(t) => setNewWallet((p) => ({ ...p, name: t }))}
                placeholder="e.g. Mining Wallet"
                placeholderTextColor="#9CA3AF"
                className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 py-3 text-[14px] text-black"
              />

              <Text className="text-[12px] font-semibold text-[#6B7280] mt-4 mb-2">Coin</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {coins.map((c) => {
                  const active = newWallet.coin === c.symbol;
                  return (
                    <TouchableOpacity
                      key={c.symbol}
                      onPress={() => setNewWallet((p) => ({ ...p, coin: c.symbol }))}
                      activeOpacity={0.9}
                      className={[
                        'flex-row items-center px-4 py-3 mr-3 rounded-xl border',
                        active ? 'bg-[#FFC000]/10 border-[#FFC000]/30' : 'bg-[#F9FAFB] border-[#E5E7EB]',
                      ].join(' ')}
                    >
                      <Text className="mr-2 text-[14px]">{c.icon}</Text>
                      <Text className="text-[13px] font-bold text-black">{c.symbol}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <Text className="text-[12px] font-semibold text-[#6B7280] mt-4 mb-2">Wallet address</Text>
              <TextInput
                value={newWallet.address}
                onChangeText={(t) => setNewWallet((p) => ({ ...p, address: t }))}
                placeholder="Paste wallet address"
                placeholderTextColor="#9CA3AF"
                multiline
                className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 py-3 h-24 text-[14px] text-black"
              />

              <TouchableOpacity
                onPress={handleAddWallet}
                activeOpacity={0.9}
                className="bg-[#FFC000] rounded-xl py-4 items-center mt-5"
              >
                <Text className="text-[14px] font-extrabold text-black">Save wallet</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setShowAdd(false)}
                activeOpacity={0.9}
                className="rounded-xl py-4 items-center mt-3 border border-[#E5E7EB] bg-white"
              >
                <Text className="text-[14px] font-bold text-[#111827]">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Toast */}
      {toast.show ? (
        <View className="absolute left-0 right-0 bottom-6 items-center px-5">
          <View className="bg-white border border-[#E5E7EB] rounded-2xl px-4 py-3 flex-row items-center max-w-[420px] w-full">
            <View className="w-10 h-10 rounded-full bg-[#FFC000]/15 items-center justify-center mr-3">
              <Ionicons name="checkmark-circle" size={20} color="#111827" />
            </View>
            <View className="flex-1">
              <Text className="text-[14px] font-bold text-black">{toast.title}</Text>
              {toast.message ? <Text className="text-[12px] text-[#6B7280] mt-0.5">{toast.message}</Text> : null}
            </View>
          </View>
        </View>
      ) : null}
    </SafeAreaView>
  );
}
