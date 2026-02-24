import React from "react";
import { Text, View } from "react-native";
import { APP_COLORS } from "../../constants/colors";

type BrandWordmarkProps = {
  size?: number;
  subtitle?: string;
  subtitleClassName?: string;
  subtitleTransform?: "none" | "lowercase" | "uppercase" | "capitalize";
};

export default function BrandWordmark({
  size = 32,
  subtitle,
  subtitleClassName = "text-base text-gray-500",
  subtitleTransform = "lowercase",
}: BrandWordmarkProps) {
  return (
    <View className="items-center">
      <View className="flex-row items-center mb-2">
        <Text
          className="font-bold"
          style={{
            fontSize: size,
            textTransform: "lowercase",
            color: APP_COLORS.accent,
          }}
        >
          one
        </Text>
        <Text
          className="font-bold text-black"
          style={{ fontSize: size, textTransform: "lowercase" }}
        >
          miners
        </Text>
      </View>
      {subtitle ? (
        <Text
          className={subtitleClassName}
          style={{ textTransform: subtitleTransform }}
        >
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}
