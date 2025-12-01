"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import type { Device } from "@/lib/hooks/use-data-store"

interface EditDeviceModalProps {
  device: Device
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: (id: string, updates: Partial<Device>) => void
}
interface DeviceTypeWithCount {
  _id: string
  type: string
  totalDevices: number
  description?: string
}

export function EditDeviceModal({ device, open, onOpenChange, onUpdate }: EditDeviceModalProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState(device)
    const [deviceTypes, setDeviceTypes] = useState<DeviceTypeWithCount[]>([])

  // useEffect(() => {
  //   setFormData(device)
   
  // }, [device])
useEffect(() => {
    if (open && device) {
      console.log("🔍 Initializing formData with device:", device)
      
      const initialFormData = {
        name: device.name || '',
        brand: device.brand || '',
        modelName: device.modelName || '',
        serialNumber: device.serialNumber || '',
        assetTag: device.assetTag || '',
        status: device.status || 'Available',
        purchaseCost: device.purchaseCost || 0,
        purchaseDate: device.purchaseDate ? 
          new Date(device.purchaseDate).toISOString().split('T')[0] : '',
        warrantyExpiryDate: device.warrantyExpiryDate ? 
          new Date(device.warrantyExpiryDate).toISOString().split('T')[0] : '',
        vendorName: device.vendorName || '',
        processor: device.processor || '',
        ram: device.ram || '',
        storage: device.storage || '',
        os: device.os || '',
        notes: device.notes || '',
        // ✅ FIXED: Store BOTH ID and NAME
        resourceTypeId: device.resourceType?._id || '',
        resourceTypeName: device.resourceType?.name || 'Unknown'  //
      }

      console.log("✅ formData initialized with ResourceType:", initialFormData)
      setFormData(initialFormData)
    }
  }, [device, open])

   const fetchDeviceTypes = async () => {
      try {
        const res = await fetch("/api/admin/resource-type")
        if (!res.ok) throw new Error("Failed to fetch device types")
        const data: DeviceTypeWithCount[] = await res.json()
  
        console.log("Fetched device types:", data);
        setDeviceTypes(data)
      } catch (error) {
        console.error(error)
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Something went wrong",
          variant: "destructive",
        })
      }
    }
  
    // Fetch device types with counts
    useEffect(() => {
      fetchDeviceTypes()
    }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdate(device.id, {
      ...formData,
      purchaseCost: Number.parseFloat(String(formData.purchaseCost)) || 0,
    })
    toast({
      title: "Device Updated",
      description: `${formData.brand} ${formData.modelName} has been updated successfully`,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white">Edit Device</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="bg-slate-900 border-slate-700">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="specs">Specifications</TabsTrigger>
              <TabsTrigger value="additional">Additional</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-deviceType" className="text-slate-200">
                    Device Type
                  </Label>
                  <Select 
              value={formData.resourceTypeId || ''} 
              onValueChange={(value) => handleSelectChange("resourceTypeId", value)}
            >
                    <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {deviceTypes.map((type) => (
                                               // ✅ FIXED: Use type._id instead of type.type
                                               <SelectItem key={type._id} value={type._id}>
                                                 {type.type}
                                               </SelectItem>
                                             ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-brand" className="text-slate-200">
                    Brand
                  </Label>
                  <Input
                    id="edit-brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    className="bg-slate-900/50 border-slate-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-modelName" className="text-slate-200">
                    Model Name
                  </Label>
                  <Input
                    id="edit-modelName"
                    name="modelName"
                    value={formData.modelName}
                    onChange={handleChange}
                    className="bg-slate-900/50 border-slate-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-serialNumber" className="text-slate-200">
                    Serial Number
                  </Label>
                  <Input
                    id="edit-serialNumber"
                    name="serialNumber"
                    value={formData.serialNumber}
                    onChange={handleChange}
                    className="bg-slate-900/50 border-slate-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-assetTag" className="text-slate-200">
                    Asset Tag
                  </Label>
                  <Input
                    id="edit-assetTag"
                    name="assetTag"
                    value={formData.assetTag}
                    onChange={handleChange}
                    className="bg-slate-900/50 border-slate-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-status" className="text-slate-200">
                    Status
                  </Label>
                  <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                    <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="Assigned">Assigned</SelectItem>
                      <SelectItem value="Under Repair">Under Repair</SelectItem>
                      <SelectItem value="Retired">Retired</SelectItem>
                      <SelectItem value="Lost">Lost</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-purchaseCost" className="text-slate-200">
                    Purchase Cost
                  </Label>
                  <Input
                    id="edit-purchaseCost"
                    name="purchaseCost"
                    type="number"
                    step="0.01"
                    value={formData.purchaseCost}
                    onChange={handleChange}
                    className="bg-slate-900/50 border-slate-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-vendorName" className="text-slate-200">
                    Vendor Name
                  </Label>
                  <Input
                    id="edit-vendorName"
                    name="vendorName"
                    value={formData.vendorName}
                    onChange={handleChange}
                    className="bg-slate-900/50 border-slate-600 text-white"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="specs" className="space-y-4 mt-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-processor" className="text-slate-200">
                    Processor
                  </Label>
                  <Input
                    id="edit-processor"
                    name="processor"
                    value={formData.processor || ""}
                    onChange={handleChange}
                    className="bg-slate-900/50 border-slate-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-ram" className="text-slate-200">
                    RAM
                  </Label>
                  <Input
                    id="edit-ram"
                    name="ram"
                    value={formData.ram || ""}
                    onChange={handleChange}
                    className="bg-slate-900/50 border-slate-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-storage" className="text-slate-200">
                    Storage
                  </Label>
                  <Input
                    id="edit-storage"
                    name="storage"
                    value={formData.storage || ""}
                    onChange={handleChange}
                    className="bg-slate-900/50 border-slate-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-os" className="text-slate-200">
                    Operating System
                  </Label>
                  <Input
                    id="edit-os"
                    name="os"
                    value={formData.os || ""}
                    onChange={handleChange}
                    className="bg-slate-900/50 border-slate-600 text-white"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="additional" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="edit-notes" className="text-slate-200">
                  Notes
                </Label>
                <Textarea
                  id="edit-notes"
                  name="notes"
                  value={formData.notes || ""}
                  onChange={handleChange}
                  rows={4}
                  className="bg-slate-900/50 border-slate-600 text-white"
                />
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
