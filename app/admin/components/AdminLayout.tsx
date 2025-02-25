"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Moon, Sun, ChevronLeft, LogOut, Home } from "lucide-react"
import Cookies from "js-cookie"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [theme, setTheme] = useState("light")
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    // Check local storage for theme preference
    const savedTheme = localStorage.getItem("theme") || "light"
    setTheme(savedTheme)
    document.documentElement.classList.toggle("dark", savedTheme === "dark")
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
  }

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      Cookies.remove("token")
      Cookies.remove("adminLoggedIn")
      Cookies.remove("admin_token")
      localStorage.removeItem("token")
      sessionStorage.clear()
      router.refresh()
      router.push("/admin/login")
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 ht-7 items-center justify-between">
          <div className="flex items-center gap-4">
            {pathname !== "/admin/dashboard" && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.back()}
                  title="Go Back"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.push("/admin/dashboard")}
                  title="Dashboard"
                >
                  <Home className="h-5 w-5" />
                </Button>
              </>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              title="Toggle Theme"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              {isLoggingOut ? "Logging out..." : "Logout"}
            </Button>
          </div>
        </div>
      </nav>
      
      <main className="container pt-20 pb-8">
        {children}
      </main>
    </div>
  )
} 