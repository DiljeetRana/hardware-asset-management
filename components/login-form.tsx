// "use client"

// import type React from "react"
// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { useToast } from "@/hooks/use-toast"

// export function LoginForm() {
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const [isLoading, setIsLoading] = useState(false)

//   const router = useRouter()
//   const { toast } = useToast()
// const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();
//   setIsLoading(true);

//   try {
//     const res = await fetch("/api/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       credentials: "include", // IMPORTANT: send and receive cookies
//       body: JSON.stringify({ email, password }),
//     });

//     const data = await res.json();

//     if (!res.ok) {
//       toast({
//         title: "Login failed",
//         description: data.error || "Invalid credentials",
//         variant: "destructive",
//       });
//       return setIsLoading(false);
//     }

//     toast({
//       title: "Welcome!",
//       description: `Logged in as ${data.role}`,
//     });

//     // Redirect based on role
//     if (data.role === "admin") {
//       router.push("/admin/dashboard");
//     } else {
//       router.push("/employee/dashboard");
//     }

//   } catch (error) {
//     console.log(error);
//     toast({
//       title: "Error",
//       description: "Something went wrong",
//       variant: "destructive",
//     });
//   }

//   setIsLoading(false);
// };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in">
//       <div className="space-y-2">
//         <Label htmlFor="email" className="text-[#005A9C] font-medium">
//           Email
//         </Label>
//         <Input
//           id="email"
//           type="email"
//           placeholder="user@antheminfotech.com"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//           className="border-slate-300 focus:border-[#005A9C] focus:ring-[#005A9C] transition-all duration-300"
//         />
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="password" className="text-[#005A9C] font-medium">
//           Password
//         </Label>
//         <Input
//           id="password"
//           type="password"
//           placeholder="••••••••"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//           minLength={6}
//           className="border-slate-300 focus:border-[#005A9C] focus:ring-[#005A9C] transition-all duration-300"
//         />
//       </div>

//       <Button
//         type="submit"
//         className="w-full anthem-gradient text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
//         disabled={isLoading}
//       >
//         {isLoading ? "Signing in..." : "Sign In"}
//       </Button>

//       {/* DEMO INFO BOX */}
//       <div
//         className="mt-6 p-4 bg-linear-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-100 animate-slide-up"
//         style={{ animationDelay: "0.2s" }}
//       >
//         <p className="text-xs text-slate-600 mb-2 font-semibold">Demo Credentials:</p>
//         <p className="text-xs text-[#005A9C] font-medium">
//           Admin: admin@antheminfotech.com / admin123
//         </p>
//         <p className="text-xs text-[#005A9C] font-medium text-justify">
//           Password Hint : Last 3 characters of your employee code + # + last 4 digits of phone + @ + year of birth  
//           <br />Example: <strong>001#2345@1997</strong>
//         </p>
//       </div>
//     </form>
//   )
// }
















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
  e.preventDefault();
  setIsLoading(true);

  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // IMPORTANT: send and receive cookies
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast({
        title: "Login failed",
        description: data.error || "Invalid credentials",
        variant: "destructive",
      });
      return setIsLoading(false);
    }

    toast({
      title: "Welcome!",
      description: `Logged in as ${data.role}`,
    });

    // Redirect based on role
    if (data.role === "admin") {
      router.push("/admin/dashboard");
    } else {
      router.push("/employee/dashboard");
    }

  } catch (error) {
    console.log(error);
    toast({
      title: "Error",
      description: "Something went wrong",
      variant: "destructive",
    });
  }

  setIsLoading(false);
};

 
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
        className="mt-6 p-4 bg-linear-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-100 animate-slide-up"
        style={{ animationDelay: "0.2s" }}
      >
        <p className="text-xs text-slate-600 mb-2 font-semibold">Demo Credentials:</p>
        <p className="text-xs text-[#005A9C] font-medium">Admin: admin@antheminfotech.com / admin123</p>
        <p className="text-xs text-[#005A9C] font-medium text-justify">Password Hint : Concatenate-Last 3 characters of your employee code | followed by # character | followed by last 4 characters of your primary phone number | followed by @ character | followed by year of your birth. In total 13 characters. i.e 001#2345@1997</p>
      </div>
    </form>
  )
}
