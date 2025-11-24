"use client"

import { useEffect } from "react"
import { initializeDummyData } from "@/lib/init-data"

export function DataInitializer() {
  useEffect(() => {
    initializeDummyData()
  }, [])

  return null
}
