"use client"

import {useState, useEffect} from "react"
import {useTheme} from "next-themes"
import {Moon, Sun} from "lucide-react"

import {Button} from "@/components/ui/button"

export function ToggleMode() {
  const {theme, setTheme} = useTheme()

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <Button variant="outline" size="icon" disabled={true}></Button>
  }

  const dark = theme === "dark"

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(`${dark ? "light" : "dark"}`)}
    >
      {dark ? (
        <Sun className="hover:cursor-pointer hover:text-primary duration-300 transition-all" />
      ) : (
        <Moon className="hover:cursor-pointer hover:text-primary duration-300 transition-all" />
      )}
    </Button>
  )
}
