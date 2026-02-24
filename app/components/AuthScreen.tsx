import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleProp,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

type AuthScreenProps = {
  children: React.ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  keyboardShouldPersistTaps?: "always" | "handled" | "never";
};

const BASE_CONTENT_STYLE: ViewStyle = {
  flexGrow: 1,
  paddingHorizontal: 24,
  paddingVertical: 40,
  justifyContent: "center",
};

export default function AuthScreen({
  children,
  contentContainerStyle,
  keyboardShouldPersistTaps = "handled",
}: AuthScreenProps) {
  return (
    <>
      <StatusBar style="dark" />
      <SafeAreaView
        className="flex-1 bg-white dark:bg-slate-950"
        edges={["top", "left", "right", "bottom"]}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView
            contentContainerStyle={[BASE_CONTENT_STYLE, contentContainerStyle]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps={keyboardShouldPersistTaps}
          >
            {children}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}
