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
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const isLandingPage = pathname === "/"

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

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMobileMenuOpen(false)
  }, [router.asPath]) // Updated dependency

  useEffect(() => {
    console.log("Mobile menu state:", isMobileMenuOpen)
  }, [isMobileMenuOpen])

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUserEmail("")
    localStorage.removeItem("userEmail")
    router.push("/")
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev)
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`flex items-center justify-between px-6 py-4 bg-black/80 backdrop-blur-sm border-b border-white/10 ${
          isLandingPage ? "landing-page-nav" : ""
        }`}
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
        <Button variant="ghost" size="icon" className="md:hidden text-white" onClick={toggleMobileMenu}>
          <Menu className="h-6 w-6" />
        </Button>
      </motion.nav>

      {/* Mobile menu */}
      <div
        className={`fixed inset-x-0 top-[76px] bg-black/90 transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        } ${isLandingPage ? "landing-page-menu" : ""}`}
      >
        <div className="flex flex-col space-y-2 p-4">
          <NavLink href="/" isActive={pathname === "/"} onClick={() => setIsMobileMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink href="/features" isActive={pathname === "/features"} onClick={() => setIsMobileMenuOpen(false)}>
            Features
          </NavLink>
          <NavLink
            href="/how-it-works"
            isActive={pathname === "/how-it-works"}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            How it Works
          </NavLink>
          <NavLink href="/examples" isActive={pathname === "/examples"} onClick={() => setIsMobileMenuOpen(false)}>
            Examples
          </NavLink>
          <NavLink href="/pricing" isActive={pathname === "/pricing"} onClick={() => setIsMobileMenuOpen(false)}>
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

      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} userEmail={userEmail} />
    </>
  )
}

function NavLink({
  href,
  children,
  isActive,
  onClick,
}: { href: string; children: React.ReactNode; isActive: boolean; onClick?: () => void }) {
  return (
    <Link
      href={href}
      className={`text-gray-300 hover:text-white transition-colors relative group ${isActive ? "text-white" : ""}`}
      onClick={onClick}
    >
      {children}
      <span
        className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 transition-all ${isActive ? "w-full" : "group-hover:w-full"}`}
      />
    </Link>
  )
}

