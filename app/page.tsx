"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Laptop, Users, Clock, CheckCircle, TrendingUp, Play, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [showDemo, setShowDemo] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-blue-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3 animate-fade-in">
              <Image
                src="/images/final-20logo-2024-century-20gothic.png"
                alt="Anthem InfoTech"
                width={200}
                height={50}
                className="h-12 w-auto hover:scale-105 transition-transform duration-300 cursor-pointer"
              />
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="text-[#005A9C] hover:text-[#004080] hover:bg-blue-50 transition-all duration-300"
                >
                  Login
                </Button>
              </Link>
              <Link href="/login">
                <Button className="bg-gradient-to-r from-[#005A9C] to-[#0077CC] hover:from-[#004080] hover:to-[#005A9C] text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Parallax */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
        {/* Parallax Background Elements */}
        <div className="absolute inset-0 opacity-20" style={{ transform: `translateY(${scrollY * 0.5}px)` }}>
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#005A9C] rounded-full filter blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-40 right-20 w-20 h-20 border-4 border-[#005A9C]/20 rounded-lg animate-spin-slow"></div>
          <div className="absolute bottom-40 left-40 w-16 h-16 bg-blue-400/10 rotate-45 animate-bounce-slow"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div
              className={`space-y-8 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              <div className="inline-block">
                <span className="bg-gradient-to-r from-[#005A9C] to-[#0077CC] text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg animate-fade-in">
                  Hardware Asset Management Solution
                </span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Manage Your
                <span className="block bg-gradient-to-r from-[#005A9C] to-[#0077CC] bg-clip-text text-transparent animate-gradient">
                  IT Assets
                </span>
                Effortlessly
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed">
                Track devices, manage employees, and monitor assignments with our comprehensive hardware asset
                management system. Built on trust, commitment, and delivery.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/login">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-[#005A9C] to-[#0077CC] hover:from-[#004080] hover:to-[#005A9C] text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 text-lg px-8 py-6"
                  >
                    Start Managing Assets
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setShowDemo(true)}
                  className="border-2 border-[#005A9C] text-[#005A9C] hover:bg-blue-50 transition-all duration-300 hover:scale-105 text-lg px-8 py-6 bg-transparent group"
                >
                  <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Watch Demo
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-blue-100">
                <div className="text-center transform hover:scale-110 transition-transform duration-300">
                  <div className="text-3xl font-bold text-[#005A9C] animate-count-up">500+</div>
                  <div className="text-sm text-gray-600">Devices Tracked</div>
                </div>
                <div className="text-center transform hover:scale-110 transition-transform duration-300">
                  <div className="text-3xl font-bold text-[#005A9C] animate-count-up">99.9%</div>
                  <div className="text-sm text-gray-600">Uptime</div>
                </div>
                <div className="text-center transform hover:scale-110 transition-transform duration-300">
                  <div className="text-3xl font-bold text-[#005A9C] animate-count-up">24/7</div>
                  <div className="text-sm text-gray-600">Support</div>
                </div>
              </div>
            </div>

            {/* Hero Image with Parallax */}
            <div
              className={`relative transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}
              style={{ transform: `translateY(${scrollY * -0.2}px)` }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#005A9C]/20 to-blue-400/20 rounded-3xl transform rotate-3 animate-pulse"></div>
                <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-blue-100 hover:shadow-3xl transition-shadow duration-500">
                  <Image
                    src="/images/logo-silver-ring.png"
                    alt="Anthem InfoTech Logo"
                    width={400}
                    height={400}
                    className="w-full h-auto animate-float"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm relative"
        style={{ transform: `translateY(${scrollY * 0.1}px)` }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage your hardware assets efficiently
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Laptop,
                title: "Device Management",
                description:
                  "Track all your hardware assets with detailed specifications and real-time status updates.",
                color: "from-blue-500 to-blue-600",
              },
              {
                icon: Users,
                title: "Employee Tracking",
                description: "Manage employee information and their assigned devices in one centralized system.",
                color: "from-[#005A9C] to-[#0077CC]",
              },
              {
                icon: Clock,
                title: "Assignment History",
                description: "Complete audit trail of all device assignments with timestamps and detailed logs.",
                color: "from-blue-600 to-blue-700",
              },
              {
                icon: Shield,
                title: "Secure & Reliable",
                description: "Enterprise-grade security with role-based access control and data encryption.",
                color: "from-[#004080] to-[#005A9C]",
              },
              {
                icon: TrendingUp,
                title: "Analytics Dashboard",
                description: "Comprehensive insights and reports on asset utilization and inventory status.",
                color: "from-blue-500 to-[#005A9C]",
              },
              {
                icon: CheckCircle,
                title: "Easy Integration",
                description: "Seamlessly integrate with your existing systems and workflows.",
                color: "from-[#0077CC] to-blue-500",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-lg border border-blue-100 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:border-[#005A9C]/50 cursor-pointer"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: isVisible ? "slide-up 0.6s ease-out forwards" : "none",
                }}
              >
                <div
                  className={`inline-block p-3 rounded-xl bg-gradient-to-br ${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#005A9C] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative" style={{ transform: `translateY(${scrollY * 0.05}px)` }}>
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-[#005A9C] to-[#0077CC] rounded-3xl shadow-2xl p-12 sm:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full filter blur-3xl animate-pulse"></div>
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full filter blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative z-10">
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">Ready to Get Started?</h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Join organizations worldwide in streamlining their hardware asset management
              </p>
              <Link href="/login">
                <Button
                  size="lg"
                  className="bg-white text-[#005A9C] hover:bg-blue-50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 text-lg px-8 py-6"
                >
                  Access Portal Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Modal */}
      {showDemo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-4xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
            <button
              onClick={() => setShowDemo(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-white/90 rounded-full hover:bg-white transition-all duration-300 hover:scale-110"
            >
              <X className="h-6 w-6 text-[#005A9C]" />
            </button>
            <div className="p-8">
              <h3 className="text-3xl font-bold text-[#005A9C] mb-4">System Demo</h3>
              <p className="text-gray-600 mb-6">
                Watch how Anthem InfoTech Hardware Asset Management System streamlines your IT operations
              </p>
              <div className="aspect-video bg-gradient-to-br from-[#005A9C]/10 to-blue-100 rounded-xl flex items-center justify-center border-2 border-[#005A9C]/20">
                <div className="text-center space-y-4">
                  <div className="inline-block p-6 bg-white rounded-full shadow-xl">
                    <Play className="h-16 w-16 text-[#005A9C] animate-pulse" />
                  </div>
                  <p className="text-[#005A9C] font-semibold text-lg">Demo Video Coming Soon</p>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Experience our comprehensive hardware asset management features with device tracking, employee
                    management, and detailed analytics
                  </p>
                  <Link href="/login">
                    <Button
                      onClick={() => setShowDemo(false)}
                      className="bg-gradient-to-r from-[#005A9C] to-[#0077CC] hover:from-[#004080] hover:to-[#005A9C] text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 mt-4"
                    >
                      Try It Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-blue-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <Image
                src="/images/logo-silver-ring.png"
                alt="Anthem InfoTech"
                width={48}
                height={48}
                className="h-12 w-12"
              />
              <div>
                <div className="font-bold text-[#005A9C]">Anthem InfoTech</div>
                <div className="text-sm text-gray-600">Trust, Commitment, and Delivery</div>
              </div>
            </div>
            <div className="text-gray-600 text-sm">© 2025 Anthem InfoTech. All rights reserved.</div>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0) rotate(45deg);
          }
          50% {
            transform: translateY(-30px) rotate(45deg);
          }
        }

        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes count-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }

        .animate-gradient {
          animation: gradient 10s ease infinite;
        }

        .animate-count-up {
          animation: count-up 1s ease-out forwards;
        }

        .delay-1000 {
          animation-delay: 1s;
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }

        .animate-scale-in {
          animation: scale-in 0.5s ease-out forwards;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
