"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, User, LogOut, Mail } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { useRouter, usePathname } from "next/navigation"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ProfileModal } from "@/components/profile-modal"

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)

  useEffect(() => {
    // Check initial login state
    const storedEmail = localStorage.getItem("userEmail")
    if (storedEmail) {
      setIsLoggedIn(true)
      setUserEmail(storedEmail)
    }

    // Listen for login state changes
    const handleLoginStateChange = () => {
      const email = localStorage.getItem("userEmail")
      if (email) {
        setIsLoggedIn(true)
        setUserEmail(email)
      } else {
        setIsLoggedIn(false)
        setUserEmail("")
      }
    }

    window.addEventListener("loginStateChange", handleLoginStateChange)
    return () => window.removeEventListener("loginStateChange", handleLoginStateChange)
  }, [])

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUserEmail("")
    localStorage.removeItem("userEmail")
    router.push("/")
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="flex items-center justify-between px-6 py-4 bg-black/80 backdrop-blur-sm border-b border-white/10"
      >
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/eltek-logo%20-%20Copy.jpg-GW7qGWtnECB8GumlkSFj4O9mvctuea.jpeg"
            alt="EltekAI Logo"
            width={40}
            height={40}
          />
          <span className="text-white font-medium text-xl">EltekAI</span>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <NavLink href="/" isActive={pathname === "/"}>
            Home
          </NavLink>
          <NavLink href="/features" isActive={pathname === "/features"}>
            Features
          </NavLink>
          <NavLink href="/how-it-works" isActive={pathname === "/how-it-works"}>
            How it Works
          </NavLink>
          <NavLink href="/examples" isActive={pathname === "/examples"}>
            Examples
          </NavLink>
          <NavLink href="/pricing" isActive={pathname === "/pricing"}>
            Pricing
          </NavLink>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          {isLoggedIn ? (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="text-white hover:text-purple-400">
                  <Mail className="mr-2 h-4 w-4" /> {userEmail}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48">
                <div className="flex flex-col space-y-2">
                  <Button variant="ghost" className="justify-start" onClick={() => setIsProfileModalOpen(true)}>
                    <User className="mr-2 h-4 w-4" /> View Profile
                  </Button>
                  <Button variant="ghost" className="justify-start" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" /> Log Out
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <>
              <Button variant="ghost" className="text-white hover:text-purple-400" onClick={() => router.push("/auth")}>
                Sign In
              </Button>
              <Button
                className="bg-purple-600 hover:bg-purple-700 text-white"
                onClick={() => router.push("/auth?tab=signup")}
              >
                Get Started
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <Button variant="ghost" size="icon" className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <Menu className="h-6 w-6" />
        </Button>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-black/90 p-4 md:hidden">
            <div className="flex flex-col space-y-2">
              <NavLink href="/" isActive={pathname === "/"}>
                Home
              </NavLink>
              <NavLink href="/features" isActive={pathname === "/features"}>
                Features
              </NavLink>
              <NavLink href="/how-it-works" isActive={pathname === "/how-it-works"}>
                How it Works
              </NavLink>
              <NavLink href="/examples" isActive={pathname === "/examples"}>
                Examples
              </NavLink>
              <NavLink href="/pricing" isActive={pathname === "/pricing"}>
                Pricing
              </NavLink>
              {isLoggedIn ? (
                <>
                  <Button variant="ghost" className="justify-start text-white" onClick={() => router.push("/profile")}>
                    <User className="mr-2 h-4 w-4" /> Profile
                  </Button>
                  <Button variant="ghost" className="justify-start text-white" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" /> Log Out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" className="justify-start text-white" onClick={() => router.push("/auth")}>
                    Sign In
                  </Button>
                  <Button
                    className="justify-start bg-purple-600 hover:bg-purple-700 text-white"
                    onClick={() => router.push("/auth?tab=signup")}
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </motion.nav>

      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} userEmail={userEmail} />
    </>
  )
}

function NavLink({ href, children, isActive }: { href: string; children: React.ReactNode; isActive: boolean }) {
  return (
    <Link
      href={href}
      className={`text-gray-300 hover:text-white transition-colors relative group ${isActive ? "text-white" : ""}`}
    >
      {children}
      <span
        className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 transition-all ${isActive ? "w-full" : "group-hover:w-full"}`}
      />
    </Link>
  )
}

