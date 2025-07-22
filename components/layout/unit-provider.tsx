"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useAuth } from "@/hooks/useAuth";
import { updateUserPreferences, getUserPreferences } from "@/lib/firestore";
import { getCookie, setCookie, COOKIE_NAMES } from "@/lib/cookies";

type UnitSystem = "metric" | "imperial";

interface UnitContextType {
  unitSystem: UnitSystem;
  setUnitSystem: (system: UnitSystem) => void;
  // Dimension conversions
  convertDimension: (value: number, fromUnit: "mm" | "inches") => number;
  formatDimension: (value: number, unit: "mm" | "inches") => string;
  // Weight conversions
  convertWeight: (value: number, fromUnit: "g" | "lb") => number;
  formatWeight: (value: number, unit: "g" | "lb") => string;
  // Unit getters
  getDimensionUnit: () => "mm" | "inches";
  getWeightUnit: () => "g" | "lb";
  // System helpers
  isMetric: () => boolean;
  isImperial: () => boolean;
}

const UnitContext = createContext<UnitContextType | undefined>(undefined);

export function UnitProvider({
  children,
  defaultUnitSystem,
}: {
  children: ReactNode;
  defaultUnitSystem?: UnitSystem;
}) {
  const [unitSystem, setUnitSystemState] = useState<UnitSystem>(
    defaultUnitSystem || "metric"
  );
  const { user, isLoggedIn } = useAuth();

  // Load user preferences when user logs in or component mounts
  useEffect(() => {
    const loadUserPreferences = async () => {
      // First try cookie (priority for SSR)
      const cookieUnitSystem = getCookie(COOKIE_NAMES.UNITS) as UnitSystem;
      if (
        cookieUnitSystem &&
        (cookieUnitSystem === "metric" || cookieUnitSystem === "imperial")
      ) {
        setUnitSystemState(cookieUnitSystem);
        return;
      }

      if (isLoggedIn && user) {
        try {
          const preferences = await getUserPreferences(user.uid);
          if (preferences?.preferredUnitSystem) {
            setUnitSystemState(preferences.preferredUnitSystem);
            setCookie(COOKIE_NAMES.UNITS, preferences.preferredUnitSystem);
          }
        } catch (error) {
          console.error("Error loading user preferences:", error);
        }
      } else {
        // Load from localStorage for non-logged users
        const savedUnitSystem = localStorage.getItem(
          "preferredUnitSystem"
        ) as UnitSystem;
        if (
          savedUnitSystem &&
          (savedUnitSystem === "metric" || savedUnitSystem === "imperial")
        ) {
          setUnitSystemState(savedUnitSystem);
          setCookie(COOKIE_NAMES.UNITS, savedUnitSystem);
        }
      }
    };

    loadUserPreferences();
  }, [isLoggedIn, user]);

  const setUnitSystem = async (newUnitSystem: UnitSystem) => {
    setUnitSystemState(newUnitSystem);
    setCookie(COOKIE_NAMES.UNITS, newUnitSystem);

    if (isLoggedIn && user) {
      // Save to Firebase for logged users
      try {
        await updateUserPreferences(user.uid, {
          preferredUnitSystem: newUnitSystem,
        });
      } catch (error) {
        console.error("Error saving unit system preference:", error);
      }
    } else {
      // Save to localStorage for non-logged users
      localStorage.setItem("preferredUnitSystem", newUnitSystem);
    }
  };

  // Dimension conversions
  const convertDimension = (
    value: number,
    fromUnit: "mm" | "inches"
  ): number => {
    const targetUnit = getDimensionUnit();
    if (fromUnit === targetUnit) return value;

    if (fromUnit === "mm" && targetUnit === "inches") {
      return value / 25.4;
    } else if (fromUnit === "inches" && targetUnit === "mm") {
      return value * 25.4;
    }

    return value;
  };

  const formatDimension = (value: number, unit: "mm" | "inches"): string => {
    if (unit === "mm") {
      return `${Math.round(value)} mm`;
    } else {
      return `${value.toFixed(2)} in`;
    }
  };

  // Weight conversions (simplified: only g and lb)
  const convertWeight = (value: number, fromUnit: "g" | "lb"): number => {
    const targetUnit = getWeightUnit();
    if (fromUnit === targetUnit) return value;

    if (fromUnit === "g" && targetUnit === "lb") {
      return value / 453.592;
    } else if (fromUnit === "lb" && targetUnit === "g") {
      return value * 453.592;
    }

    return value;
  };

  const formatWeight = (value: number, unit: "g" | "lb"): string => {
    if (unit === "g") {
      return `${Math.round(value)} g`;
    } else {
      return `${value.toFixed(2)} lb`;
    }
  };

  // Unit getters
  const getDimensionUnit = (): "mm" | "inches" => {
    return unitSystem === "metric" ? "mm" : "inches";
  };

  const getWeightUnit = (): "g" | "lb" => {
    return unitSystem === "metric" ? "g" : "lb";
  };

  // System helpers
  const isMetric = (): boolean => unitSystem === "metric";
  const isImperial = (): boolean => unitSystem === "imperial";

  return (
    <UnitContext.Provider
      value={{
        unitSystem,
        setUnitSystem,
        convertDimension,
        formatDimension,
        convertWeight,
        formatWeight,
        getDimensionUnit,
        getWeightUnit,
        isMetric,
        isImperial,
      }}
    >
      {children}
    </UnitContext.Provider>
  );
}

export function useUnit() {
  const context = useContext(UnitContext);
  if (context === undefined) {
    throw new Error("useUnit must be used within a UnitProvider");
  }
  return context;
}
