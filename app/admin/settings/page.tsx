"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Trash2, RefreshCw } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function SettingsPage() {
  const { toast } = useToast()

  const handleResetData = () => {
    localStorage.removeItem("dataInitialized")
    localStorage.removeItem("devices")
    localStorage.removeItem("employees")
    localStorage.removeItem("assignments")

    toast({
      title: "Data Reset",
      description: "All data has been reset. Please refresh the page.",
    })

    setTimeout(() => {
      window.location.reload()
    }, 1500)
  }

  const handleClearAll = () => {
    localStorage.clear()
    toast({
      title: "All Data Cleared",
      description: "Redirecting to login...",
    })

    setTimeout(() => {
      window.location.href = "/login"
    }, 1500)
  }

  return (
    <div className="p-4 md:p-8 animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1e4d7b] mb-2">Settings</h1>
        <p className="text-slate-600">Manage system configuration and data</p>
      </div>

      <div className="max-w-2xl space-y-6">
        <Card className="glass-card transition-all duration-300 hover:shadow-xl">
          <CardHeader>
            <CardTitle className="text-[#1e4d7b]">Data Management</CardTitle>
            <CardDescription className="text-slate-600">Reset or clear application data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 transition-all duration-300 hover:shadow-md">
              <div>
                <p className="text-slate-900 font-medium">Reset to Demo Data</p>
                <p className="text-sm text-slate-600">Restore default devices and employees</p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition-all duration-300 hover:scale-105"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-white border-slate-200">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-[#1e4d7b]">Reset to Demo Data?</AlertDialogTitle>
                    <AlertDialogDescription className="text-slate-600">
                      This will restore all default demo data. Any changes you made will be lost.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-white text-slate-700 border-slate-300 hover:bg-slate-50">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleResetData}
                      className="premium-gradient text-white hover:scale-105 transition-all duration-300"
                    >
                      Reset Data
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200 transition-all duration-300 hover:shadow-md">
              <div>
                <p className="text-slate-900 font-medium">Clear All Data</p>
                <p className="text-sm text-slate-600">Remove all data and logout</p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-red-300 text-red-600 hover:bg-red-100 bg-white transition-all duration-300 hover:scale-105"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-white border-slate-200">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-[#1e4d7b]">Clear All Data?</AlertDialogTitle>
                    <AlertDialogDescription className="text-slate-600">
                      This will permanently delete all data and log you out. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-white text-slate-700 border-slate-300 hover:bg-slate-50">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleClearAll}
                      className="bg-red-600 hover:bg-red-700 text-white hover:scale-105 transition-all duration-300"
                    >
                      Clear All Data
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card transition-all duration-300 hover:shadow-xl">
          <CardHeader>
            <CardTitle className="text-[#1e4d7b]">System Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Version:</span>
              <span className="text-slate-900 font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Storage:</span>
              <span className="text-slate-900 font-medium">Local Storage</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
