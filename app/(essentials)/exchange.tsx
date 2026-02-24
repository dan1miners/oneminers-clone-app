import React, { useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { APP_COLORS } from "../../constants/colors";
import { useAppTheme } from "../../providers/theme-provider";

/* ---------- Types ---------- */

type CryptoAsset = {
  id: string;
  name: string;
  symbol: string;
  balance: string;
  price: number;
  change24h: string;
  icon: string;
};

type ExchangePair = {
  from: string;
  to: string;
  rate: number;
  fee: number; // percent
  minAmount: number;
};

type ExchangeTransaction = {
  id: string;
  fromAsset: string;
  toAsset: string;
  fromAmount: string;
  toAmount: string;
  rate: number;
  status: "Completed" | "Pending" | "Failed" | "Processing";
  timestamp: string;
};

/* ---------- Mock Data ---------- */

const mockCryptoAssets: CryptoAsset[] = [
  {
    id: "btc",
    name: "Bitcoin",
    symbol: "BTC",
    balance: "0.01234567",
    price: 45000,
    change24h: "+2.3%",
    icon: "🟠",
  },
  {
    id: "eth",
    name: "Ethereum",
    symbol: "ETH",
    balance: "1.57890",
    price: 3200,
    change24h: "+1.8%",
    icon: "🟣",
  },
  {
    id: "usdt",
    name: "Tether",
    symbol: "USDT",
    balance: "500.00",
    price: 1,
    change24h: "0.0%",
    icon: "💎",
  },
  {
    id: "aleo",
    name: "Aleo",
    symbol: "ALEO",
    balance: "1250.50",
    price: 2.25,
    change24h: "+5.7%",
    icon: "🔵",
  },
  {
    id: "kas",
    name: "Kaspa",
    symbol: "KAS",
    balance: "320931.17",
    price: 0.05,
    change24h: "+1.2%",
    icon: "🟢",
  },
  {
    id: "sol",
    name: "Solana",
    symbol: "SOL",
    balance: "15.75",
    price: 180,
    change24h: "+3.1%",
    icon: "🟡",
  },
];

const exchangeRates: ExchangePair[] = [
  { from: "btc", to: "eth", rate: 14.0625, fee: 0.1, minAmount: 0.001 },
  { from: "btc", to: "usdt", rate: 45000, fee: 0.1, minAmount: 0.001 },
  { from: "eth", to: "btc", rate: 0.0711, fee: 0.1, minAmount: 0.01 },
  { from: "eth", to: "usdt", rate: 3200, fee: 0.1, minAmount: 0.01 },

  // sample pairs so it doesn't feel “broken” when selecting other coins
  { from: "usdt", to: "btc", rate: 1 / 45000, fee: 0.1, minAmount: 10 },
  { from: "usdt", to: "eth", rate: 1 / 3200, fee: 0.1, minAmount: 10 },
];

const mockExchanges: ExchangeTransaction[] = [
  {
    id: "ex1",
    fromAsset: "btc",
    toAsset: "eth",
    fromAmount: "0.001",
    toAmount: "0.01406",
    rate: 14.06,
    status: "Completed",
    timestamp: "2023-10-27 10:30 AM",
  },
  {
    id: "ex2",
    fromAsset: "eth",
    toAsset: "sol",
    fromAmount: "0.5",
    toAmount: "8.89",
    rate: 17.78,
    status: "Processing",
    timestamp: "2023-10-26 09:15 PM",
  },
];

/* ---------- Theme ---------- */

const COLORS = {
  accent: APP_COLORS.accent,
  text: APP_COLORS.textStrong,
  muted: APP_COLORS.muted,
  border: APP_COLORS.border,
  success: APP_COLORS.success,
  danger: APP_COLORS.danger,
};

/* ---------- Component ---------- */

export default function ExchangePage() {
  const { colors: themeColors } = useAppTheme();
  const router = useRouter();

  const [fromAsset, setFromAsset] = useState(mockCryptoAssets[0].id);
  const [toAsset, setToAsset] = useState(mockCryptoAssets[1].id);

  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");

  const [showAssetPicker, setShowAssetPicker] = useState<null | "from" | "to">(
    null,
  );
  const [assetSearch, setAssetSearch] = useState("");

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // toasts/modals
  const [showToast, setShowToast] = useState(false);
  const [toastTitle, setToastTitle] = useState("Error");
  const [toastMsg, setToastMsg] = useState("");

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const fromAssetData = useMemo(
    () => mockCryptoAssets.find((a) => a.id === fromAsset),
    [fromAsset],
  );
  const toAssetData = useMemo(
    () => mockCryptoAssets.find((a) => a.id === toAsset),
    [toAsset],
  );

  const currentExchangeRate = useMemo(() => {
    return (
      exchangeRates.find((r) => r.from === fromAsset && r.to === toAsset) ||
      null
    );
  }, [fromAsset, toAsset]);

  const showError = (msg: string) => {
    setToastTitle("Error");
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1600);
  };

  useEffect(() => {
    if (!fromAmount || !currentExchangeRate) {
      setToAmount("");
      return;
    }

    const amt = parseFloat(fromAmount);
    if (Number.isNaN(amt) || amt <= 0) {
      setToAmount("");
      return;
    }

    const gross = amt * currentExchangeRate.rate;
    const net = gross * (1 - currentExchangeRate.fee / 100);
    setToAmount(net.toFixed(8));
  }, [fromAmount, currentExchangeRate]);

  const swapAssets = () => {
    setFromAsset(toAsset);
    setToAsset(fromAsset);
    setFromAmount("");
    setToAmount("");
  };

  const handleExchange = () => {
    const amt = parseFloat(fromAmount);

    if (!fromAmount || Number.isNaN(amt) || amt <= 0) {
      showError("Please enter a valid amount.");
      return;
    }

    if (!currentExchangeRate) {
      showError("This pair is not available yet.");
      return;
    }

    if (amt < currentExchangeRate.minAmount) {
      showError(
        `Minimum amount is ${currentExchangeRate.minAmount} ${fromAssetData?.symbol}.`,
      );
      return;
    }

    const balance = parseFloat(fromAssetData?.balance || "0");
    if (amt > balance) {
      showError("Insufficient balance.");
      return;
    }

    setShowConfirmModal(true);
  };

  const confirmExchange = () => {
    setIsProcessing(true);
    setShowConfirmModal(false);

    setTimeout(() => {
      setIsProcessing(false);

      setSuccessMessage(
        `Exchange of ${fromAmount} ${fromAssetData?.symbol} to ${toAmount} ${toAssetData?.symbol} submitted.`,
      );
      setShowSuccessModal(true);

      setFromAmount("");
      setToAmount("");
    }, 1200);
  };

  const renderAssetRow = ({ item }: { item: CryptoAsset }) => {
    const isSelectingFrom = showAssetPicker === "from";
    const disabled = isSelectingFrom
      ? item.id === toAsset
      : item.id === fromAsset;

    if (disabled) return null;

    const q = assetSearch.trim().toLowerCase();
    const match =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.symbol.toLowerCase().includes(q);

    if (!match) return null;

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        className="flex-row items-center p-4 border-b border-om-surface dark:border-slate-700"
        onPress={() => {
          if (showAssetPicker === "from") setFromAsset(item.id);
          if (showAssetPicker === "to") setToAsset(item.id);
          setShowAssetPicker(null);
          setAssetSearch("");
          setFromAmount("");
          setToAmount("");
        }}
      >
        <View className="w-10 h-10 rounded-full bg-om-surface items-center justify-center mr-3">
          <Text className="text-lg">{item.icon}</Text>
        </View>

        <View className="flex-1">
          <Text className="text-base font-bold text-black dark:text-slate-100">
            {item.symbol}
          </Text>
          <Text className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">
            {item.name} • Bal: {item.balance}
          </Text>
        </View>

        <View className="items-end">
          <Text className="text-sm font-semibold text-black dark:text-slate-100">
            ${item.price.toLocaleString()}
          </Text>
          <Text
            className={[
              "text-xs",
              item.change24h.startsWith("+")
                ? "text-green-600"
                : item.change24h.startsWith("-")
                  ? "text-red-500"
                  : "text-gray-400 dark:text-slate-500",
            ].join(" ")}
          >
            {item.change24h}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderExchangeItem = ({ item }: { item: ExchangeTransaction }) => {
    const badge =
      item.status === "Completed"
        ? { bg: "bg-green-100", text: "text-green-700" }
        : item.status === "Processing"
          ? { bg: "bg-om-accent/15", text: "text-black dark:text-slate-100" }
          : item.status === "Pending"
            ? { bg: "bg-yellow-100", text: "text-orange-600" }
            : { bg: "bg-red-100", text: "text-red-700" };

    return (
      <View className="bg-white dark:bg-slate-900 p-4 rounded-2xl mb-2 flex-row items-start border border-gray-100 dark:border-slate-700">
        <View className="flex-1 pr-3">
          <Text
            className="text-sm font-semibold text-black dark:text-slate-100"
            numberOfLines={1}
          >
            - {item.fromAmount} {item.fromAsset.toUpperCase()}
          </Text>
          <Text
            className="text-sm mt-0.5"
            style={{ color: COLORS.success }}
            numberOfLines={1}
          >
            + {item.toAmount} {item.toAsset.toUpperCase()}
          </Text>
          <Text
            className="text-xs text-gray-400 dark:text-slate-500 mt-1"
            numberOfLines={1}
          >
            {item.timestamp}
          </Text>
        </View>

        <View
          className={`px-3 py-1.5 rounded-full self-start min-w-[96px] items-center ${badge.bg}`}
        >
          <Text className={`text-xs font-semibold ${badge.text}`}>
            {item.status}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      className="flex-1 bg-gray-50 dark:bg-slate-950"
      edges={["top", "bottom", "left", "right"]}
    >
      {/* Header */}
      <View className="py-3 px-5 border-b border-gray-200 dark:border-slate-700 flex-row items-center h-[60px] bg-white dark:bg-slate-900">
        <TouchableOpacity onPress={() => router.back()} className="p-1 mr-3">
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-black dark:text-slate-100">
          Exchange
        </Text>
      </View>

      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        {/* Exchange Card */}
        <View className="bg-white dark:bg-slate-900 rounded-2xl p-5 mb-4 border border-gray-100 dark:border-slate-700">
          <Text className="text-lg font-bold text-black dark:text-slate-100 mb-4">
            Quick Exchange
          </Text>

          {/* From selector */}
          <Text className="text-xs font-semibold text-gray-500 dark:text-slate-400 mb-2">
            From
          </Text>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setShowAssetPicker("from")}
            className="flex-row items-center justify-between bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-700 rounded-2xl px-4 py-4"
          >
            <View className="flex-row items-center flex-1">
              <View className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 items-center justify-center mr-3 border border-gray-100 dark:border-slate-700">
                <Text className="text-lg">{fromAssetData?.icon}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-base font-bold text-black dark:text-slate-100">
                  {fromAssetData?.symbol}
                </Text>
                <Text className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">
                  Balance: {fromAssetData?.balance}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-down" size={18} color={COLORS.muted} />
          </TouchableOpacity>

          {/* Amount input */}
          <View className="flex-row items-center bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl mt-3">
            <TextInput
              className="flex-1 px-4 py-4 text-lg font-bold text-black dark:text-slate-100"
              placeholder="0.00"
              value={fromAmount}
              onChangeText={setFromAmount}
              keyboardType="decimal-pad"
              placeholderTextColor={COLORS.muted}
            />
            <TouchableOpacity
              onPress={() => setFromAmount(fromAssetData?.balance || "")}
              className="px-4"
              activeOpacity={0.85}
            >
              <Text
                className="text-sm font-bold"
                style={{ color: COLORS.accent }}
              >
                MAX
              </Text>
            </TouchableOpacity>
          </View>

          {/* Swap button */}
          <View className="items-center my-3">
            <TouchableOpacity
              onPress={swapAssets}
              activeOpacity={0.85}
              className="w-11 h-11 rounded-full bg-om-accent/20 items-center justify-center border border-om-accent/30"
            >
              <Ionicons
                name="swap-vertical"
                size={18}
                color={themeColors.text}
              />
            </TouchableOpacity>
          </View>

          {/* To selector */}
          <Text className="text-xs font-semibold text-gray-500 dark:text-slate-400 mb-2">
            To
          </Text>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setShowAssetPicker("to")}
            className="flex-row items-center justify-between bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-700 rounded-2xl px-4 py-4"
          >
            <View className="flex-row items-center flex-1">
              <View className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 items-center justify-center mr-3 border border-gray-100 dark:border-slate-700">
                <Text className="text-lg">{toAssetData?.icon}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-base font-bold text-black dark:text-slate-100">
                  {toAssetData?.symbol}
                </Text>
                <Text className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">
                  Balance: {toAssetData?.balance}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-down" size={18} color={COLORS.muted} />
          </TouchableOpacity>

          {/* Output */}
          <View className="flex-row items-center bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl mt-3">
            <TextInput
              className="flex-1 px-4 py-4 text-lg font-bold text-black dark:text-slate-100"
              value={toAmount}
              editable={false}
              placeholder="0.00"
              placeholderTextColor={COLORS.muted}
            />
            <Text className="px-4 text-sm font-bold text-gray-500 dark:text-slate-400">
              {toAssetData?.symbol}
            </Text>
          </View>

          {/* Rate info */}
          <View className="mt-4 bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-700 rounded-2xl p-4">
            {currentExchangeRate ? (
              <>
                <View className="flex-row justify-between mb-2">
                  <Text className="text-xs text-gray-500 dark:text-slate-400">
                    Rate
                  </Text>
                  <Text className="text-xs font-semibold text-black dark:text-slate-100">
                    1 {fromAssetData?.symbol} = {currentExchangeRate.rate}{" "}
                    {toAssetData?.symbol}
                  </Text>
                </View>
                <View className="flex-row justify-between mb-2">
                  <Text className="text-xs text-gray-500 dark:text-slate-400">
                    Fee
                  </Text>
                  <Text className="text-xs font-semibold text-black dark:text-slate-100">
                    {currentExchangeRate.fee}%
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-xs text-gray-500 dark:text-slate-400">
                    Minimum
                  </Text>
                  <Text className="text-xs font-semibold text-black dark:text-slate-100">
                    {currentExchangeRate.minAmount} {fromAssetData?.symbol}
                  </Text>
                </View>
              </>
            ) : (
              <View className="flex-row items-center">
                <Ionicons
                  name="information-circle-outline"
                  size={16}
                  color={COLORS.muted}
                />
                <Text className="text-xs text-gray-500 dark:text-slate-400 ml-2 flex-1">
                  This pair is not available yet. Try another “To” coin.
                </Text>
              </View>
            )}
          </View>

          {/* CTA */}
          <TouchableOpacity
            onPress={handleExchange}
            disabled={!fromAmount || !toAmount || isProcessing}
            activeOpacity={0.9}
            className={[
              "mt-4 rounded-2xl py-4 items-center",
              !fromAmount || !toAmount || isProcessing
                ? "bg-om-border-soft"
                : "bg-om-accent",
            ].join(" ")}
          >
            <Text className="text-base font-bold text-white">
              {isProcessing ? "Processing..." : "Exchange"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Recent */}
        <Text className="text-base font-bold text-black dark:text-slate-100 mb-3">
          Recent Exchanges
        </Text>
        <View className="mb-6">
          <FlatList
            data={mockExchanges}
            keyExtractor={(item) => item.id}
            renderItem={renderExchangeItem}
            scrollEnabled={false}
            ListEmptyComponent={
              <Text className="text-center text-gray-400 dark:text-slate-500 mt-6">
                No exchange history.
              </Text>
            }
          />
        </View>
      </ScrollView>

      {/* Asset Picker Modal */}
      <Modal visible={!!showAssetPicker} transparent animationType="fade">
        <View className="flex-1 bg-black/40 justify-center px-5">
          <View className="bg-white dark:bg-slate-900 rounded-2xl max-h-[80%] border border-gray-100 dark:border-slate-700">
            <View className="flex-row justify-between items-center p-4 border-b border-gray-100 dark:border-slate-700">
              <Text className="text-lg font-bold text-black dark:text-slate-100">
                Select {showAssetPicker === "from" ? "From" : "To"} Asset
              </Text>
              <TouchableOpacity onPress={() => setShowAssetPicker(null)}>
                <Ionicons name="close" size={22} color={themeColors.text} />
              </TouchableOpacity>
            </View>

            <View className="px-4 pt-4 pb-2">
              <View className="flex-row items-center bg-gray-50 dark:bg-slate-950 rounded-2xl px-4 py-3 border border-gray-100 dark:border-slate-700">
                <Ionicons name="search" size={18} color={COLORS.muted} />
                <TextInput
                  value={assetSearch}
                  onChangeText={setAssetSearch}
                  placeholder="Search coin"
                  placeholderTextColor={COLORS.muted}
                  className="flex-1 ml-3 text-black dark:text-slate-100"
                />
                {!!assetSearch && (
                  <TouchableOpacity onPress={() => setAssetSearch("")}>
                    <Ionicons
                      name="close-circle"
                      size={18}
                      color={COLORS.muted}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <FlatList
              data={mockCryptoAssets}
              keyExtractor={(i) => i.id}
              renderItem={renderAssetRow}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>

      {/* Confirm Modal */}
      <Modal visible={showConfirmModal} transparent animationType="fade">
        <View className="flex-1 bg-black/40 items-center justify-center px-5">
          <View className="bg-white dark:bg-slate-900 rounded-2xl p-5 w-full border border-gray-100 dark:border-slate-700">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-lg font-bold text-black dark:text-slate-100">
                Confirm Exchange
              </Text>
              <TouchableOpacity onPress={() => setShowConfirmModal(false)}>
                <Ionicons name="close" size={20} color={themeColors.text} />
              </TouchableOpacity>
            </View>

            <View className="mt-2 bg-gray-50 dark:bg-slate-950 rounded-2xl p-4 border border-gray-100 dark:border-slate-700">
              <View className="flex-row justify-between mb-2">
                <Text className="text-xs text-gray-500 dark:text-slate-400">
                  You send
                </Text>
                <Text className="text-xs font-semibold text-black dark:text-slate-100">
                  {fromAmount} {fromAssetData?.symbol}
                </Text>
              </View>
              <View className="flex-row justify-between mb-2">
                <Text className="text-xs text-gray-500 dark:text-slate-400">
                  You receive
                </Text>
                <Text className="text-xs font-semibold text-black dark:text-slate-100">
                  {toAmount} {toAssetData?.symbol}
                </Text>
              </View>
              {currentExchangeRate && (
                <View className="flex-row justify-between">
                  <Text className="text-xs text-gray-500 dark:text-slate-400">
                    Fee
                  </Text>
                  <Text className="text-xs font-semibold text-black dark:text-slate-100">
                    {currentExchangeRate.fee}%
                  </Text>
                </View>
              )}
            </View>

            <View className="flex-row gap-3 mt-4">
              <TouchableOpacity
                className="flex-1 bg-om-border-soft rounded-2xl py-4 items-center"
                onPress={() => setShowConfirmModal(false)}
                activeOpacity={0.9}
              >
                <Text className="text-gray-500 dark:text-slate-400 font-bold">
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 bg-om-accent rounded-2xl py-4 items-center"
                onPress={confirmExchange}
                activeOpacity={0.9}
              >
                <Text className="text-white font-bold">Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal transparent visible={showSuccessModal} animationType="fade">
        <View className="flex-1 bg-black/40 items-center justify-center px-5">
          <View className="bg-white dark:bg-slate-900 rounded-2xl p-5 w-full border border-gray-100 dark:border-slate-700">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-lg font-bold text-black dark:text-slate-100">
                Success
              </Text>

              <TouchableOpacity onPress={() => setShowSuccessModal(false)}>
                <Ionicons name="close" size={20} color={themeColors.text} />
              </TouchableOpacity>
            </View>

            <Text className="text-sm text-gray-600 dark:text-slate-300 leading-5 mt-1">
              {successMessage}
            </Text>

            <TouchableOpacity
              activeOpacity={0.9}
              className="mt-5 bg-om-accent rounded-2xl py-4 items-center"
              onPress={() => setShowSuccessModal(false)}
            >
              <Text className="text-base font-bold text-white">OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Error Toast */}
      <Modal transparent visible={showToast} animationType="fade">
        <View className="flex-1 justify-end">
          <View className="px-5 pb-8">
            <View className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-700 px-4 py-3 flex-row items-center">
              <View className="w-9 h-9 rounded-full bg-red-100 items-center justify-center mr-3">
                <Ionicons name="alert" size={18} color={COLORS.danger} />
              </View>

              <View className="flex-1">
                <Text className="text-sm font-bold text-black dark:text-slate-100">
                  {toastTitle}
                </Text>
                <Text className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                  {toastMsg}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => setShowToast(false)}
                className="p-1"
              >
                <Ionicons name="close" size={18} color={COLORS.muted} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
