"use client"

import { useState, useEffect } from "react"
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
  const [returnDate, setReturnDate] = useState(new Date().toISOString().split("T")[0])
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)


  useEffect(() => {
  console.log("ASSIGNMENT PASSED TO MODAL --->", assignment);
}, [assignment]);


  useEffect(()=>{
    console.log("DEVICE PASSED TO MODAL --->", device);

  },[]);

  if (!assignment) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <p className="text-red-400">No assignment found for this device.</p>
        </DialogContent>
      </Dialog>
    );
  }
  
  const handleSubmit = async () => {
    setIsSubmitting(true);
 console.log("ID SENT:", `"${assignment.id}"`);
    try {
      const res = await fetch(
        `/api/admin/allocation/${assignment.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            returnDate,
            notes,
            status: "Returned"
          })
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to unassign device");
      }

      toast({
        title: "Device Returned",
        description: `${device.brand} ${device.modelName} has been returned`,
      });

      onUnassigned();
      onOpenChange(false);
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
