"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      // Check credentials against local storage or default users
      if (email === "admin@antheminfotech.com" && password === "admin123") {
        localStorage.setItem("userRole", "admin")
        localStorage.setItem("userEmail", email)
        localStorage.setItem("userName", "Admin User")
        toast({
          title: "Welcome back!",
          description: "Logging in as Administrator",
        })
        router.push("/admin/dashboard")
      } else if (email === "employee@antheminfotech.com" && password === "employee123") {
        localStorage.setItem("userRole", "employee")
        localStorage.setItem("userEmail", email)
        localStorage.setItem("userName", "John Doe")
        localStorage.setItem("userId", "EMP001")
        toast({
          title: "Welcome back!",
          description: "Logging in as Employee",
        })
        router.push("/employee/dashboard")
      } else {
        toast({
          title: "Invalid credentials",
          description: "Please check your email and password",
          variant: "destructive",
        })
      }
      setIsLoading(false)
    }, 1000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-[#005A9C] font-medium">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="user@antheminfotech.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border-slate-300 focus:border-[#005A9C] focus:ring-[#005A9C] transition-all duration-300"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password" className="text-[#005A9C] font-medium">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border-slate-300 focus:border-[#005A9C] focus:ring-[#005A9C] transition-all duration-300"
        />
      </div>
      <Button
        type="submit"
        className="w-full anthem-gradient text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
        disabled={isLoading}
      >
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>
      <div
        className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-100 animate-slide-up"
        style={{ animationDelay: "0.2s" }}
      >
        <p className="text-xs text-slate-600 mb-2 font-semibold">Demo Credentials:</p>
        <p className="text-xs text-[#005A9C] font-medium">Admin: admin@antheminfotech.com / admin123</p>
        <p className="text-xs text-[#005A9C] font-medium">Employee: employee@antheminfotech.com / employee123</p>
      </div>
    </form>
  )
}
