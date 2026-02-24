import * as FileSystem from "expo-file-system/legacy";
import { useColorScheme as useNativewindColorScheme } from "nativewind";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useColorScheme as useSystemColorScheme } from "react-native";
import { APP_COLORS } from "../constants/colors";

export type ThemeMode = "light" | "dark" | "system";
export type AppTheme = "light" | "dark";

type ThemePalette = {
  background: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  subtext: string;
  muted: string;
  border: string;
  borderSoft: string;
  accent: string;
  danger: string;
  overlay: string;
  tabInactive: string;
};

const LIGHT_PALETTE: ThemePalette = {
  background: APP_COLORS.background,
  surface: APP_COLORS.white,
  surfaceAlt: APP_COLORS.gray100,
  text: APP_COLORS.text,
  subtext: APP_COLORS.subtext,
  muted: APP_COLORS.muted,
  border: APP_COLORS.border,
  borderSoft: APP_COLORS.surface,
  accent: APP_COLORS.accent,
  danger: APP_COLORS.danger,
  overlay: "rgba(0,0,0,0.5)",
  tabInactive: APP_COLORS.tabInactive,
};

const DARK_PALETTE: ThemePalette = {
  background: "#0B1220",
  surface: "#111827",
  surfaceAlt: "#1F2937",
  text: "#F3F4F6",
  subtext: "#9CA3AF",
  muted: "#9CA3AF",
  border: "#374151",
  borderSoft: "#2A3342",
  accent: APP_COLORS.accent,
  danger: "#F87171",
  overlay: "rgba(0,0,0,0.65)",
  tabInactive: "#9CA3AF",
};

type ThemeContextValue = {
  mode: ThemeMode;
  theme: AppTheme;
  isDark: boolean;
  colors: ThemePalette;
  isReady: boolean;
  setMode: (nextMode: ThemeMode) => void;
  setDarkMode: (enabled: boolean) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const SETTINGS_FILE_URI = FileSystem.documentDirectory
  ? `${FileSystem.documentDirectory}theme-settings.json`
  : null;

function isThemeMode(value: unknown): value is ThemeMode {
  return value === "light" || value === "dark" || value === "system";
}

async function loadStoredMode(): Promise<ThemeMode | null> {
  if (!SETTINGS_FILE_URI) return null;

  try {
    const raw = await FileSystem.readAsStringAsync(SETTINGS_FILE_URI);
    const parsed = JSON.parse(raw) as { mode?: unknown };
    return isThemeMode(parsed.mode) ? parsed.mode : null;
  } catch {
    return null;
  }
}

async function persistMode(mode: ThemeMode): Promise<void> {
  if (!SETTINGS_FILE_URI) return;

  try {
    await FileSystem.writeAsStringAsync(
      SETTINGS_FILE_URI,
      JSON.stringify({ mode }),
    );
  } catch {
    // Ignore write errors to keep UI responsive.
  }
}

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useSystemColorScheme();
  const { setColorScheme: setNativewindColorScheme } =
    useNativewindColorScheme();
  const [mode, setModeState] = useState<ThemeMode>("system");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const storedMode = await loadStoredMode();
      if (mounted && storedMode) {
        setModeState(storedMode);
      }
      if (mounted) {
        setIsReady(true);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const theme: AppTheme =
    mode === "system"
      ? systemColorScheme === "dark"
        ? "dark"
        : "light"
      : mode;
  const isDark = theme === "dark";
  const colors = isDark ? DARK_PALETTE : LIGHT_PALETTE;

  useEffect(() => {
    try {
      setNativewindColorScheme(mode === "system" ? "system" : mode);
    } catch {
      // Ignore if Nativewind color-scheme control is unavailable.
    }
  }, [mode, setNativewindColorScheme]);

  const setMode = useCallback((nextMode: ThemeMode) => {
    setModeState(nextMode);
    void persistMode(nextMode);
  }, []);

  const setDarkMode = useCallback(
    (enabled: boolean) => {
      setMode(enabled ? "dark" : "light");
    },
    [setMode],
  );

  const toggleTheme = useCallback(() => {
    setMode((isDark ? "light" : "dark") as ThemeMode);
  }, [isDark, setMode]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      theme,
      isDark,
      colors,
      isReady,
      setMode,
      setDarkMode,
      toggleTheme,
    }),
    [colors, isDark, isReady, mode, setDarkMode, setMode, theme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useAppTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useAppTheme must be used inside AppThemeProvider");
  }
  return context;
}
