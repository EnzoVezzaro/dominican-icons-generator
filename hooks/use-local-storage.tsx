"use client"

import { useState, useEffect } from "react"

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): {
  items: T
  setItems: (value: T) => void
  addItem: (item: T extends Array<infer U> ? U : never) => void
  removeItem: (predicate: (items: T) => T) => void
} {
  // State to store our value
  const [items, setItems] = useState<T>(initialValue)

  // Load stored value on initial render
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item) {
        setItems(JSON.parse(item))
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
    }
  }, [key])

  // Update local storage when the state changes
  const setValue = (value: T) => {
    try {
      setItems(value)
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }

  // Add an item to the array (if T is an array)
  const addItem = (item: any) => {
    if (Array.isArray(items)) {
      setValue([...items, item] as unknown as T)
    }
  }

  // Remove an item from the array based on a predicate
  const removeItem = (predicate: (items: T) => T) => {
    setValue(predicate(items))
  }

  return { items, setItems: setValue, addItem, removeItem }
}
