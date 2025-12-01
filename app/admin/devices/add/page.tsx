"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ImageUpload } from "@/components/image-upload"
import { useDataStore } from "@/lib/hooks/use-data-store"
interface DeviceTypeWithCount {
  _id: string
  type: string
  totalDevices: number
  description?: string
}





export default function AddDevicePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [deviceTypes, setDeviceTypes] = useState<DeviceTypeWithCount[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    deviceType: "",
    brand: "",
    modelName: "",
    serialNumber: "",
    assetTag: "",
    purchaseDate: "",
    purchaseCost: "",
    vendorName: "",
    warrantyStatus: "Valid",
    warrantyExpiryDate: "",
    status: "Available",
    processor: "",
    ram: "",
    storage: "",
    graphics: "",
    os: "",
    imei: "",
    accessories: "",
    lastServiceDate: "",
    notes: "",
  })

  const [images, setImages] = useState<string[]>([])


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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Generate device ID
      const id = `DEV${String(Date.now()).slice(-6)}`;

      const submitData = {
        id,
        ...formData,
        purchaseCost: Number.parseFloat(formData.purchaseCost) || 0,
        images,
      };

      // Call the actual API
      const response = await fetch("/api/admin/devices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to add device");
      }

      toast({
        title: "Success!",
        description: `${formData.brand} ${formData.modelName} has been added successfully`,
      });

      // Redirect after success
      setTimeout(() => {
        router.push("/admin/devices");
      }, 1500);

    } catch (error) {
      console.error("Error adding device:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add device",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusOptions = ["all", "Available", "Assigned", "Under Repair", "Retired", "Lost"]
  return (
    <div className="p-4 md:p-8 animate-fadeIn">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-6 text-slate-700 hover:text-[#1e4d7b] transition-all duration-300 hover:scale-105"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Devices
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1e4d7b] mb-2">Add New Device</h1>
        <p className="text-slate-600">Register a new hardware asset</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="bg-slate-100 border border-slate-200">
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="specs">Specifications</TabsTrigger>
            <TabsTrigger value="additional">Additional Details</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="animate-fadeIn">
            <Card className="glass-card transition-all duration-300 hover:shadow-xl">
              <CardHeader>
                <CardTitle className="text-[#1e4d7b]">Device Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="deviceType" className="text-slate-700">
                      Device Type *
                    </Label>
                    <Select
                      value={formData.deviceType}
                      onValueChange={(value) => handleSelectChange("deviceType", value)}
                      required
                    >
                      <SelectTrigger className="bg-white border-slate-300 text-slate-900">
                        <SelectValue placeholder="Select device type" />
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
                    <Label htmlFor="brand" className="text-slate-700">
                      Brand *
                    </Label>
                    <Input
                      id="brand"
                      name="brand"
                      value={formData.brand}
                      onChange={handleChange}
                      required
                      placeholder="e.g., Dell, Apple, HP"
                      className="bg-white border-slate-300 text-slate-900"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="modelName" className="text-slate-700">
                      Model Name *
                    </Label>
                    <Input
                      id="modelName"
                      name="modelName"
                      value={formData.modelName}
                      onChange={handleChange}
                      required
                      placeholder="e.g., XPS 15, MacBook Pro"
                      className="bg-white border-slate-300 text-slate-900"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="serialNumber" className="text-slate-700">
                      Serial Number *
                    </Label>
                    <Input
                      id="serialNumber"
                      name="serialNumber"
                      value={formData.serialNumber}
                      onChange={handleChange}
                      required
                      placeholder="Unique serial number"
                      className="bg-white border-slate-300 text-slate-900"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="assetTag" className="text-slate-700">
                      Asset Tag *
                    </Label>
                    <Input
                      id="assetTag"
                      name="assetTag"
                      value={formData.assetTag}
                      onChange={handleChange}
                      required
                      placeholder="e.g., AT-L-001"
                      className="bg-white border-slate-300 text-slate-900"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="purchaseDate" className="text-slate-700">
                      Purchase Date *
                    </Label>
                    <Input
                      id="purchaseDate"
                      name="purchaseDate"
                      type="date"
                      value={formData.purchaseDate}
                      onChange={handleChange}
                      required
                      className="bg-white border-slate-300 text-slate-900"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="purchaseCost" className="text-slate-700">
                      Purchase Cost *
                    </Label>
                    <Input
                      id="purchaseCost"
                      name="purchaseCost"
                      type="number"
                      step="0.01"
                      value={formData.purchaseCost}
                      onChange={handleChange}
                      required
                      placeholder="0.00"
                      className="bg-white border-slate-300 text-slate-900"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vendorName" className="text-slate-700">
                      Vendor Name *
                    </Label>
                    <Input
                      id="vendorName"
                      name="vendorName"
                      value={formData.vendorName}
                      onChange={handleChange}
                      required
                      placeholder="e.g., Dell Direct, Apple Store"
                      className="bg-white border-slate-300 text-slate-900"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="warrantyStatus" className="text-slate-700">
                      Warranty Status *
                    </Label>
                    <Select
                      value={formData.warrantyStatus}
                      onValueChange={(value) => handleSelectChange("warrantyStatus", value)}
                      required
                    >
                      <SelectTrigger className="bg-white border-slate-300 text-slate-900">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Valid">Valid</SelectItem>
                        <SelectItem value="Expired">Expired</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="warrantyExpiryDate" className="text-slate-700">
                      Warranty Expiry Date *
                    </Label>
                    <Input
                      id="warrantyExpiryDate"
                      name="warrantyExpiryDate"
                      type="date"
                      value={formData.warrantyExpiryDate}
                      onChange={handleChange}
                      required
                      className="bg-white border-slate-300 text-slate-900"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-slate-700">
                      Current Status *
                    </Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleSelectChange("status", value)}
                      required
                    >
                      <SelectTrigger className="bg-white border-slate-300 text-slate-900">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>

                        {statusOptions.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status === "all" ? "All Status" : status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="specs" className="animate-fadeIn">
            <Card className="glass-card transition-all duration-300 hover:shadow-xl">
              <CardHeader>
                <CardTitle className="text-[#1e4d7b]">Technical Specifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="processor" className="text-slate-700">
                      Processor
                    </Label>
                    <Input
                      id="processor"
                      name="processor"
                      value={formData.processor}
                      onChange={handleChange}
                      placeholder="e.g., Intel Core i7-13700H"
                      className="bg-white border-slate-300 text-slate-900"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ram" className="text-slate-700">
                      RAM
                    </Label>
                    <Input
                      id="ram"
                      name="ram"
                      value={formData.ram}
                      onChange={handleChange}
                      placeholder="e.g., 16GB DDR5"
                      className="bg-white border-slate-300 text-slate-900"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="storage" className="text-slate-700">
                      Storage
                    </Label>
                    <Input
                      id="storage"
                      name="storage"
                      value={formData.storage}
                      onChange={handleChange}
                      placeholder="e.g., 512GB NVMe SSD"
                      className="bg-white border-slate-300 text-slate-900"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="graphics" className="text-slate-700">
                      Graphics
                    </Label>
                    <Input
                      id="graphics"
                      name="graphics"
                      value={formData.graphics}
                      onChange={handleChange}
                      placeholder="e.g., NVIDIA RTX 4060"
                      className="bg-white border-slate-300 text-slate-900"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="os" className="text-slate-700">
                      Operating System
                    </Label>
                    <Input
                      id="os"
                      name="os"
                      value={formData.os}
                      onChange={handleChange}
                      placeholder="e.g., Windows 11 Pro, macOS"
                      className="bg-white border-slate-300 text-slate-900"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="imei" className="text-slate-700">
                      IMEI (for Mobile/Tablet)
                    </Label>
                    <Input
                      id="imei"
                      name="imei"
                      value={formData.imei}
                      onChange={handleChange}
                      placeholder="15-digit IMEI number"
                      className="bg-white border-slate-300 text-slate-900"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="additional" className="animate-fadeIn">
            <Card className="glass-card transition-all duration-300 hover:shadow-xl">
              <CardHeader>
                <CardTitle className="text-[#1e4d7b]">Additional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="accessories" className="text-slate-700">
                    Accessories Included
                  </Label>
                  <Input
                    id="accessories"
                    name="accessories"
                    value={formData.accessories}
                    onChange={handleChange}
                    placeholder="e.g., Charger, Mouse, Keyboard, Bag"
                    className="bg-white border-slate-300 text-slate-900"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastServiceDate" className="text-slate-700">
                    Last Service Date
                  </Label>
                  <Input
                    id="lastServiceDate"
                    name="lastServiceDate"
                    type="date"
                    value={formData.lastServiceDate}
                    onChange={handleChange}
                    className="bg-white border-slate-300 text-slate-900"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-slate-700">
                    Notes / Remarks
                  </Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Any additional notes or remarks about this device"
                    rows={4}
                    className="bg-white border-slate-300 text-slate-900"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="images" className="animate-fadeIn">
            <Card className="glass-card transition-all duration-300 hover:shadow-xl">
              <CardHeader>
                <CardTitle className="text-[#1e4d7b]">Device Images</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUpload images={images} onImagesChange={setImages} maxImages={5} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-4 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="border-slate-300 text-slate-700 hover:bg-slate-100 transition-all duration-300"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="premium-gradient text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            {isSubmitting ? "Adding Device..." : "Add Device"}
          </Button>
        </div>
      </form>
    </div>
  )
}
