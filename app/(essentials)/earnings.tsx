import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link } from "expo-router";
import { APP_COLORS } from "../../constants/colors";
import { useAppTheme } from "../../providers/theme-provider";

type Period = "Hourly" | "Daily" | "Monthly" | "Yearly";
type SortKey = "date" | "amount";

type Row = {
  id: string;
  label: string; // e.g. "10:00", "2025-12-31", "Dec 2025", "2025"
  amountBtc: number;
  amountUsd: number;
};

const TABS: Period[] = ["Hourly", "Daily", "Monthly", "Yearly"];

const MOCK: Record<Period, Row[]> = {
  Hourly: [
    { id: "h1", label: "00:00", amountBtc: 0.000012, amountUsd: 0.78 },
    { id: "h2", label: "01:00", amountBtc: 0.00001, amountUsd: 0.66 },
    { id: "h3", label: "02:00", amountBtc: 0.000013, amountUsd: 0.84 },
    { id: "h4", label: "03:00", amountBtc: 0.000011, amountUsd: 0.72 },
    { id: "h5", label: "04:00", amountBtc: 0.000014, amountUsd: 0.9 },
  ],
  Daily: [
    { id: "d1", label: "2025-12-31", amountBtc: 0.002154, amountUsd: 45.3 },
    { id: "d2", label: "2025-12-30", amountBtc: 0.002041, amountUsd: 43.1 },
    { id: "d3", label: "2025-12-29", amountBtc: 0.00198, amountUsd: 41.8 },
    { id: "d4", label: "2025-12-28", amountBtc: 0.00222, amountUsd: 46.9 },
    { id: "d5", label: "2025-12-27", amountBtc: 0.00208, amountUsd: 44.0 },
  ],
  Monthly: [
    { id: "m1", label: "Dec 2025", amountBtc: 0.0612, amountUsd: 1290.0 },
    { id: "m2", label: "Nov 2025", amountBtc: 0.0548, amountUsd: 1160.0 },
    { id: "m3", label: "Oct 2025", amountBtc: 0.0495, amountUsd: 1045.0 },
  ],
  Yearly: [
    { id: "y1", label: "2025", amountBtc: 0.612, amountUsd: 12900.0 },
    { id: "y2", label: "2024", amountBtc: 0.488, amountUsd: 10250.0 },
  ],
};

export default function EarningsScreen() {
  const { colors: themeColors } = useAppTheme();
  const [period, setPeriod] = useState<Period>("Daily");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [asc, setAsc] = useState(false);

  const rows = useMemo(() => {
    const data = [...MOCK[period]];
    data.sort((a, b) => {
      const aVal = sortKey === "date" ? a.label : a.amountUsd;
      const bVal = sortKey === "date" ? b.label : b.amountUsd;

      // date labels sort lexicographically because formats are consistent in mock
      if (aVal < bVal) return asc ? -1 : 1;
      if (aVal > bVal) return asc ? 1 : -1;
      return 0;
    });
    return data;
  }, [period, sortKey, asc]);

  const totalUsd = useMemo(
    () => rows.reduce((s, r) => s + r.amountUsd, 0),
    [rows],
  );

  return (
    <SafeAreaView
      className="flex-1 bg-gray-50 dark:bg-slate-950"
      edges={["top", "bottom", "left", "right"]}
    >
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700">
        <Link href="../" asChild>
          <TouchableOpacity className="p-1 mr-3">
            <Ionicons name="arrow-back" size={22} color={themeColors.text} />
          </TouchableOpacity>
        </Link>

        <View className="flex-1">
          <View className="flex-row items-baseline">
            <Text className="text-xl font-extrabold text-om-accent">one</Text>
            <Text className="text-xl font-extrabold text-black dark:text-slate-100">
              miners
            </Text>
          </View>
          <Text className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">
            Earnings
          </Text>
        </View>
      </View>

      {/* Filters */}
      <View className="px-4 pt-4">
        {/* Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row">
            {TABS.map((t) => {
              const active = t === period;
              return (
                <TouchableOpacity
                  key={t}
                  onPress={() => setPeriod(t)}
                  className={`mr-2 px-4 py-2 rounded-full border ${
                    active
                      ? "bg-om-accent border-om-accent"
                      : "bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700"
                  }`}
                >
                  <Text
                    className={`text-sm font-semibold ${active ? "text-black dark:text-slate-100" : "text-gray-600 dark:text-slate-300"}`}
                  >
                    {t}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* Sort */}
        <View className="flex-row items-center justify-between mt-3 mb-3">
          <View className="flex-row items-center">
            <Text className="text-xs text-gray-500 dark:text-slate-400 mr-2">
              Sort by
            </Text>

            <TouchableOpacity
              onPress={() => setSortKey("date")}
              className={`px-3 py-2 rounded-full border mr-2 ${
                sortKey === "date"
                  ? "bg-white dark:bg-slate-900 border-gray-300 dark:border-slate-700"
                  : "bg-gray-50 dark:bg-slate-950 border-gray-200 dark:border-slate-700"
              }`}
            >
              <Text className="text-xs font-semibold text-black dark:text-slate-100">
                Date
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSortKey("amount")}
              className={`px-3 py-2 rounded-full border ${
                sortKey === "amount"
                  ? "bg-white dark:bg-slate-900 border-gray-300 dark:border-slate-700"
                  : "bg-gray-50 dark:bg-slate-950 border-gray-200 dark:border-slate-700"
              }`}
            >
              <Text className="text-xs font-semibold text-black dark:text-slate-100">
                Amount
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => setAsc((v) => !v)}
            className="flex-row items-center px-3 py-2 rounded-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700"
          >
            <Ionicons
              name={asc ? "arrow-up" : "arrow-down"}
              size={14}
              color={themeColors.text}
            />
            <Text className="text-xs font-semibold text-black dark:text-slate-100 ml-2">
              {asc ? "Ascending" : "Descending"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Summary */}
        <View className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-gray-100 dark:border-slate-700 mb-3">
          <Text className="text-xs text-gray-500 dark:text-slate-400">
            Total ({period})
          </Text>
          <Text className="text-xl font-extrabold text-black dark:text-slate-100 mt-1">
            ${totalUsd.toFixed(2)}
          </Text>
          <Text className="text-[11px] text-gray-400 dark:text-slate-500 mt-1">
            Values shown are sample data. Replace with your API.
          </Text>
        </View>
      </View>

      {/* "Table" List */}
      <View className="flex-1 px-4">
        {/* Header row */}
        <View className="flex-row items-center bg-gray-100 dark:bg-slate-800 rounded-xl px-3 py-2">
          <Text className="flex-1 text-[11px] font-semibold text-gray-600 dark:text-slate-300">
            {period === "Hourly" ? "Time" : "Period"}
          </Text>
          <Text className="w-24 text-right text-[11px] font-semibold text-gray-600 dark:text-slate-300">
            BTC
          </Text>
          <Text className="w-24 text-right text-[11px] font-semibold text-gray-600 dark:text-slate-300">
            USD
          </Text>
        </View>

        <FlatList
          data={rows}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 10, paddingBottom: 24 }}
          renderItem={({ item }) => (
            <View className="flex-row items-center bg-white dark:bg-slate-900 rounded-xl px-3 py-3 mb-2 border border-gray-100 dark:border-slate-700">
              <Text className="flex-1 text-sm font-semibold text-black dark:text-slate-100">
                {item.label}
              </Text>

              <Text className="w-24 text-right text-xs text-gray-600 dark:text-slate-300">
                {item.amountBtc.toFixed(6)}
              </Text>

              <Text className="w-24 text-right text-xs font-semibold text-black dark:text-slate-100">
                ${item.amountUsd.toFixed(2)}
              </Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}
