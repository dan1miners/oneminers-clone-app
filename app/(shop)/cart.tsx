import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  Modal,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// --- Types ---

type CartItem = {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  fee: number;
  total: number;
  coin: string;
};

type PaymentMethod = {
  id: string;
  name: string;
  icon: string;
  type: 'bank' | 'card' | 'crypto' | 'wallet';
  details: string;
};

// --- Mock Data ---

const mockCartItems: CartItem[] = [
  { id: 'cart1', name: 'Antminer S19 Pro', image: '⚙️', price: 3500, quantity: 1, fee: 35, total: 3535, coin: 'BTC' },
  { id: 'cart2', name: 'Goldshell KD6', image: '🔩', price: 3800, quantity: 2, fee: 76, total: 7676, coin: 'KAS' },
  { id: 'cart3', name: 'Aleo Miner F1', image: '💎', price: 2900, quantity: 1, fee: 29, total: 2929, coin: 'ALEO' },
];

const paymentMethods: PaymentMethod[] = [
  { id: 'bank1', name: 'Bank Transfer', icon: '🏦', type: 'bank', details: 'Chase •••• 1234' },
  { id: 'card1', name: 'Credit Card', icon: '💳', type: 'card', details: 'Visa •••• 5678' },
  { id: 'wallet1', name: 'Wallet Balance', icon: '💰', type: 'wallet', details: 'USDT Balance' },
  { id: 'crypto1', name: 'Crypto Transfer', icon: '🪙', type: 'crypto', details: 'BTC Address' },
];

const money = (n: number) =>
  `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// --- Main Component ---

export default function CartPage() {
  const router = useRouter();

  const [cartItems, setCartItems] = useState<CartItem[]>(mockCartItems);
  const [selectedPayment, setSelectedPayment] = useState(paymentMethods[0].id);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);

  const selectedPaymentMethod = useMemo(
    () => paymentMethods.find((m) => m.id === selectedPayment),
    [selectedPayment]
  );

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  const fees = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.fee * item.quantity, 0),
    [cartItems]
  );

  const discount = useMemo(() => {
    const code = (appliedPromo || '').toUpperCase();
    if (code === 'CRYPTO10') return subtotal * 0.1;
    return 0;
  }, [appliedPromo, subtotal]);

  const total = useMemo(() => Math.max(0, subtotal + fees - discount), [subtotal, fees, discount]);

  const handleRemoveItem = (itemId: string) => {
    Alert.alert('Remove item', 'Remove this item from your cart?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => setCartItems((prev) => prev.filter((i) => i.id !== itemId)),
      },
    ]);
  };

  const handleUpdateQuantity = (itemId: string, newQty: number) => {
    if (newQty < 1) return handleRemoveItem(itemId);

    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        const newTotal = newQty * item.price + item.fee * newQty;
        return { ...item, quantity: newQty, total: newTotal };
      })
    );
  };

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (!code) return;

    if (code === 'CRYPTO10') {
      setAppliedPromo(code);
      setPromoCode('');
      Alert.alert('Promo applied', '10% discount applied.');
      return;
    }

    Alert.alert('Invalid code', 'The promo code you entered is invalid.');
  };

  const handleClearPromo = () => {
    setAppliedPromo(null);
    setPromoCode('');
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert('Empty cart', 'Add items to proceed.');
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmCheckout = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setShowConfirmModal(false);

      router.push('/checkout');
    }, 1500);
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View className="bg-white rounded-2xl p-4 mb-3 border border-gray-100">
      <View className="flex-row items-start">
        <View className="w-12 h-12 rounded-xl bg-[#FFF8E6] border border-[#FFE5B4] items-center justify-center mr-3">
          <Text className="text-2xl">{item.image}</Text>
        </View>

        <View className="flex-1 pr-2">
          <Text className="text-sm font-extrabold text-black" numberOfLines={2}>
            {item.name}
          </Text>
          <Text className="text-xs text-gray-500 mt-1">Mines {item.coin}</Text>

          <View className="flex-row items-center justify-between mt-3">
            <Text className="text-xs text-gray-500">Unit</Text>
            <Text className="text-sm font-semibold text-black">{money(item.price)}</Text>
          </View>

          <View className="flex-row items-center justify-between mt-2">
            <Text className="text-xs text-gray-500">Fee (each)</Text>
            <Text className="text-sm font-semibold text-black">{money(item.fee)}</Text>
          </View>
        </View>

        <TouchableOpacity onPress={() => handleRemoveItem(item.id)} className="p-2 rounded-xl bg-gray-50 border border-gray-200">
          <Ionicons name="trash-outline" size={18} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <View className="mt-4 flex-row items-center justify-between border-t border-gray-100 pt-4">
        {/* Quantity */}
        <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl p-1">
          <TouchableOpacity
            onPress={() => handleUpdateQuantity(item.id, item.quantity - 1)}
            className="w-9 h-9 rounded-xl bg-white border border-gray-200 items-center justify-center"
          >
            <Ionicons name="remove" size={16} color="#111827" />
          </TouchableOpacity>

          <Text className="mx-4 text-base font-extrabold text-black min-w-[22px] text-center">
            {item.quantity}
          </Text>

          <TouchableOpacity
            onPress={() => handleUpdateQuantity(item.id, item.quantity + 1)}
            className="w-9 h-9 rounded-xl bg-white border border-gray-200 items-center justify-center"
          >
            <Ionicons name="add" size={16} color="#111827" />
          </TouchableOpacity>
        </View>

        {/* Item Total */}
        <View className="items-end">
          <Text className="text-xs text-gray-500">Item total</Text>
          <Text className="text-base font-extrabold text-[#FFC000]">{money(item.total)}</Text>
        </View>
      </View>
    </View>
  );

  const renderPaymentMethod = ({ item }: { item: PaymentMethod }) => {
    const isSelected = selectedPayment === item.id;

    return (
      <TouchableOpacity
        onPress={() => setSelectedPayment(item.id)}
        className={`flex-row items-center justify-between p-4 rounded-2xl border mb-2 ${
          isSelected ? 'bg-[#FFF8E6] border-[#FFE5B4]' : 'bg-white border-gray-200'
        }`}
      >
        <View className="flex-row items-center flex-1">
          <Text className="text-xl mr-3">{item.icon}</Text>
          <View className="flex-1">
            <Text className="text-sm font-extrabold text-black">{item.name}</Text>
            <Text className="text-xs text-gray-500 mt-1">{item.details}</Text>
          </View>
        </View>

        <View
          className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
            isSelected ? 'border-[#FFC000]' : 'border-gray-300'
          }`}
        >
          {isSelected && <View className="w-2.5 h-2.5 rounded-full bg-[#FFC000]" />}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="p-1">
          <Ionicons name="arrow-back" size={22} color="#000" />
        </TouchableOpacity>

        <View className="flex-row items-baseline">
          <Text className="text-lg font-extrabold text-[#FFC000]">one</Text>
          <Text className="text-lg font-extrabold text-black">miners</Text>
        </View>

        <View className="w-8" />
      </View>

      {/* Content */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        {cartItems.length > 0 ? (
          <>
            {/* Items */}
            <View className="mb-4">
              <Text className="text-base font-extrabold text-black mb-3">
                Your items ({cartItems.length})
              </Text>

              <FlatList
                data={cartItems}
                keyExtractor={(i) => i.id}
                renderItem={renderCartItem}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
              />
            </View>

            {/* Promo */}
            <View className="bg-white rounded-2xl p-5 border border-gray-100 mb-4">
              <Text className="text-base font-extrabold text-black mb-3">Promo code</Text>

              {appliedPromo ? (
                <View className="flex-row items-center justify-between bg-[#FFF8E6] border border-[#FFE5B4] rounded-2xl p-4">
                  <View>
                    <Text className="text-sm font-extrabold text-black">{appliedPromo}</Text>
                    <Text className="text-xs text-gray-600 mt-1">10% discount applied</Text>
                  </View>
                  <TouchableOpacity
                    onPress={handleClearPromo}
                    className="px-3 py-2 rounded-xl bg-white border border-gray-200"
                  >
                    <Text className="text-xs font-semibold text-black">Remove</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View className="flex-row items-center">
                  <View className="flex-1 flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-3 h-11">
                    <Ionicons name="pricetag-outline" size={16} color="#9CA3AF" />
                    <TextInput
                      className="flex-1 ml-2 text-sm text-black"
                      placeholder="Enter code (e.g., CRYPTO10)"
                      placeholderTextColor="#9CA3AF"
                      value={promoCode}
                      onChangeText={setPromoCode}
                      autoCapitalize="characters"
                    />
                  </View>

                  <TouchableOpacity
                    onPress={handleApplyPromo}
                    className="ml-3 bg-[#FFC000] px-4 h-11 rounded-xl items-center justify-center"
                  >
                    <Text className="text-sm font-extrabold text-black">Apply</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Payment */}
            <View className="bg-white rounded-2xl p-5 border border-gray-100 mb-4">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-base font-extrabold text-black">Payment</Text>
                <TouchableOpacity onPress={() => setShowPaymentModal(true)}>
                  <Text className="text-xs font-semibold text-black">Change</Text>
                </TouchableOpacity>
              </View>

              {selectedPaymentMethod ? (
                <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl p-4">
                  <Text className="text-xl mr-3">{selectedPaymentMethod.icon}</Text>
                  <View className="flex-1">
                    <Text className="text-sm font-extrabold text-black">{selectedPaymentMethod.name}</Text>
                    <Text className="text-xs text-gray-500 mt-1">{selectedPaymentMethod.details}</Text>
                  </View>
                </View>
              ) : null}
            </View>

            {/* Summary */}
            <View className="bg-white rounded-2xl p-5 border border-gray-100">
              <Text className="text-base font-extrabold text-black mb-3">Order summary</Text>

              <View className="flex-row items-center justify-between py-2">
                <Text className="text-xs text-gray-500">Subtotal</Text>
                <Text className="text-sm font-semibold text-black">{money(subtotal)}</Text>
              </View>

              <View className="flex-row items-center justify-between py-2">
                <Text className="text-xs text-gray-500">Fees</Text>
                <Text className="text-sm font-semibold text-black">{money(fees)}</Text>
              </View>

              {discount > 0 ? (
                <View className="flex-row items-center justify-between py-2">
                  <Text className="text-xs text-green-700">Discount</Text>
                  <Text className="text-sm font-semibold text-green-700">- {money(discount)}</Text>
                </View>
              ) : null}

              <View className="h-px bg-gray-100 my-3" />

              <View className="flex-row items-center justify-between">
                <Text className="text-sm font-extrabold text-black">Total</Text>
                <Text className="text-lg font-extrabold text-black">{money(total)}</Text>
              </View>
            </View>
          </>
        ) : (
          <View className="items-center justify-center py-24">
            <Ionicons name="cart-outline" size={64} color="#E5E7EB" />
            <Text className="text-lg font-extrabold text-black mt-4">Your cart is empty</Text>
            <Text className="text-sm text-gray-500 text-center mt-2">
              Add mining equipment to get started.
            </Text>

            <TouchableOpacity
              className="mt-6 bg-[#FFC000] px-6 py-4 rounded-2xl"
              onPress={() => router.back()}
            >
              <Text className="text-sm font-extrabold text-black">Start shopping</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Sticky Bottom Bar */}
      {cartItems.length > 0 && (
        <View className="absolute left-0 right-0 bottom-0 bg-white border-t border-gray-200 px-4 py-3">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-xs text-gray-500">Total</Text>
            <Text className="text-lg font-extrabold text-black">{money(total)}</Text>
          </View>

          <TouchableOpacity
            onPress={handleCheckout}
            className="bg-[#FFC000] rounded-2xl py-4 items-center"
            activeOpacity={0.9}
          >
            <Text className="text-sm font-extrabold text-black">Checkout</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Payment Modal */}
      <Modal visible={showPaymentModal} transparent animationType="fade">
        <Pressable className="flex-1 bg-black/40" onPress={() => setShowPaymentModal(false)}>
          <Pressable
            className="absolute left-4 right-4 bottom-10 bg-white rounded-2xl p-5 border border-gray-100"
            onPress={() => {}}
          >
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-extrabold text-black">Payment method</Text>
              <TouchableOpacity onPress={() => setShowPaymentModal(false)} className="p-2">
                <Ionicons name="close" size={20} color="#111827" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={paymentMethods}
              keyExtractor={(i) => i.id}
              renderItem={renderPaymentMethod}
              showsVerticalScrollIndicator={false}
            />

            <TouchableOpacity
              className="bg-[#FFC000] rounded-2xl py-4 items-center mt-3"
              onPress={() => setShowPaymentModal(false)}
            >
              <Text className="text-sm font-extrabold text-black">Confirm</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Confirm Checkout Modal */}
      <Modal visible={showConfirmModal} transparent animationType="fade">
        <Pressable className="flex-1 bg-black/40" onPress={() => setShowConfirmModal(false)}>
          <Pressable
            className="absolute left-4 right-4 bottom-10 bg-white rounded-2xl p-5 border border-gray-100"
            onPress={() => {}}
          >
            <Text className="text-lg font-extrabold text-black">Confirm checkout</Text>
            <Text className="text-sm text-gray-500 mt-1">
              Review your cart total and place your order.
            </Text>

            <View className="bg-gray-50 border border-gray-200 rounded-2xl p-4 mt-4">
              <View className="flex-row items-center justify-between">
                <Text className="text-xs text-gray-500">Total</Text>
                <Text className="text-base font-extrabold text-black">{money(total)}</Text>
              </View>
              <Text className="text-[11px] text-gray-400 mt-2">
                This is a mock checkout. Connect to your backend to process payments.
              </Text>
            </View>

            <View className="flex-row items-center mt-4">
              <TouchableOpacity
                className="flex-1 bg-white border border-gray-200 rounded-2xl py-4 items-center"
                onPress={() => setShowConfirmModal(false)}
                disabled={isProcessing}
              >
                <Text className="text-sm font-extrabold text-black">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`flex-1 rounded-2xl py-4 items-center ml-3 ${
                  isProcessing ? 'bg-gray-100' : 'bg-[#FFC000]'
                }`}
                onPress={confirmCheckout}
                disabled={isProcessing}
              >
                <Text className={`text-sm font-extrabold ${isProcessing ? 'text-gray-400' : 'text-black'}`}>
                  {isProcessing ? 'Processing...' : 'Place order'}
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
