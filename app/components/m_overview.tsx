// app/components/AnimatedStatusDot.tsx
import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";

interface AnimatedStatusDotProps {
  color: string;
  isActive: boolean;
}

export default function AnimatedStatusDot({
  color,
  isActive,
}: AnimatedStatusDotProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isActive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [isActive, scaleAnim]);

  return (
    <Animated.View
      className="w-3 h-3 rounded-full mx-1"
      style={{
        backgroundColor: color,
        transform: [{ scale: scaleAnim }],
      }}
    />
  );
}
