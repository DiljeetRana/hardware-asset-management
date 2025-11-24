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
import { useToast } from "@/hooks/use-toast"
import { useDataStore } from "@/lib/hooks/use-data-store"

interface UnassignDeviceModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  device: any
  assignment: any
  onUnassigned: () => void
}

export function UnassignDeviceModal({
  open,
  onOpenChange,
  device,
  assignment,
  onUnassigned,
}: UnassignDeviceModalProps) {
  const { toast } = useToast()
  const { unassignDevice } = useDataStore()
  const [returnDate, setReturnDate] = useState(new Date().toISOString().split("T")[0])
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = () => {
    setIsSubmitting(true)

    unassignDevice(device.id)

    toast({
      title: "Device Unassigned",
      description: `${device.brand} ${device.modelName} has been returned`,
    })

    setIsSubmitting(false)
    setNotes("")
    onOpenChange(false)
    onUnassigned()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle>Unassign Device</DialogTitle>
          <DialogDescription className="text-slate-400">
            Record the return of {device?.brand} {device?.modelName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="returnDate">Return Date *</Label>
            <Input
              id="returnDate"
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="bg-slate-900/50 border-slate-600 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Reason for return or condition of device"
              rows={3}
              className="bg-slate-900/50 border-slate-600 text-white"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-slate-600 text-slate-300">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
            {isSubmitting ? "Processing..." : "Return Device"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
