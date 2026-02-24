import React, { useMemo, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { APP_COLORS } from "../../constants/colors";
import { useAppTheme } from "../../providers/theme-provider";

type Repair = {
  id: string;
  minerName: string;
  model: string;
  serialNumber: string;
  issue: string;
  status: "diagnosis" | "repairing" | "testing" | "completed" | "shipped";
  dateReceived: string;
  estimatedCompletion: string;
  progress: number;
  cost: string;
};

const ACCENT = APP_COLORS.accent;

export default function RepairsScreen() {
  const { colors: themeColors } = useAppTheme();
  const router = useRouter();

  const [repairs, setRepairs] = useState<Repair[]>([
    {
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
    },
    {
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
    },
    {
      id: "3",
      minerName: "AvalonMiner 1246",
      model: "Canaan 1246",
      serialNumber: "SN-2023-00789",
      issue: "Hashboard repair",
      status: "diagnosis",
      dateReceived: "2024-01-18",
      estimatedCompletion: "2024-01-30",
      progress: 30,
      cost: "$650",
    },
    {
      id: "4",
      minerName: "Antminer L7",
      model: "Bitmain L7",
      serialNumber: "SN-2023-00987",
      issue: "Completed",
      status: "completed",
      dateReceived: "2023-12-20",
      estimatedCompletion: "2024-01-05",
      progress: 100,
      cost: "$520",
    },
  ]);

  // Toast (simple)
  const [toast, setToast] = useState<{
    show: boolean;
    title: string;
    message?: string;
  }>({
    show: false,
    title: "",
    message: "",
  });

  const showToast = (title: string, message?: string) => {
    setToast({ show: true, title, message });
    setTimeout(() => setToast({ show: false, title: "", message: "" }), 1500);
  };

  // Update modal
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedRepairId, setSelectedRepairId] = useState<string | null>(null);

  const openUpdateModal = (repairId: string) => {
    setSelectedRepairId(repairId);
    setShowUpdateModal(true);
  };

  const closeUpdateModal = () => {
    setShowUpdateModal(false);
    setSelectedRepairId(null);
  };

  const markCompleted = () => {
    if (!selectedRepairId) return;
    setRepairs((prev) =>
      prev.map((r) =>
        r.id === selectedRepairId
          ? { ...r, status: "completed", progress: 100 }
          : r,
      ),
    );
    closeUpdateModal();
    showToast("Updated", "Marked as completed.");
  };

  const requestUpdate = () => {
    closeUpdateModal();
    showToast("Request sent", "Our repair team will follow up.");
  };

  const statusMeta = (status: Repair["status"]) => {
    switch (status) {
      case "diagnosis":
        return {
          label: "Diagnosis",
          color: APP_COLORS.warning,
          icon: "search-outline" as const,
        };
      case "repairing":
        return {
          label: "Repairing",
          color: APP_COLORS.info,
          icon: "build-outline" as const,
        };
      case "testing":
        return {
          label: "Testing",
          color: APP_COLORS.purple,
          icon: "speedometer-outline" as const,
        };
      case "completed":
        return {
          label: "Completed",
          color: APP_COLORS.success,
          icon: "checkmark-circle-outline" as const,
        };
      case "shipped":
        return {
          label: "Shipped",
          color: APP_COLORS.lime,
          icon: "cube-outline" as const,
        };
      default:
        return {
          label: "Unknown",
          color: APP_COLORS.muted,
          icon: "help-circle-outline" as const,
        };
    }
  };

  const counts = useMemo(() => {
    const base = { all: repairs.length, active: 0, completed: 0 };
    repairs.forEach((r) => {
      if (r.status === "completed") base.completed += 1;
      else base.active += 1;
    });
    return base;
  }, [repairs]);

  const RepairCard = ({ repair }: { repair: Repair }) => {
    const s = statusMeta(repair.status);

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() =>
          router.push(`/(essentials)/repair-details?id=${repair.id}`)
        }
        className="bg-white dark:bg-slate-900 rounded-2xl border border-om-border dark:border-slate-700 p-4 mb-3"
      >
        <View className="flex-row items-start justify-between">
          <View className="flex-1 pr-3">
            <Text
              className="text-[16px] font-bold text-black dark:text-slate-100"
              numberOfLines={1}
            >
              {repair.minerName}
            </Text>
            <Text
              className="text-[12px] text-om-subtext dark:text-slate-400 mt-0.5"
              numberOfLines={1}
            >
              {repair.model} • {repair.serialNumber}
            </Text>
          </View>

          <Text className="text-[16px] font-extrabold text-black dark:text-slate-100">
            {repair.cost}
          </Text>
        </View>

        <View className="flex-row items-center justify-between mt-3">
          <View className="flex-row items-center px-3 py-1.5 rounded-full bg-om-bg dark:bg-slate-950 border border-om-border dark:border-slate-700">
            <Ionicons name={s.icon} size={14} color={s.color} />
            <Text
              className="ml-1.5 text-[12px] font-semibold"
              style={{ color: s.color }}
            >
              {s.label}
            </Text>
          </View>

          <Text
            className="text-[12px] text-om-subtext dark:text-slate-400"
            numberOfLines={1}
          >
            ETA {repair.estimatedCompletion}
          </Text>
        </View>

        <Text
          className="text-[13px] text-om-text dark:text-slate-100 mt-3"
          numberOfLines={2}
        >
          <Text className="font-semibold">Issue: </Text>
          {repair.issue}
        </Text>

        <View className="mt-4">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-[12px] text-om-subtext dark:text-slate-400">
              Progress
            </Text>
            <Text className="text-[12px] font-semibold text-black dark:text-slate-100">
              {repair.progress}%
            </Text>
          </View>

          <View className="h-2 rounded-full bg-om-surface overflow-hidden">
            <View
              className="h-full rounded-full"
              style={{ width: `${repair.progress}%`, backgroundColor: s.color }}
            />
          </View>

          <View className="flex-row items-center justify-between mt-3">
            <Text className="text-[12px] text-om-subtext dark:text-slate-400">
              Received {repair.dateReceived}
            </Text>

            <TouchableOpacity
              onPress={() => openUpdateModal(repair.id)}
              activeOpacity={0.9}
              className="flex-row items-center px-3 py-2 rounded-xl bg-om-accent/10 border border-om-accent/20"
            >
              <Ionicons
                name="options-outline"
                size={16}
                color={themeColors.text}
              />
              <Text className="ml-2 text-[12px] font-bold text-black dark:text-slate-100">
                Actions
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-row mt-4 border-t border-om-border dark:border-slate-700 pt-3">
          {[
            { label: "Contact", icon: "chatbubble-outline" as const },
            { label: "Invoice", icon: "document-text-outline" as const },
          ].map((a, idx) => (
            <TouchableOpacity
              key={a.label}
              activeOpacity={0.9}
              className={[
                "flex-1 flex-row items-center justify-center py-2 rounded-xl bg-om-bg dark:bg-slate-950 border border-om-border dark:border-slate-700",
                idx === 0 ? "mr-2" : "ml-2",
              ].join(" ")}
            >
              <Ionicons name={a.icon} size={16} color={ACCENT} />
              <Text className="ml-2 text-[12px] font-semibold text-om-text dark:text-slate-100">
                {a.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      className="flex-1 bg-om-bg dark:bg-slate-950"
      edges={["top", "bottom", "left", "right"]}
    >
      {/* Header */}
      <View className="py-3 px-5 border-b border-om-border dark:border-slate-700 flex-row items-center h-[60px] bg-white dark:bg-slate-900">
        <TouchableOpacity onPress={() => router.back()} className="p-1 mr-3">
          <Ionicons name="arrow-back" size={24} color={themeColors.text} />
        </TouchableOpacity>

        <Text className="text-lg font-semibold text-black dark:text-slate-100 flex-1">
          Repairs
        </Text>

        <TouchableOpacity
          onPress={() => router.push("/(essentials)/new-repair")}
          activeOpacity={0.9}
          className="w-10 h-10 rounded-full bg-om-accent/15 border border-om-accent/25 items-center justify-center"
        >
          <Ionicons name="add" size={22} color={themeColors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="p-4"
      >
        {/* Simple summary */}
        <View className="bg-white dark:bg-slate-900 rounded-2xl border border-om-border dark:border-slate-700 p-4 mb-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-[12px] text-om-subtext dark:text-slate-400 font-semibold">
                Overview
              </Text>
              <Text className="text-[16px] font-bold text-black dark:text-slate-100 mt-1">
                {counts.all} repairs
              </Text>
            </View>

            <View className="items-end">
              <Text className="text-[12px] text-om-subtext dark:text-slate-400">
                Active{" "}
                <Text className="font-bold text-black dark:text-slate-100">
                  {counts.active}
                </Text>
              </Text>
              <Text className="text-[12px] text-om-subtext dark:text-slate-400 mt-1">
                Completed{" "}
                <Text className="font-bold text-black dark:text-slate-100">
                  {counts.completed}
                </Text>
              </Text>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => router.push("/(essentials)/new-repair")}
            className="mt-4 bg-om-accent rounded-xl py-3 items-center justify-center flex-row"
          >
            <Ionicons name="add" size={18} color={themeColors.text} />
            <Text className="ml-2 font-bold text-white">New repair</Text>
          </TouchableOpacity>
        </View>

        {/* List */}
        {repairs.length > 0 ? (
          repairs.map((r) => <RepairCard key={r.id} repair={r} />)
        ) : (
          <View className="items-center bg-white dark:bg-slate-900 border border-om-border dark:border-slate-700 rounded-2xl p-10">
            <MaterialIcons
              name="handyman"
              size={56}
              color={APP_COLORS.lightGray}
            />
            <Text className="text-[16px] font-bold mt-4 text-black dark:text-slate-100">
              No repairs yet
            </Text>
            <Text className="text-[13px] text-om-subtext dark:text-slate-400 mt-2 text-center">
              Create a repair request to get started.
            </Text>

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => router.push("/(essentials)/new-repair")}
              className="mt-5 bg-om-accent rounded-xl px-5 py-3 flex-row items-center"
            >
              <Ionicons name="add" size={18} color={themeColors.text} />
              <Text className="ml-2 font-bold text-white">Create repair</Text>
            </TouchableOpacity>
          </View>
        )}

        <View className="h-8" />
      </ScrollView>

      {/* Update Modal (replaces Alert) */}
      <Modal
        visible={showUpdateModal}
        transparent
        animationType="fade"
        onRequestClose={closeUpdateModal}
      >
        <View className="flex-1 bg-black/50 justify-end p-4">
          <View className="bg-white dark:bg-slate-900 rounded-2xl border border-om-border dark:border-slate-700 p-4">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-[16px] font-bold text-black dark:text-slate-100">
                Repair actions
              </Text>
              <TouchableOpacity
                onPress={closeUpdateModal}
                className="w-9 h-9 rounded-full bg-om-bg dark:bg-slate-950 border border-om-border dark:border-slate-700 items-center justify-center"
              >
                <Ionicons name="close" size={18} color={themeColors.text} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={markCompleted}
              className="flex-row items-center justify-between p-4 rounded-xl border border-om-border dark:border-slate-700 bg-om-bg dark:bg-slate-950"
            >
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-xl bg-om-success/10 items-center justify-center mr-3">
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={20}
                    color={APP_COLORS.success}
                  />
                </View>
                <View>
                  <Text className="text-[14px] font-bold text-black dark:text-slate-100">
                    Mark as completed
                  </Text>
                  <Text className="text-[12px] text-om-subtext dark:text-slate-400 mt-0.5">
                    Sets progress to 100%.
                  </Text>
                </View>
              </View>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={APP_COLORS.lightGray}
              />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={requestUpdate}
              className="mt-3 flex-row items-center justify-between p-4 rounded-xl border border-om-border dark:border-slate-700 bg-om-bg dark:bg-slate-950"
            >
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-xl bg-om-accent/15 items-center justify-center mr-3">
                  <Ionicons
                    name="refresh-outline"
                    size={20}
                    color={themeColors.text}
                  />
                </View>
                <View>
                  <Text className="text-[14px] font-bold text-black dark:text-slate-100">
                    Request update
                  </Text>
                  <Text className="text-[12px] text-om-subtext dark:text-slate-400 mt-0.5">
                    We will ask the repair team.
                  </Text>
                </View>
              </View>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={APP_COLORS.lightGray}
              />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={closeUpdateModal}
              className="mt-4 bg-om-accent rounded-xl py-3 items-center justify-center"
            >
              {/* icon black, text white */}
              <Text className="font-bold text-white">Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Toast */}
      {toast.show ? (
        <View className="absolute left-0 right-0 bottom-6 items-center px-5">
          <View className="bg-white dark:bg-slate-900 border border-om-border dark:border-slate-700 rounded-2xl px-4 py-3 flex-row items-center max-w-[420px] w-full">
            <View className="w-10 h-10 rounded-full bg-om-accent/15 items-center justify-center mr-3">
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={themeColors.text}
              />
            </View>
            <View className="flex-1">
              <Text className="text-[14px] font-bold text-black dark:text-slate-100">
                {toast.title}
              </Text>
              {toast.message ? (
                <Text className="text-[12px] text-om-subtext dark:text-slate-400 mt-0.5">
                  {toast.message}
                </Text>
              ) : null}
            </View>
          </View>
        </View>
      ) : null}
    </SafeAreaView>
  );
}
