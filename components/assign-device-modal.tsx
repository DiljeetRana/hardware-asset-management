"use client"

import { useState,useEffect,useCallback } from "react"
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

interface AssignDeviceModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  device: any
  onAssigned: () => void
}
export interface Employee {
  id: string
  name: string
  email: string
  phone: string
  employeeCode: string
  dob: string
  department: string
  position: string
   hireDate: string
  status: string
}
interface Assignment {
   id: string               // corresponds to _id
  employeeId: string       // corresponds to employee (ensure API returns this)
  resourceId: string       // corresponds to resource — name changed for clarity
  assignedDate: string     // corresponds to AllocatedDate
  returnDate?: string      // corresponds to returnDate (if present)
  status: string  

}

interface Device {
  id: string
  _id: string
  name: string
  brand: string
  modelName: string
  serialNumber: string
  assetTag: string
  status: string
  purchaseCost: number
  purchaseDate: string
  warrantyStatus?: string
  warrantyExpiryDate: string
  availableResourceCount: number
  totalResourceCount: number
  resourceType: {
    _id: string
    name: string
  }
  images: any[]
  createdAt: string
  updatedAt: string
}
export function AssignDeviceModal({ open, onOpenChange, device, onAssigned }: AssignDeviceModalProps) {
  const { toast } = useToast()
     const [employees, setEmployees] = useState<Employee[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [allDevices, setAllDevices] = useState<Device[]>([]) 
  const [selectedEmployee, setSelectedEmployee] = useState("")
  const [assignedDate, setAssignedDate] = useState(new Date().toISOString().split("T")[0])
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  
  const fetchEmployees = async () => {
    try {
      const res = await fetch("/api/admin/employee")
      if (!res.ok) throw new Error("Failed to fetch employees")
      
      const data = await res.json() // raw backend array
      console.log("Fetched employees:", data);
  
      // Map _id to id for frontend usage
      const mappedEmployees = data.map((emp: any) => ({
        ...emp,
        id: emp._id,  // <-- important fix
      }))
  
      setEmployees(mappedEmployees)
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      })
    }
  }
  


// Fetch assignments
const fetchAssignments = useCallback(async () => {
  if (!device?._id) {
    setAssignments([]);
    return;
  }
  try {
    const res = await fetch(`/api/admin/allocation?resourceId=${device._id}`);
    if (!res.ok) throw new Error("Failed to fetch assignments");
    const data = await res.json();
    // assume data.allocations is array
    const mapped: Assignment[] = data.allocations.map((a: any) => ({
    id: a._id,
  employeeId: a.employee._id,
  resourceId: a.resource._id,            // because schema uses `resource`
  assignedDate: a.AllocatedDate,
  returnDate: a.returnDate ?? undefined,
  status: a.status,
    }));
    setAssignments(mapped);
    console.log("mapped assignments:",mapped);
  } catch (error) {
    console.error("Error fetching assignments:", error);
    setAssignments([]);
  }
}, [device?._id]);

  const fetchDevices = async () => {
    try {
      const res = await fetch("/api/admin/devices")
      if (!res.ok) throw new Error("Failed to fetch devices")
      const data = await res.json()
      setAllDevices(data.devices || [])
    } catch (error) {
      console.error("Error loading devices:", error)
    }
  }

  const handleSubmit = async () => {
  if (!selectedEmployee) {
    toast({
      title: "Error",
      description: "Please select an employee",
      variant: "destructive",
    });
    return;
  }

  setIsSubmitting(true);

  try {
    const res = await fetch("/api/admin/allocation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        resourceId: device._id,
        employeeId: selectedEmployee,
        assignedDate,
        notes,
      }),
    });

    const data = await res.json();
    console.log("device allocated:",data);
    if (!res.ok) throw new Error(data.error || "Failed to assign device");

    // Use populated employee name from backend
    const employeeName = data.allocation?.employee?.name || "Employee";

    toast({
      title: "Device Assigned",
      description: `${device.brand} ${device.modelName} assigned to ${employeeName}`,
    });

    onAssigned();           // notify parent to refresh assignments
    onOpenChange(false);    // close modal
    setSelectedEmployee("");
    setNotes("");
  } catch (error) {
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Something went wrong",
      variant: "destructive",
    });
  } finally {
    setIsSubmitting(false);
  }
};



 useEffect(() => {
    fetchEmployees()
    fetchAssignments()
    fetchDevices()
  }, [])


const availableEmployees = employees.filter(emp => {
    if (emp.status !== "Active") return false

    // find active assignments of this employee
    const empAssigns = assignments.filter(a => a.employeeId === emp.id && a.status === "Allocated")

    // gather device types already assigned to this employee
    const assignedTypes = empAssigns.map(a => {
      const dev = allDevices.find(d => d._id === a.resourceId)
      return dev?.resourceType?.name
    }).filter(Boolean)

    // if device is peripheral, allow anyway (or follow your business rule)
    if (device.resourceType?.name === "Peripheral") {
      return true
    }

    // if employee already has same device type assigned — exclude
    return !assignedTypes.includes(device.resourceType?.name)
  })


 
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
