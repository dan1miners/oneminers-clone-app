import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { APP_COLORS } from "../../constants/colors";
import { useAppTheme } from "../../providers/theme-provider";

const ISSUE_TYPES = [
  "Power supply issue",
  "Hashboard error",
  "Cooling problem",
  "Network/connectivity",
  "Other",
] as const;

type IssueType = (typeof ISSUE_TYPES)[number];

export default function NewRepairScreen() {
  const { colors: themeColors } = useAppTheme();
  const router = useRouter();
  const [model, setModel] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [issueType, setIssueType] = useState<IssueType>("Power supply issue");
  const [description, setDescription] = useState("");

  const canSubmit = useMemo(() => {
    return (
      model.trim().length > 0 &&
      serialNumber.trim().length > 0 &&
      description.trim().length > 0
    );
  }, [model, serialNumber, description]);

  const handleCreate = () => {
    if (!canSubmit) {
      Alert.alert(
        "Missing information",
        "Please complete all required fields.",
      );
      return;
    }

    Alert.alert(
      "Repair request created",
      "Your request has been submitted to the repair team.",
      [{ text: "OK", onPress: () => router.replace("/(essentials)/repairs") }],
    );
  };

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
          New Repair
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="p-4"
      >
        <View className="bg-white dark:bg-slate-900 rounded-2xl border border-om-border dark:border-slate-700 p-4">
          <Text className="text-[16px] font-bold text-black dark:text-slate-100 mb-4">
            Miner Information
          </Text>

          <View className="mb-4">
            <Text className="text-[12px] text-om-subtext dark:text-slate-400 mb-2">
              Model *
            </Text>
            <View className="rounded-xl border border-om-border dark:border-slate-700 bg-om-bg dark:bg-slate-950 px-3">
              <TextInput
                value={model}
                onChangeText={setModel}
                placeholder="e.g. Antminer S19 Pro"
                placeholderTextColor={APP_COLORS.placeholder}
                className="h-12 text-[14px] text-black dark:text-slate-100"
              />
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-[12px] text-om-subtext dark:text-slate-400 mb-2">
              Serial Number *
            </Text>
            <View className="rounded-xl border border-om-border dark:border-slate-700 bg-om-bg dark:bg-slate-950 px-3">
              <TextInput
                value={serialNumber}
                onChangeText={setSerialNumber}
                placeholder="e.g. SN-2024-00125"
                placeholderTextColor={APP_COLORS.placeholder}
                className="h-12 text-[14px] text-black dark:text-slate-100"
                autoCapitalize="characters"
              />
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-[12px] text-om-subtext dark:text-slate-400 mb-2">
              Issue Type *
            </Text>
            <View className="flex-row flex-wrap">
              {ISSUE_TYPES.map((type) => {
                const active = issueType === type;
                return (
                  <TouchableOpacity
                    key={type}
                    onPress={() => setIssueType(type)}
                    className={[
                      "px-3 py-2 rounded-lg border mr-2 mb-2",
                      active
                        ? "bg-om-accent-100 border-om-accent"
                        : "bg-om-bg dark:bg-slate-950 border-om-border dark:border-slate-700",
                    ].join(" ")}
                  >
                    <Text
                      className={
                        active
                          ? "text-black dark:text-slate-100 font-semibold text-[12px]"
                          : "text-om-subtext dark:text-slate-400 text-[12px]"
                      }
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View>
            <Text className="text-[12px] text-om-subtext dark:text-slate-400 mb-2">
              Issue Description *
            </Text>
            <View className="rounded-xl border border-om-border dark:border-slate-700 bg-om-bg dark:bg-slate-950 px-3 py-2">
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Describe the issue and when it started..."
                placeholderTextColor={APP_COLORS.placeholder}
                className="text-[14px] text-black dark:text-slate-100 min-h-[100px]"
                multiline
                textAlignVertical="top"
              />
            </View>
          </View>
        </View>
      </ScrollView>

      <View className="px-4 py-3 bg-white dark:bg-slate-900 border-t border-om-border dark:border-slate-700">
        <View className="flex-row">
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-1 py-4 rounded-xl items-center border border-om-border dark:border-slate-700 bg-om-bg dark:bg-slate-950 mr-2"
          >
            <Text className="text-[14px] font-semibold text-om-subtext dark:text-slate-400">
              Cancel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleCreate}
            disabled={!canSubmit}
            className={[
              "flex-1 py-4 rounded-xl items-center ml-2",
              canSubmit ? "bg-om-accent" : "bg-om-border",
            ].join(" ")}
          >
            <Text className="text-[14px] font-bold text-black dark:text-slate-100">
              Create Request
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
