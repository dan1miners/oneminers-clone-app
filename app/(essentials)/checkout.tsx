import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { APP_COLORS } from "../../constants/colors";
import { useAppTheme } from "../../providers/theme-provider";

type CartItem = {
  id: number;
  name: string;
  priceUsd: number;
  coin: string;
  hashrate: string;
  image: string;
};

type Address = {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

type AddressField = {
  key: keyof Address;
  label: string;
};

const CATALOG: Record<number, CartItem> = {
  1: {
    id: 1,
    name: "Antminer S19 Pro",
    priceUsd: 3500,
    coin: "BTC",
    hashrate: "110 TH/s",
    image: "⚙️",
  },
  2: {
    id: 2,
    name: "Whatsminer M30S+",
    priceUsd: 2800,
    coin: "BTC",
    hashrate: "100 TH/s",
    image: "🔧",
  },
  3: {
    id: 3,
    name: "AvalonMiner 1246",
    priceUsd: 4200,
    coin: "BTC",
    hashrate: "90 TH/s",
    image: "⚡",
  },
  4: {
    id: 4,
    name: "Goldshell KD6",
    priceUsd: 3800,
    coin: "KAS",
    hashrate: "29.2 TH/s",
    image: "🔩",
  },
  5: {
    id: 5,
    name: "Aleo Miner F1",
    priceUsd: 2900,
    coin: "ALEO",
    hashrate: "250 G/s",
    image: "💎",
  },
  6: {
    id: 6,
    name: "iPollo V1 Mini",
    priceUsd: 1200,
    coin: "ETH",
    hashrate: "320 MH/s",
    image: "📱",
  },
};

const money = (n: number) =>
  `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function CheckoutScreen() {
  const { colors: themeColors } = useAppTheme();
  const router = useRouter();
  const params = useLocalSearchParams();

  const productId = params.id ? parseInt(params.id as string) : 1;
  const qty = params.qty ? Math.max(1, parseInt(params.qty as string)) : 1;

  const item = CATALOG[productId] || CATALOG[1];

  const [address, setAddress] = useState<Address>({
    fullName: "John Doe",
    phone: "+1 555 123 4567",
    street: "123 Mining Street",
    city: "San Francisco",
    state: "CA",
    zip: "94107",
    country: "United States",
  });

  const [editAddressOpen, setEditAddressOpen] = useState(false);
  const [draftAddress, setDraftAddress] = useState(address);

  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<{
    code: string;
    discountUsd: number;
  } | null>(null);

  // Simple mock shipping fee
  const shippingFee = 49.0;

  const subtotal = useMemo(() => item.priceUsd * qty, [item.priceUsd, qty]);

  const discountUsd = useMemo(
    () => appliedVoucher?.discountUsd ?? 0,
    [appliedVoucher],
  );

  const total = useMemo(
    () => Math.max(0, subtotal - discountUsd + shippingFee),
    [subtotal, discountUsd],
  );

  const handleApplyVoucher = () => {
    const code = voucherCode.trim().toUpperCase();

    // Mock voucher rules
    if (!code) return;

    if (code === "XMAS100") {
      setAppliedVoucher({ code, discountUsd: 100 });
      setVoucherCode("");
      return;
    }

    if (code === "WELCOME50") {
      setAppliedVoucher({ code, discountUsd: 50 });
      setVoucherCode("");
      return;
    }

    Alert.alert("Invalid voucher", "This voucher code is not valid.");
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
  };

  const handleSaveAddress = () => {
    setAddress(draftAddress);
    setEditAddressOpen(false);
  };

  const handleCancel = () => {
    router.back();
  };

  const handlePlaceOrder = () => {
    // Replace with your real checkout API call
    Alert.alert(
      "Order placed (mock)",
      "Your checkout flow is ready to connect to your backend.",
    );
    router.replace("/orders");
  };

  return (
    <SafeAreaView
      className="flex-1 bg-gray-50 dark:bg-slate-950"
      edges={["top", "bottom", "left", "right"]}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700">
        <TouchableOpacity onPress={handleCancel} className="p-1">
          <Ionicons name="arrow-back" size={22} color={themeColors.text} />
        </TouchableOpacity>

        <View className="flex-row items-baseline">
          <Text className="text-lg font-extrabold text-om-accent">one</Text>
          <Text className="text-lg font-extrabold text-black dark:text-slate-100">
            miners
          </Text>
        </View>

        <View className="w-8" />
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 140 }}
      >
        {/* Shipping Address */}
        <View className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-gray-100 dark:border-slate-700 mb-4">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-xl bg-om-accent-100 items-center justify-center border border-om-accent-200 mr-3">
                <Ionicons
                  name="location-outline"
                  size={18}
                  color={APP_COLORS.accent}
                />
              </View>
              <Text className="text-base font-extrabold text-black dark:text-slate-100">
                Shipping address
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                setDraftAddress(address);
                setEditAddressOpen(true);
              }}
              className="px-3 py-2 rounded-xl bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-700"
            >
              <Text className="text-xs font-semibold text-black dark:text-slate-100">
                Change address
              </Text>
            </TouchableOpacity>
          </View>

          <Text className="text-sm font-semibold text-black dark:text-slate-100">
            {address.fullName}
          </Text>
          <Text className="text-xs text-gray-500 dark:text-slate-400 mt-1">
            {address.phone}
          </Text>
          <Text className="text-xs text-gray-500 dark:text-slate-400 mt-2">
            {address.street}, {address.city}, {address.state} {address.zip}
          </Text>
          <Text className="text-xs text-gray-500 dark:text-slate-400 mt-1">
            {address.country}
          </Text>
        </View>

        {/* Items */}
        <View className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-gray-100 dark:border-slate-700 mb-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-base font-extrabold text-black dark:text-slate-100">
              Items
            </Text>
            <View className="bg-om-accent-100 border border-om-accent-200 px-3 py-1 rounded-full">
              <Text className="text-[11px] font-semibold text-black dark:text-slate-100">
                Qty: {qty}
              </Text>
            </View>
          </View>

          <View className="flex-row items-start">
            <View className="w-14 h-14 rounded-xl bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-700 items-center justify-center mr-3">
              <Text className="text-3xl">{item.image}</Text>
            </View>

            <View className="flex-1">
              <Text
                className="text-sm font-extrabold text-black dark:text-slate-100"
                numberOfLines={2}
              >
                {item.name}
              </Text>
              <Text className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                {item.coin} • {item.hashrate}
              </Text>

              <View className="flex-row items-center justify-between mt-3">
                <Text className="text-xs text-gray-500 dark:text-slate-400">
                  Unit price
                </Text>
                <Text className="text-sm font-semibold text-black dark:text-slate-100">
                  {money(item.priceUsd)}
                </Text>
              </View>

              <View className="flex-row items-center justify-between mt-2">
                <Text className="text-xs text-gray-500 dark:text-slate-400">
                  Subtotal
                </Text>
                <Text className="text-sm font-extrabold text-black dark:text-slate-100">
                  {money(subtotal)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Voucher */}
        <View className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-gray-100 dark:border-slate-700 mb-4">
          <Text className="text-base font-extrabold text-black dark:text-slate-100 mb-3">
            Voucher
          </Text>

          {appliedVoucher ? (
            <View className="flex-row items-center justify-between bg-om-accent-100 border border-om-accent-200 rounded-2xl p-4">
              <View>
                <Text className="text-sm font-extrabold text-black dark:text-slate-100">
                  {appliedVoucher.code}
                </Text>
                <Text className="text-xs text-gray-600 dark:text-slate-300 mt-1">
                  Discount: {money(appliedVoucher.discountUsd)}
                </Text>
              </View>

              <TouchableOpacity
                onPress={handleRemoveVoucher}
                className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700"
              >
                <Text className="text-xs font-semibold text-black dark:text-slate-100">
                  Remove
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="flex-row items-center">
              <View className="flex-1 flex-row items-center bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-xl px-3 h-11">
                <Ionicons
                  name="pricetag-outline"
                  size={16}
                  color={APP_COLORS.placeholder}
                />
                <TextInput
                  value={voucherCode}
                  onChangeText={setVoucherCode}
                  placeholder="Enter voucher code"
                  placeholderTextColor={APP_COLORS.placeholder}
                  autoCapitalize="characters"
                  className="flex-1 ml-2 text-sm text-black dark:text-slate-100"
                />
              </View>

              <TouchableOpacity
                onPress={handleApplyVoucher}
                className="ml-3 bg-om-accent px-4 h-11 rounded-xl items-center justify-center"
              >
                <Text className="text-sm font-extrabold text-black dark:text-slate-100">
                  Apply
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <Text className="text-[11px] text-gray-400 dark:text-slate-500 mt-3">
            Example codes: XMAS100, WELCOME50
          </Text>
        </View>

        {/* Summary */}
        <View className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-gray-100 dark:border-slate-700 mb-6">
          <Text className="text-base font-extrabold text-black dark:text-slate-100 mb-3">
            Order summary
          </Text>

          <View className="flex-row items-center justify-between py-2">
            <Text className="text-xs text-gray-500 dark:text-slate-400">
              Subtotal
            </Text>
            <Text className="text-sm font-semibold text-black dark:text-slate-100">
              {money(subtotal)}
            </Text>
          </View>

          <View className="flex-row items-center justify-between py-2">
            <Text className="text-xs text-gray-500 dark:text-slate-400">
              Shipping
            </Text>
            <Text className="text-sm font-semibold text-black dark:text-slate-100">
              {money(shippingFee)}
            </Text>
          </View>

          <View className="flex-row items-center justify-between py-2">
            <Text className="text-xs text-gray-500 dark:text-slate-400">
              Discount
            </Text>
            <Text className="text-sm font-semibold text-black dark:text-slate-100">
              - {money(discountUsd)}
            </Text>
          </View>

          <View className="h-px bg-gray-100 dark:bg-slate-800 my-3" />

          <View className="flex-row items-center justify-between">
            <Text className="text-sm font-extrabold text-black dark:text-slate-100">
              Total
            </Text>
            <Text className="text-lg font-extrabold text-black dark:text-slate-100">
              {money(total)}
            </Text>
          </View>

          <Text className="text-[11px] text-gray-400 dark:text-slate-500 mt-3 leading-4">
            Taxes and network fees (if applicable) are shown at payment step.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View className="absolute left-0 right-0 bottom-0 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700 px-4 py-3">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={handleCancel}
            className="flex-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl py-4 items-center"
          >
            <Text className="text-sm font-extrabold text-black dark:text-slate-100">
              Cancel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handlePlaceOrder}
            className="flex-1 bg-om-accent rounded-xl py-4 items-center ml-3"
          >
            <Text className="text-sm font-extrabold text-black dark:text-slate-100">
              Place order
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Change Address Modal */}
      <Modal visible={editAddressOpen} transparent animationType="fade">
        <Pressable
          className="flex-1 bg-black/40"
          onPress={() => setEditAddressOpen(false)}
        >
          <Pressable
            className="absolute left-4 right-4 bottom-10 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-gray-100 dark:border-slate-700"
            onPress={() => {}}
          >
            <Text className="text-lg font-extrabold text-black dark:text-slate-100 mb-1">
              Change address
            </Text>
            <Text className="text-sm text-gray-500 dark:text-slate-400 mb-4">
              Update your shipping information.
            </Text>

            {(
              [
                { key: "fullName", label: "Full name" },
                { key: "phone", label: "Phone number" },
                { key: "street", label: "Street address" },
                { key: "city", label: "City" },
                { key: "state", label: "Province/State" },
                { key: "zip", label: "Postal/Zip code" },
                { key: "country", label: "Country" },
              ] as const satisfies AddressField[]
            ).map((f) => (
              <View key={f.key} className="mb-3">
                <Text className="text-xs font-semibold text-gray-600 dark:text-slate-300 mb-1">
                  {f.label}
                </Text>
                <View className="bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-xl px-3 h-11 justify-center">
                  <TextInput
                    value={draftAddress[f.key]}
                    onChangeText={(v) =>
                      setDraftAddress((prev) => ({ ...prev, [f.key]: v }))
                    }
                    placeholder={f.label}
                    placeholderTextColor={APP_COLORS.placeholder}
                    className="text-sm text-black dark:text-slate-100"
                  />
                </View>
              </View>
            ))}

            <View className="flex-row items-center mt-2">
              <TouchableOpacity
                onPress={() => setEditAddressOpen(false)}
                className="flex-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl py-3 items-center"
              >
                <Text className="text-sm font-extrabold text-black dark:text-slate-100">
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSaveAddress}
                className="flex-1 bg-om-accent rounded-xl py-3 items-center ml-3"
              >
                <Text className="text-sm font-extrabold text-black dark:text-slate-100">
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
