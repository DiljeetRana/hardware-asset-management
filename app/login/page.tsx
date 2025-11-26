"use client"

import { LoginForm } from "@/components/login-form"
import { useEffect, useRef } from "react"
import { useAuth } from "@/context/authcontext";
import { useRouter } from "next/navigation";
import Link from "next/link"

export default function LoginPage() {
    const { isAuthenticated, role, loading } = useAuth();
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!loading && isAuthenticated) {
      // If admin, go to admin dashboard
      if (role === "admin") router.push("/admin/dashboard");
      else router.push("/"); // normal user home
    }
  }, [loading, isAuthenticated, role, router]);

  if (loading) return <p>Loading...</p>;
  if (isAuthenticated) return null; // prevents flicker


  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Particle class
    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      opacity: number
      color: string

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 3 + 1
        this.speedX = Math.random() * 0.5 - 0.25
        this.speedY = Math.random() * 0.5 - 0.25
        this.opacity = Math.random() * 0.5 + 0.2
        // Use Anthem InfoTech colors
        const colors = ["#005A9C", "#3B82F6", "#60A5FA", "#93C5FD"]
        this.color = colors[Math.floor(Math.random() * colors.length)]
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        // Wrap around edges
        if (this.x > canvas.width) this.x = 0
        if (this.x < 0) this.x = canvas.width
        if (this.y > canvas.height) this.y = 0
        if (this.y < 0) this.y = canvas.height
      }

      draw() {
        if (!ctx) return
        ctx.fillStyle = this.color
        ctx.globalAlpha = this.opacity
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = 1
      }
    }

    // Create particles
    const particles: Particle[] = []
    const particleCount = 80

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    // Animation loop
    function animate() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        particle.update()
        particle.draw()
      })

      // Draw connections between nearby particles
      particles.forEach((particleA, indexA) => {
        particles.slice(indexA + 1).forEach((particleB) => {
          const dx = particleA.x - particleB.x
          const dy = particleA.y - particleB.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 120) {
            ctx.strokeStyle = "#005A9C"
            ctx.globalAlpha = (1 - distance / 120) * 0.15
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(particleA.x, particleA.y)
            ctx.lineTo(particleB.x, particleB.y)
            ctx.stroke()
            ctx.globalAlpha = 1
          }
        })
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-slate-50 relative overflow-hidden">
      {/* Animated particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Animated background circles */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-[#005A9C]/5 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute bottom-20 right-20 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      <div className="w-full max-w-md p-8 relative z-10 animate-scale-in">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 border-2 border-slate-200/60">
          <Link href="/" className="flex justify-center mb-6 group">
            <div className="relative">
              <div className="absolute inset-0 anthem-gradient rounded-2xl blur-lg opacity-30 animate-pulse" />
              <div className="relative p-4 anthem-gradient rounded-2xl shadow-xl transform group-hover:scale-110 transition-transform duration-300">
                <img
                  src="/images/final-20logo-2024-century-20gothic.png"
                  alt="Anthem InfoTech"
                  className="h-12 w-auto"
                />
              </div>
            </div>
          </Link>

          <h1 className="text-2xl font-bold text-[#005A9C] text-center mb-2">Hardware Asset Management</h1>
          <p className="text-slate-600 text-center mb-8 text-sm">Sign in to access your dashboard</p>

          <LoginForm />

          <div className="mt-6 text-center text-xs text-slate-500">Trust Commitment and Delivery</div>
        </div>
      </div>
    </div>
  )
}
