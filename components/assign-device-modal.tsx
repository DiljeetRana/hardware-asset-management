"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useDataStore } from "@/lib/hooks/use-data-store"

interface AssignDeviceModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  device: any
  onAssigned: () => void
}

export function AssignDeviceModal({ open, onOpenChange, device, onAssigned }: AssignDeviceModalProps) {
  const { toast } = useToast()
  const { employees, assignments, assignDevice } = useDataStore()
  const [selectedEmployee, setSelectedEmployee] = useState("")
  const [assignedDate, setAssignedDate] = useState(new Date().toISOString().split("T")[0])
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const availableEmployees = employees.filter((emp) => {
    if (emp.status !== "Active") return false

    const empAssignments = assignments.filter((a) => a.employeeId === emp.id && a.status === "Active")
    const empDeviceTypes = empAssignments.map((a) => {
      const devices = useDataStore.getState?.()?.devices || []
      return devices.find((d) => d.id === a.deviceId)?.deviceType
    })

    if (device.deviceType === "Peripheral") {
      return true
    }

    return !empDeviceTypes.includes(device.deviceType)
  })

  const handleSubmit = () => {
    if (!selectedEmployee) {
      toast({
        title: "Error",
        description: "Please select an employee",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    assignDevice(device.id, selectedEmployee, notes)

    const employee = employees.find((e) => e.id === selectedEmployee)
    toast({
      title: "Device Assigned",
      description: `${device.brand} ${device.modelName} assigned to ${employee?.name}`,
    })

    setIsSubmitting(false)
    setSelectedEmployee("")
    setNotes("")
    onOpenChange(false)
    onAssigned()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle>Assign Device</DialogTitle>
          <DialogDescription className="text-slate-400">
            Assign {device?.brand} {device?.modelName} to an employee
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="employee">Select Employee *</Label>
            <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
              <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white">
                <SelectValue placeholder="Choose employee" />
              </SelectTrigger>
              <SelectContent>
                {availableEmployees.length === 0 ? (
                  <SelectItem value="none" disabled>
                    No available employees
                  </SelectItem>
                ) : (
                  availableEmployees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.name} - {emp.department}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {availableEmployees.length === 0 && (
              <p className="text-xs text-yellow-400">All active employees already have this device type assigned</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignedDate">Assignment Date *</Label>
            <Input
              id="assignedDate"
              type="date"
              value={assignedDate}
              onChange={(e) => setAssignedDate(e.target.value)}
              className="bg-slate-900/50 border-slate-600 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes about this assignment"
              rows={3}
              className="bg-slate-900/50 border-slate-600 text-white"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-slate-600 text-slate-300">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !selectedEmployee}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? "Assigning..." : "Assign Device"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
