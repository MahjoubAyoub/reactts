"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, ImageIcon, FolderOpen, Users, Settings, Shield } from "lucide-react"
import { useSession } from "next-auth/react"

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "My Designs",
    href: "/dashboard/designs",
    icon: ImageIcon,
  },
  {
    title: "Templates",
    href: "/dashboard/templates",
    icon: FolderOpen,
  },
  {
    title: "Shared with me",
    href: "/dashboard/shared",
    icon: Users,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

const adminNavItem = {
  title: "Admin",
  href: "/dashboard/admin",
  icon: Shield,
}

export function DashboardNav() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === 'admin'

  const items = isAdmin ? [...navItems, adminNavItem] : navItems

  return (
    <nav className="grid items-start gap-2 p-4">
      {items.map((item, index) => (
        <Button
          key={index}
          variant={pathname === item.href ? "secondary" : "ghost"}
          className={cn(
            "w-full justify-start gap-2",
            pathname === item.href && "bg-muted font-medium hover:bg-muted"
          )}
          asChild
        >
          <Link href={item.href}>
            <item.icon className="h-4 w-4" />
            {item.title}
          </Link>
        </Button>
      ))}
    </nav>
  )
}
