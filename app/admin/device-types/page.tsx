"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useDataStore } from "@/lib/hooks/use-data-store"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function DeviceTypesPage() {
  const { deviceTypes, devices, addDeviceType, updateDeviceType, deleteDeviceType, isLoaded } = useDataStore()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: "", description: "" })

  const filteredTypes = deviceTypes.filter((type) => type.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleAdd = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Device type name is required",
        variant: "destructive",
      })
      return
    }

    const newType = {
      id: `DT${Date.now()}`,
      name: formData.name,
      description: formData.description,
      createdAt: new Date().toISOString().split("T")[0],
    }

    addDeviceType(newType)
    toast({
      title: "Device Type Added",
      description: `${formData.name} has been added successfully`,
    })
    setFormData({ name: "", description: "" })
    setIsAddDialogOpen(false)
  }

  const handleEdit = () => {
    if (!selectedType || !formData.name.trim()) return

    updateDeviceType(selectedType, {
      name: formData.name,
      description: formData.description,
    })

    toast({
      title: "Device Type Updated",
      description: "Device type has been updated successfully",
    })
    setFormData({ name: "", description: "" })
    setIsEditDialogOpen(false)
    setSelectedType(null)
  }

  const handleDelete = () => {
    if (!selectedType) return

    try {
      deleteDeviceType(selectedType)
      toast({
        title: "Device Type Deleted",
        description: "Device type has been deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Cannot Delete",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      })
    }

    setIsDeleteDialogOpen(false)
    setSelectedType(null)
  }

  const openEditDialog = (typeId: string) => {
    const type = deviceTypes.find((t) => t.id === typeId)
    if (type) {
      setSelectedType(typeId)
      setFormData({ name: type.name, description: type.description || "" })
      setIsEditDialogOpen(true)
    }
  }

  const openDeleteDialog = (typeId: string) => {
    setSelectedType(typeId)
    setIsDeleteDialogOpen(true)
  }

  const getDeviceCount = (typeName: string) => {
    return devices.filter((d) => d.deviceType === typeName).length
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#005A9C]" />
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#005A9C] mb-2">Device Types</h1>
        <p className="text-slate-600">Manage device type categories</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search device types..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white border-slate-300"
          />
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="anthem-gradient text-white hover:scale-105 transition-all duration-300 shadow-lg">
              <Plus className="h-4 w-4 mr-2" />
              Add Device Type
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-[#005A9C]">Add New Device Type</DialogTitle>
              <DialogDescription>Create a new device type category</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Device Type Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Monitor, Keyboard, Server"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-white border-slate-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of this device type"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="bg-white border-slate-300"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAdd} className="anthem-gradient text-white">
                Add Device Type
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTypes.map((type, index) => (
          <Card
            key={type.id}
            className="glass-card hover:shadow-xl transition-all duration-300 hover:scale-[1.02] animate-slide-up"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <CardHeader>
              <CardTitle className="text-[#005A9C] flex items-start justify-between">
                <span>{type.name}</span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditDialog(type.id)}
                    className="h-8 w-8 p-0 hover:bg-[#005A9C]/10 hover:text-[#005A9C] transition-colors"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openDeleteDialog(type.id)}
                    className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>{type.description || "No description provided"}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">Devices using this type:</span>
                <span className="font-semibold text-[#005A9C] text-lg">{getDeviceCount(type.name)}</span>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredTypes.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-500">
            <p className="text-lg mb-2">No device types found</p>
            <p className="text-sm">{searchTerm ? "Try adjusting your search" : "Add a device type to get started"}</p>
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-[#005A9C]">Edit Device Type</DialogTitle>
            <DialogDescription>Update device type information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Device Type Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-white border-slate-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="bg-white border-slate-300"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false)
                setFormData({ name: "", description: "" })
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleEdit} className="anthem-gradient text-white">
              Update Device Type
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this device type. This action cannot be undone. Devices currently using this
              type will prevent deletion.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
