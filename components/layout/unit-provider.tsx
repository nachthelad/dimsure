"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAuth } from "@/hooks/useAuth"
import { updateUserPreferences, getUserPreferences } from "@/lib/firestore"

type Unit = "mm" | "inches"

interface UnitContextType {
  unit: Unit
  setUnit: (unit: Unit) => void
  convertDimension: (value: number, fromUnit: Unit) => number
}

const UnitContext = createContext<UnitContextType | undefined>(undefined)

export function UnitProvider({ children }: { children: ReactNode }) {
  const [unit, setUnitState] = useState<Unit>("mm")
  const { user, isLoggedIn } = useAuth()

  // Load user preferences when user logs in
  useEffect(() => {
    const loadUserPreferences = async () => {
      if (isLoggedIn && user) {
        try {
          const preferences = await getUserPreferences(user.uid)
          if (preferences?.preferredUnit) {
            setUnitState(preferences.preferredUnit)
          }
        } catch (error) {
          console.error("Error loading user preferences:", error)
        }
      } else {
        // Load from localStorage for non-logged users
        const savedUnit = localStorage.getItem("preferredUnit") as Unit
        if (savedUnit) {
          setUnitState(savedUnit)
        }
      }
    }

    loadUserPreferences()
  }, [isLoggedIn, user])

  const setUnit = async (newUnit: Unit) => {
    setUnitState(newUnit)

    if (isLoggedIn && user) {
      // Save to Firebase for logged users
      try {
        await updateUserPreferences(user.uid, { preferredUnit: newUnit })
      } catch (error) {
        console.error("Error saving unit preference:", error)
      }
    } else {
      // Save to localStorage for non-logged users
      localStorage.setItem("preferredUnit", newUnit)
    }
  }

  const convertDimension = (value: number, fromUnit: Unit): number => {
    if (fromUnit === unit) return value

    if (fromUnit === "mm" && unit === "inches") {
      return value / 25.4
    } else if (fromUnit === "inches" && unit === "mm") {
      return value * 25.4
    }

    return value
  }

  return <UnitContext.Provider value={{ unit, setUnit, convertDimension }}>{children}</UnitContext.Provider>
}

export function useUnit() {
  const context = useContext(UnitContext)
  if (context === undefined) {
    throw new Error("useUnit must be used within a UnitProvider")
  }
  return context
}
