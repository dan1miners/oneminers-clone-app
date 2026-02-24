import React, { useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { APP_COLORS } from "../../constants/colors";
import { useAppTheme } from "../../providers/theme-provider";

type RepairStatus =
  | "diagnosis"
  | "repairing"
  | "testing"
  | "completed"
  | "shipped";

type RepairDetail = {
  id: string;
  minerName: string;
  model: string;
  serialNumber: string;
  issue: string;
  status: RepairStatus;
  dateReceived: string;
  estimatedCompletion: string;
  progress: number;
  cost: string;
  notes: string[];
};

const REPAIR_DATA: Record<string, RepairDetail> = {
  "1": {
    id: "1",
    minerName: "Antminer S19 Pro",
    model: "Bitmain S19 Pro",
    serialNumber: "SN-2023-00123",
    issue: "Power supply failure",
    status: "repairing",
    dateReceived: "2024-01-15",
    estimatedCompletion: "2024-01-25",
    progress: 65,
    cost: "$450",
    notes: [
      "Initial diagnostics completed",
      "Replacement PSU installed",
      "Stability testing in progress",
    ],
  },
  "2": {
    id: "2",
    minerName: "Whatsminer M30S+",
    model: "MicroBT M30S+",
    serialNumber: "SN-2023-00456",
    issue: "Fan replacement",
    status: "testing",
    dateReceived: "2024-01-10",
    estimatedCompletion: "2024-01-20",
    progress: 85,
    cost: "$280",
    notes: [
      "Damaged fan removed",
      "New fan installed",
      "Thermal and RPM testing underway",
    ],
  },
};

const STATUS_META: Record<
  RepairStatus,
  {
    label: string;
    color: string;
    icon: React.ComponentProps<typeof Ionicons>["name"];
  }
> = {
  diagnosis: {
    label: "Diagnosis",
    color: APP_COLORS.warning,
    icon: "search-outline",
  },
  repairing: {
    label: "Repairing",
    color: APP_COLORS.info,
    icon: "build-outline",
  },
  testing: {
    label: "Testing",
    color: APP_COLORS.purple,
    icon: "speedometer-outline",
  },
  completed: {
    label: "Completed",
    color: APP_COLORS.success,
    icon: "checkmark-circle-outline",
  },
  shipped: { label: "Shipped", color: APP_COLORS.lime, icon: "cube-outline" },
};

const DEFAULT_DETAIL: RepairDetail = {
  id: "unknown",
  minerName: "Unknown Miner",
  model: "N/A",
  serialNumber: "N/A",
  issue: "No details available for this repair request.",
  status: "diagnosis",
  dateReceived: "N/A",
  estimatedCompletion: "N/A",
  progress: 0,
  cost: "$0",
  notes: ["Repair ID not found."],
};

export default function RepairDetailsScreen() {
  const { colors: themeColors } = useAppTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();

  const detail = useMemo(() => {
    if (!params.id) return DEFAULT_DETAIL;
    return REPAIR_DATA[params.id] ?? DEFAULT_DETAIL;
  }, [params.id]);

  const status = STATUS_META[detail.status];

  return (
    <SafeAreaView
      className="flex-1 bg-om-bg dark:bg-slate-950"
      edges={["top", "bottom", "left", "right"]}
    >
      <View className="py-3 px-5 border-b border-om-border dark:border-slate-700 flex-row items-center h-[60px] bg-white dark:bg-slate-900">
        <TouchableOpacity onPress={() => router.back()} className="p-1 mr-3">
          <Ionicons name="arrow-back" size={24} color={themeColors.text} />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-black dark:text-slate-100 flex-1">
          Repair Details
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="p-4"
      >
        <View className="bg-white dark:bg-slate-900 rounded-2xl border border-om-border dark:border-slate-700 p-4 mb-4">
          <View className="flex-row items-start justify-between">
            <View className="flex-1 pr-3">
              <Text className="text-[16px] font-bold text-black dark:text-slate-100">
                {detail.minerName}
              </Text>
              <Text className="text-[12px] text-om-subtext dark:text-slate-400 mt-1">
                {detail.model}
              </Text>
              <Text className="text-[12px] text-om-subtext dark:text-slate-400 mt-1">
                {detail.serialNumber}
              </Text>
            </View>
            <Text className="text-[16px] font-extrabold text-black dark:text-slate-100">
              {detail.cost}
            </Text>
          </View>

          <View className="mt-4 flex-row items-center px-3 py-2 rounded-full bg-om-bg dark:bg-slate-950 border border-om-border dark:border-slate-700 self-start">
            <Ionicons name={status.icon} size={14} color={status.color} />
            <Text
              className="ml-1.5 text-[12px] font-semibold"
              style={{ color: status.color }}
            >
              {status.label}
            </Text>
          </View>

          <View className="mt-4">
            <Text className="text-[12px] text-om-subtext dark:text-slate-400 mb-1">
              Issue
            </Text>
            <Text className="text-[14px] text-om-text dark:text-slate-100">
              {detail.issue}
            </Text>
          </View>
        </View>

        <View className="bg-white dark:bg-slate-900 rounded-2xl border border-om-border dark:border-slate-700 p-4 mb-4">
          <Text className="text-[14px] font-bold text-black dark:text-slate-100 mb-3">
            Progress
          </Text>
          <View className="h-2 rounded-full bg-om-surface overflow-hidden">
            <View
              className="h-full rounded-full"
              style={{
                width: `${detail.progress}%`,
                backgroundColor: status.color,
              }}
            />
          </View>
          <Text className="text-[12px] text-om-subtext dark:text-slate-400 mt-2">
            {detail.progress}% complete
          </Text>
        </View>

        <View className="bg-white dark:bg-slate-900 rounded-2xl border border-om-border dark:border-slate-700 p-4 mb-4">
          <Text className="text-[14px] font-bold text-black dark:text-slate-100 mb-3">
            Timeline
          </Text>
          <View className="flex-row justify-between mb-2">
            <Text className="text-[12px] text-om-subtext dark:text-slate-400">
              Received
            </Text>
            <Text className="text-[12px] font-semibold text-om-text dark:text-slate-100">
              {detail.dateReceived}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-[12px] text-om-subtext dark:text-slate-400">
              Estimated completion
            </Text>
            <Text className="text-[12px] font-semibold text-om-text dark:text-slate-100">
              {detail.estimatedCompletion}
            </Text>
          </View>
        </View>

        <View className="bg-white dark:bg-slate-900 rounded-2xl border border-om-border dark:border-slate-700 p-4">
          <Text className="text-[14px] font-bold text-black dark:text-slate-100 mb-3">
            Repair Notes
          </Text>
          {detail.notes.map((note, index) => (
            <View
              key={`${detail.id}-${index}`}
              className="flex-row items-start mb-2"
            >
              <View className="w-5 h-5 rounded-full bg-om-accent/20 items-center justify-center mr-2 mt-0.5">
                <Text className="text-[10px] font-bold text-black dark:text-slate-100">
                  {index + 1}
                </Text>
              </View>
              <Text className="text-[13px] text-om-text dark:text-slate-100 flex-1">
                {note}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
