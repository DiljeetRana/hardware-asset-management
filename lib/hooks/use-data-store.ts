"use client"

import { useState, useEffect } from "react"

export interface Device {
  id: string
  deviceType: string
  brand: string
  modelName: string
  serialNumber: string
  assetTag: string
  purchaseDate: string
  purchaseCost: number
  vendorName: string
  warrantyStatus: string
  warrantyExpiryDate: string
  status: string
  processor?: string
  ram?: string
  storage?: string
  graphics?: string
  os?: string
  imei?: string
  accessories?: string
  lastServiceDate?: string
  notes?: string
  images: string[]
  assignedTo?: string
  assignedDate?: string
}

export interface Employee {
  id: string
  name: string
  email: string
  phone: string
  department: string
  designation: string
  hireDate: string
  status: string
}

export interface Assignment {
  id: string
  deviceId: string
  employeeId: string
  assignedDate: string
  returnedDate?: string
  status: "Active" | "Returned"
  notes?: string
}

export interface DeviceType {
  id: string
  name: string
  description?: string
  createdAt: string
}

export function useDataStore() {
  const [devices, setDevices] = useState<Device[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [deviceTypes, setDeviceTypes] = useState<DeviceType[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load data from localStorage
  useEffect(() => {
    const loadedDevices = JSON.parse(localStorage.getItem("devices") || "[]")
    const loadedEmployees = JSON.parse(localStorage.getItem("employees") || "[]")
    const loadedAssignments = JSON.parse(localStorage.getItem("assignments") || "[]")
    const loadedDeviceTypes = JSON.parse(
      localStorage.getItem("deviceTypes") ||
        JSON.stringify([
          { id: "DT001", name: "Laptop", description: "Portable computers", createdAt: "2024-01-01" },
          { id: "DT002", name: "Desktop", description: "Desktop computers", createdAt: "2024-01-01" },
          { id: "DT003", name: "Mobile", description: "Mobile phones and smartphones", createdAt: "2024-01-01" },
          { id: "DT004", name: "Tablet", description: "Tablet devices", createdAt: "2024-01-01" },
          { id: "DT005", name: "Peripheral", description: "Peripherals and accessories", createdAt: "2024-01-01" },
        ]),
    )

    setDevices(loadedDevices)
    setEmployees(loadedEmployees)
    setAssignments(loadedAssignments)
    setDeviceTypes(loadedDeviceTypes)
    setIsLoaded(true)
  }, [])

  // Device operations
  const addDevice = (device: Device) => {
    const updated = [...devices, device]
    setDevices(updated)
    localStorage.setItem("devices", JSON.stringify(updated))
  }

  const updateDevice = (id: string, updates: Partial<Device>) => {
    const updated = devices.map((d) => (d.id === id ? { ...d, ...updates } : d))
    setDevices(updated)
    localStorage.setItem("devices", JSON.stringify(updated))
  }

  const deleteDevice = (id: string) => {
    const updated = devices.filter((d) => d.id !== id)
    setDevices(updated)
    localStorage.setItem("devices", JSON.stringify(updated))
  }

  const getDevice = (id: string) => {
    return devices.find((d) => d.id === id)
  }

  // Employee operations
  const addEmployee = (employee: Employee) => {
    const updated = [...employees, employee]
    setEmployees(updated)
    localStorage.setItem("employees", JSON.stringify(updated))
  }

  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    const updated = employees.map((e) => (e.id === id ? { ...e, ...updates } : e))
    setEmployees(updated)
    localStorage.setItem("employees", JSON.stringify(updated))
  }

  const deleteEmployee = (id: string) => {
    const updated = employees.filter((e) => e.id !== id)
    setEmployees(updated)
    localStorage.setItem("employees", JSON.stringify(updated))
  }

  const getEmployee = (id: string) => {
    return employees.find((e) => e.id === id)
  }

  // Assignment operations
  const assignDevice = (deviceId: string, employeeId: string, notes?: string) => {
    const assignmentId = `ASN${Date.now()}`
    const newAssignment: Assignment = {
      id: assignmentId,
      deviceId,
      employeeId,
      assignedDate: new Date().toISOString().split("T")[0],
      status: "Active",
      notes,
    }

    const updatedAssignments = [...assignments, newAssignment]
    setAssignments(updatedAssignments)
    localStorage.setItem("assignments", JSON.stringify(updatedAssignments))

    // Update device status
    updateDevice(deviceId, {
      status: "Assigned",
      assignedTo: employeeId,
      assignedDate: newAssignment.assignedDate,
    })
  }

  const unassignDevice = (deviceId: string) => {
    const activeAssignment = assignments.find((a) => a.deviceId === deviceId && a.status === "Active")

    if (activeAssignment) {
      const updatedAssignments = assignments.map((a) =>
        a.id === activeAssignment.id
          ? { ...a, status: "Returned" as const, returnedDate: new Date().toISOString().split("T")[0] }
          : a,
      )
      setAssignments(updatedAssignments)
      localStorage.setItem("assignments", JSON.stringify(updatedAssignments))
    }

    // Update device status
    updateDevice(deviceId, {
      status: "Available",
      assignedTo: undefined,
      assignedDate: undefined,
    })
  }

  const getDeviceAssignments = (deviceId: string) => {
    return assignments
      .filter((a) => a.deviceId === deviceId)
      .sort((a, b) => b.assignedDate.localeCompare(a.assignedDate))
  }

  const getEmployeeAssignments = (employeeId: string) => {
    return assignments
      .filter((a) => a.employeeId === employeeId)
      .sort((a, b) => b.assignedDate.localeCompare(a.assignedDate))
  }

  const getActiveAssignments = () => {
    return assignments.filter((a) => a.status === "Active")
  }

  const addDeviceType = (deviceType: DeviceType) => {
    const updated = [...deviceTypes, deviceType]
    setDeviceTypes(updated)
    localStorage.setItem("deviceTypes", JSON.stringify(updated))
  }

  const updateDeviceType = (id: string, updates: Partial<DeviceType>) => {
    const updated = deviceTypes.map((dt) => (dt.id === id ? { ...dt, ...updates } : dt))
    setDeviceTypes(updated)
    localStorage.setItem("deviceTypes", JSON.stringify(updated))
  }

  const deleteDeviceType = (id: string) => {
    // Check if any devices are using this type
    const devicesUsingType = devices.filter((d) => d.deviceType === deviceTypes.find((dt) => dt.id === id)?.name)
    if (devicesUsingType.length > 0) {
      throw new Error(`Cannot delete device type. ${devicesUsingType.length} device(s) are using this type.`)
    }
    const updated = deviceTypes.filter((dt) => dt.id !== id)
    setDeviceTypes(updated)
    localStorage.setItem("deviceTypes", JSON.stringify(updated))
  }

  const getDeviceType = (id: string) => {
    return deviceTypes.find((dt) => dt.id === id)
  }

  return {
    devices,
    employees,
    assignments,
    deviceTypes,
    isLoaded,
    addDevice,
    updateDevice,
    deleteDevice,
    getDevice,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee,
    assignDevice,
    unassignDevice,
    getDeviceAssignments,
    getEmployeeAssignments,
    getActiveAssignments,
    addDeviceType,
    updateDeviceType,
    deleteDeviceType,
    getDeviceType,
  }
}
