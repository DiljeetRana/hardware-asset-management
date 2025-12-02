"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Laptop, Monitor, Smartphone, Tablet, Package, Calendar, Shield, Building } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function EmployeeDeviceDetailPage() {
  const router = useRouter()
  const [device, setDevice] = useState<any>(null)
  const [assignment, setAssignment] = useState<any>(null)
  const params = useParams()
  const deviceId = params.id;

useEffect(() => {
  if (!deviceId) return; // safeguard
  console.log("employee/device/id:", deviceId);
  loadDevice();
}, [deviceId]); // use deviceId here

const loadDevice = async () => {
  if (!deviceId) return;

  try {
    //  Fetch device details
    const deviceRes = await fetch(`/api/admin/devices/${deviceId}`);
    const deviceData = await deviceRes.json();
console.log("Raw device response:", deviceData);
    //  Fetch current user profile
    const profileRes = await fetch("/api/profile", { credentials: "include" });
    const profile = await profileRes.json();
    if (!profile.id) return;
    const employeeId = profile.id;

    //  Fetch allocations for this employee
    const assignmentRes = await fetch(`/api/employee/allocation/${employeeId}`);
    const assignmentData = await assignmentRes.json();

    //  Find assignment corresponding to this device
    const myAssignment = assignmentData.data.find(
      (a: any) => a.resource._id === deviceId
    );

    //  Set state
    setDevice(deviceData.device);
    setAssignment(myAssignment);

    //  Log after setting state
    console.log("Device data:", deviceData.data);
    console.log("Assignment data for this device:", myAssignment);

  } catch (error) {
    console.error("Error loading device:", error);
  }
};

//  const loadDevice = async () => {
//   if (!deviceId) return;

//   try {
//     //  Fetch device details
//     const deviceRes = await fetch(`/api/admin/devices/${deviceId}`);
//     const deviceData = await deviceRes.json();

//     // Fetch assignment details for current user + this device
   
//       const profileRes = await fetch("/api/profile", { credentials: "include" });
//       const profile = await profileRes.json();

//       if (!profile.id) return;

//       const employeeId = profile.id;
//     const assignmentRes = await fetch(`/api/employee/allocation/${employeeId}`);
//     const assignmentData = await assignmentRes.json();
//      console.log("assignment data is :",assignmentData);
//     // find assignment of this device
//     const myAssignment = assignmentData.data.find((a: any) => a.resource._id === deviceId);
//     console.log("devicedata:",device);
//     setDevice(deviceData.data);        // set device
//     setAssignment(myAssignment);       // set assignment
//   } catch (error) {
//     console.error("Error loading device:", error);
//   }
// };

  if (!device) {
    return (
      <div className="p-8">
        <p className="text-slate-400">Loading...</p>
      </div>
    )
  }

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "Laptop":
        return Laptop
      case "Desktop":
        return Monitor
      case "Mobile":
        return Smartphone
      case "Tablet":
        return Tablet
      default:
        return Package
    }
  }

  const Icon = getDeviceIcon(device.deviceType)

  return (
    <div className="p-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6 text-slate-400 hover:text-white">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to My Devices
      </Button>

      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-16 w-16 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <Icon className="h-8 w-8 text-blue-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">
              {device.brand} {device.modelName}
            </h1>
            <p className="text-slate-400">{device.deviceType}</p>
          </div>
        </div>

        {assignment && (
          <Card className="bg-blue-500/10 border-blue-500/30">
            <CardContent className="py-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-400" />
                <span className="text-blue-400 text-sm">Assigned to you on</span>
                <span className="text-white font-medium">
                  {new Date(assignment.assignedDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              {assignment.notes && <p className="text-slate-300 text-sm mt-2 pl-6">{assignment.notes}</p>}
            </CardContent>
          </Card>
        )}
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="specs">Specifications</TabsTrigger>
          <TabsTrigger value="warranty">Warranty & Support</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-500" />
                  Device Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Asset Tag:</span>
                  <span className="text-white font-mono">{device.assetTag}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Serial Number:</span>
                  <span className="text-white font-mono text-sm">{device.serialNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Brand:</span>
                  <span className="text-white">{device.brand}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Model:</span>
                  <span className="text-white">{device.modelName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Type:</span>
                  <span className="text-white">{device.deviceType}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Building className="h-5 w-5 text-green-500" />
                  Purchase Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Purchase Date:</span>
                  <span className="text-white">{new Date(device.purchaseDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Vendor:</span>
                  <span className="text-white">{device.vendorName}</span>
                </div>
                {device.purchaseCost && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Value:</span>
                    <span className="text-white">${device.purchaseCost.toFixed(2)}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {device.notes && (
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Additional Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">{device.notes}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="specs">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Technical Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              {!device.processor && !device.ram && !device.storage && !device.os ? (
                <p className="text-slate-400 text-center py-8">No technical specifications available</p>
              ) : (
                <div className="grid gap-6 md:grid-cols-2">
                  {device.processor && (
                    <div className="space-y-2">
                      <span className="text-slate-400 text-sm font-medium">Processor</span>
                      <p className="text-white text-lg">{device.processor}</p>
                    </div>
                  )}
                  {device.ram && (
                    <div className="space-y-2">
                      <span className="text-slate-400 text-sm font-medium">Memory (RAM)</span>
                      <p className="text-white text-lg">{device.ram}</p>
                    </div>
                  )}
                  {device.storage && (
                    <div className="space-y-2">
                      <span className="text-slate-400 text-sm font-medium">Storage</span>
                      <p className="text-white text-lg">{device.storage}</p>
                    </div>
                  )}
                  {device.graphics && (
                    <div className="space-y-2">
                      <span className="text-slate-400 text-sm font-medium">Graphics</span>
                      <p className="text-white text-lg">{device.graphics}</p>
                    </div>
                  )}
                  {device.os && (
                    <div className="space-y-2">
                      <span className="text-slate-400 text-sm font-medium">Operating System</span>
                      <p className="text-white text-lg">{device.os}</p>
                    </div>
                  )}
                  {device.imei && (
                    <div className="space-y-2">
                      <span className="text-slate-400 text-sm font-medium">IMEI Number</span>
                      <p className="text-white text-lg font-mono">{device.imei}</p>
                    </div>
                  )}
                  {device.accessories && (
                    <div className="space-y-2 md:col-span-2">
                      <span className="text-slate-400 text-sm font-medium">Included Accessories</span>
                      <p className="text-white text-lg">{device.accessories}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="warranty">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="h-5 w-5 text-purple-500" />
                  Warranty Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                  <div>
                    <p className="text-slate-400 text-sm mb-1">Status</p>
                    <p
                      className={`text-lg font-semibold ${
                        device.warrantyStatus === "Valid" ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {device.warrantyStatus || "Unknown"}
                    </p>
                  </div>
                  {device.warrantyStatus === "Valid" && (
                    <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Shield className="h-6 w-6 text-green-500" />
                    </div>
                  )}
                </div>

                {device.warrantyExpiryDate && (
                  <div>
                    <span className="text-slate-400 text-sm">Warranty Expires On</span>
                    <p className="text-white text-lg mt-1">
                      {new Date(device.warrantyExpiryDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Support Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                  <p className="text-sm text-slate-300 mb-2">For technical support or device issues, please contact:</p>
                  <p className="text-blue-400 font-medium">IT Support Team</p>
                  <p className="text-slate-400 text-sm mt-1">support@antheminfotech.com</p>
                </div>

                {device.lastServiceDate && (
                  <div>
                    <span className="text-slate-400 text-sm">Last Service Date</span>
                    <p className="text-white mt-1">{new Date(device.lastServiceDate).toLocaleDateString()}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
