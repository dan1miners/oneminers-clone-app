import React, { useState } from 'react';
import {
  View,
  Text,
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
  {
    id: 'cart1',
    name: 'Antminer S19 Pro',
    image: '⚙️',
    price: 3500,
    quantity: 1,
    fee: 35,
    total: 3535,
    coin: 'BTC',
  },
  {
    id: 'cart2',
    name: 'Goldshell KD6',
    image: '🔩',
    price: 3800,
    quantity: 2,
    fee: 76,
    total: 7676,
    coin: 'KAS',
  },
  {
    id: 'cart3',
    name: 'Aleo Miner F1',
    image: '💎',
    price: 2900,
    quantity: 1,
    fee: 29,
    total: 2929,
    coin: 'ALEO',
  },
];

const paymentMethods: PaymentMethod[] = [
  {
    id: 'bank1',
    name: 'Bank Transfer',
    icon: '🏦',
    type: 'bank',
    details: 'Chase •••• 1234',
  },
  {
    id: 'card1',
    name: 'Credit Card',
    icon: '💳',
    type: 'card',
    details: 'Visa •••• 5678',
  },
  {
    id: 'wallet1',
    name: 'Wallet Balance',
    icon: '💰',
    type: 'wallet',
    details: 'USDT Balance',
  },
  {
    id: 'crypto1',
    name: 'Crypto Transfer',
    icon: '🪙',
    type: 'crypto',
    details: 'BTC Address',
  },
];

// --- Main Component ---

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>(mockCartItems);
  const [selectedPayment, setSelectedPayment] = useState(paymentMethods[0].id);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [promoCode, setPromoCode] = useState('');

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const fees = cartItems.reduce(
    (sum, item) => sum + item.fee * item.quantity,
    0
  );
  const discount = promoCode === 'CRYPTO10' ? subtotal * 0.1 : 0;
  const total = subtotal + fees - discount;

  const selectedPaymentMethod = paymentMethods.find(
    (method) => method.id === selectedPayment
  );

  const handleBackPress = () => {
    router.back();
  };

  const handleRemoveItem = (itemId: string) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setCartItems((prev) => prev.filter((item) => item.id !== itemId));
          },
        },
      ]
    );
  };

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveItem(itemId);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const newTotal = newQuantity * item.price + item.fee * newQuantity;
          return { ...item, quantity: newQuantity, total: newTotal };
        }
        return item;
      })
    );
  };

  const handleApplyPromo = () => {
    if (promoCode === 'CRYPTO10') {
      Alert.alert('Success', '10% discount applied!');
    } else if (promoCode) {
      Alert.alert('Invalid Code', 'The promo code you entered is invalid.');
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert('Empty Cart', 'Your cart is empty. Add some items to proceed.');
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmCheckout = () => {
    setIsProcessing(true);

    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setShowConfirmModal(false);
      Alert.alert(
        'Order Placed!',
        'Your order has been successfully placed and is being processed.',
        [
          {
            text: 'OK',
            onPress: () => {
              setCartItems([]);
              router.back();
            },
          },
        ]
      );
    }, 3000);
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View className="bg-white rounded-2xl p-4 mb-3 shadow-sm">
      {/* Product Image and Basic Info */}
      <View className="flex-row items-center mb-4">
        <View className="w-12 h-12 rounded-xl bg-[#FFC000] items-center justify-center mr-3">
          <Text className="text-2xl">{item.image}</Text>
        </View>

        <View className="flex-1">
          <Text className="text-base font-semibold text-black mb-1">
            {item.name}
          </Text>
          <Text className="text-sm text-[#8E8E93]">Mines {item.coin}</Text>
        </View>

        <TouchableOpacity
          onPress={() => handleRemoveItem(item.id)}
          className="p-2 rounded-lg bg-[#F8F9FA]"
        >
          <Ionicons name="close" size={20} color="#8E8E93" />
        </TouchableOpacity>
      </View>

      {/* Quantity and Price Row */}
      <View className="flex-row justify-between items-center mb-3">
        <View>
          <Text className="text-xs text-[#8E8E93] font-medium mb-2">
            Quantity
          </Text>

          <View className="flex-row items-center bg-[#F8F9FA] rounded-xl p-1">
            <TouchableOpacity
              className="w-8 h-8 rounded-lg bg-white items-center justify-center shadow"
              onPress={() => handleUpdateQuantity(item.id, item.quantity - 1)}
            >
              <Ionicons name="remove" size={16} color="#007AFF" />
            </TouchableOpacity>

            <Text className="mx-4 min-w-[20px] text-center text-base font-semibold text-black">
              {item.quantity}
            </Text>

            <TouchableOpacity
              className="w-8 h-8 rounded-lg bg-white items-center justify-center shadow"
              onPress={() => handleUpdateQuantity(item.id, item.quantity + 1)}
            >
              <Ionicons name="add" size={16} color="#007AFF" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="items-end">
          <Text className="text-base font-semibold text-black mb-1">
            ${item.price.toLocaleString()} each
          </Text>
          <Text className="text-xs text-[#8E8E93]">
            + ${item.fee} fee per item
          </Text>
        </View>
      </View>

      {/* Total for this item */}
      <View className="border-t border-[#F2F2F7] pt-3 items-end">
        <Text className="text-base font-bold text-[#FFC000]">
          Item Total: ${item.total.toFixed(2)}
        </Text>
      </View>
    </View>
  );

  const renderPaymentMethod = ({ item }: { item: PaymentMethod }) => {
    const isSelected = selectedPayment === item.id;

    return (
      <TouchableOpacity
        className={[
          'flex-row items-center justify-between p-4 border rounded-xl mb-2',
          isSelected
            ? 'border-[#E6B800] bg-[#FFF6D6]'
            : 'border-[#E9ECEF] bg-white',
        ].join(' ')}
        onPress={() => setSelectedPayment(item.id)}
      >
        <View className="flex-row items-center flex-1">
          <Text className="text-xl mr-3">{item.icon}</Text>
          <View className="flex-1">
            <Text className="text-base font-semibold text-black">
              {item.name}
            </Text>
            <Text className="text-sm text-[#8E8E93] mt-0.5">
              {item.details}
            </Text>
          </View>
        </View>

        <View
          className={[
            'w-5 h-5 rounded-full border-2 items-center justify-center',
            isSelected ? 'border-[#E6B800]' : 'border-[#E9ECEF]'
          ].join(' ')}
        >
          {isSelected && (
            <View className="w-2.5 h-2.5 rounded-full bg-[#E6B800]" />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FA]">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-[#E9ECEF]">
        <TouchableOpacity onPress={handleBackPress} className="p-1 mr-3">
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text className="flex-1 text-center text-lg font-semibold text-black">
          Cart
        </Text>

        <View className="w-9" />
      </View>

      {/* Content */}
      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        {/* Cart Items */}
        {cartItems.length > 0 ? (
          <>
            <View className="mb-6">
              <Text className="text-lg font-bold text-black mb-4">
                Your Items ({cartItems.length})
              </Text>

              <FlatList
                data={cartItems}
                keyExtractor={(item) => item.id}
                renderItem={renderCartItem}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
              />
            </View>

            {/* Promo Code */}
            <View className="bg-white rounded-2xl p-5 mb-6 shadow-sm">
              <Text className="text-lg font-bold text-black mb-4">
                Promo Code
              </Text>

              <View className="flex-row items-center">
                <TextInput
                  className="flex-1 border border-[#E9ECEF] rounded-xl p-4 mr-3 text-base bg-[#F8F9FA]"
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChangeText={setPromoCode}
                  placeholderTextColor="#8E8E93"
                />

                <TouchableOpacity
                  className="bg-[#FFC000] px-5 py-4 rounded-xl"
                  onPress={handleApplyPromo}
                >
                  <Text className="text-sm font-semibold text-white">
                    Apply
                  </Text>
                </TouchableOpacity>
              </View>

              {discount > 0 && (
                <View className="flex-row items-center mt-3 p-3 bg-green-50 rounded-lg">
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color="#34C759"
                  />
                  <Text className="ml-2 text-sm font-medium text-green-700">
                    10% discount applied
                  </Text>
                </View>
              )}
            </View>

            {/* Payment Method */}
            <View className="bg-white rounded-2xl p-5 mb-6 shadow-sm">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-lg font-bold text-black">
                  Payment Method
                </Text>
                <TouchableOpacity onPress={() => setShowPaymentModal(true)}>
                  <Text className="text-sm font-semibold text-[#FFC000]">
                    Change
                  </Text>
                </TouchableOpacity>
              </View>

              {selectedPaymentMethod && (
                <View className="flex-row items-center p-4 bg-[#F8F9FA] rounded-xl">
                  <Text className="text-2xl mr-3">
                    {selectedPaymentMethod.icon}
                  </Text>
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-black">
                      {selectedPaymentMethod.name}
                    </Text>
                    <Text className="text-sm text-[#8E8E93] mt-0.5">
                      {selectedPaymentMethod.details}
                    </Text>
                  </View>
                </View>
              )}
            </View>

            {/* Order Total */}
            <View className="bg-white rounded-2xl p-5 mb-6 shadow-sm">
              <Text className="text-lg font-bold text-black mb-4">
                Order Summary
              </Text>

              <View>
                <View className="flex-row justify-between items-center mb-3">
                  <Text className="text-base text-[#8E8E93]">Subtotal</Text>
                  <Text className="text-base font-semibold text-black">
                    ${subtotal.toFixed(2)}
                  </Text>
                </View>

                <View className="flex-row justify-between items-center mb-3">
                  <Text className="text-base text-[#8E8E93]">Fees</Text>
                  <Text className="text-base font-semibold text-black">
                    ${fees.toFixed(2)}
                  </Text>
                </View>

                {discount > 0 && (
                  <View className="flex-row justify-between items-center mb-3">
                    <Text className="text-base text-[#34C759]">Discount</Text>
                    <Text className="text-base font-semibold text-[#34C759]">
                      -${discount.toFixed(2)}
                    </Text>
                  </View>
                )}

                <View className="h-px bg-[#E9ECEF] my-3" />

                <View className="flex-row justify-between items-center">
                  <Text className="text-lg font-bold text-black">Total</Text>
                  <Text className="text-xl font-bold text-[#FFC000]">
                    ${total.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Checkout Button */}
            <TouchableOpacity
              className="bg-[#FFC000] rounded-2xl p-5 items-center mb-8 shadow-lg"
              onPress={handleCheckout}
            >
              <Text className="text-[17px] font-semibold text-white">
                Proceed to Checkout
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          // Empty Cart State
          <View className="items-center justify-center py-20">
            <View className="mb-6">
              <Ionicons name="cart-outline" size={64} color="#E9ECEF" />
            </View>

            <Text className="text-xl font-bold text-black mb-2">
              Your cart is empty
            </Text>

            <Text className="text-base text-[#8E8E93] text-center mb-8">
              Add some mining equipment to get started
            </Text>

            <TouchableOpacity
              className="bg-[#007AFF] px-8 py-4 rounded-xl"
              onPress={() => router.back()}
            >
              <Text className="text-base font-semibold text-white">
                Start Shopping
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Payment Methods Modal */}
      <Modal visible={showPaymentModal} transparent animationType="slide">
        <View className="flex-1 bg-black/50 justify-center items-center p-5">
          <View className="bg-white rounded-2xl p-5 w-full max-w-md max-h-[80%]">
            <View className="flex-row justify-between items-center mb-5">
              <Text className="text-xl font-bold text-black">
                Select Payment Method
              </Text>
              <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={paymentMethods}
              keyExtractor={(item) => item.id}
              renderItem={renderPaymentMethod}
              showsVerticalScrollIndicator={false}
            />

            <TouchableOpacity
              className="bg-[#FFC000] rounded-xl p-4 items-center mt-4"
              onPress={() => setShowPaymentModal(false)}
            >
              <Text className="text-base font-semibold text-white">
                Confirm Payment Method
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Confirmation Modal */}
      <Modal visible={showConfirmModal} transparent animationType="slide">
        <View className="flex-1 bg-black/50 justify-center items-center p-5">
          <View className="bg-white rounded-2xl p-5 w-full max-w-md max-h-[80%]">
            <Text className="text-xl font-bold text-black mb-4">
              Confirm Order
            </Text>

            <View className="mb-6">
              <Text className="text-base text-[#8E8E93] mb-4">
                Please review your order details:
              </Text>

              <View className="bg-[#F8F9FA] rounded-xl p-4 mb-4">
                {cartItems.map((item) => (
                  <View
                    key={item.id}
                    className="flex-row justify-between items-center mb-3"
                  >
                    <View className="flex-row items-center flex-1">
                      <Text className="text-xl mr-3">{item.image}</Text>
                      <View>
                        <Text className="text-sm font-semibold text-black">
                          {item.name}
                        </Text>
                        <Text className="text-xs text-[#8E8E93] mt-0.5">
                          Qty: {item.quantity} × ${item.price}
                        </Text>
                      </View>
                    </View>

                    <Text className="text-sm font-semibold text-black">
                      ${item.total.toFixed(2)}
                    </Text>
                  </View>
                ))}
              </View>

              <View className="bg-[#F8F9FA] rounded-xl p-4 mb-4">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-sm text-[#8E8E93]">Payment Method:</Text>
                  <Text className="text-sm font-semibold text-black">
                    {selectedPaymentMethod?.name}
                  </Text>
                </View>

                <View className="flex-row justify-between items-center">
                  <Text className="text-sm text-[#8E8E93]">Total Amount:</Text>
                  <Text className="text-base font-bold text-[#007AFF]">
                    ${total.toFixed(2)}
                  </Text>
                </View>
              </View>

              <View className="flex-row bg-[#FFF8E1] p-3 rounded-lg">
                <Ionicons name="warning-outline" size={16} color="#FF9500" />
                <Text className="text-xs text-[#8B6914] ml-2 flex-1">
                  Orders cannot be cancelled once confirmed. Please double-check all details.
                </Text>
              </View>
            </View>

            <View className="flex-row">
              <TouchableOpacity
                className="flex-1 bg-[#F8F9FA] rounded-xl p-4 items-center mr-3"
                onPress={() => setShowConfirmModal(false)}
                disabled={isProcessing}
              >
                <Text className="text-base font-semibold text-[#8E8E93]">
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={[
                  'flex-1 rounded-xl p-4 items-center',
                  isProcessing ? 'bg-[#E9ECEF]' : 'bg-[#007AFF]',
                ].join(' ')}
                onPress={confirmCheckout}
                disabled={isProcessing}
              >
                <Text className="text-base font-semibold text-white">
                  {isProcessing ? 'Processing...' : 'Confirm Order'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
