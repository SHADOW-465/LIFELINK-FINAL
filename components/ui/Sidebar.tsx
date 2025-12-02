"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Home, Calendar, FileText, User, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "./ThemeToggle"
import { UserButton } from "@clerk/nextjs"

const navigation = [
    { name: 'Home', href: '/dashboard', icon: Home },
    { name: 'Schedule', href: '/schedule', icon: Calendar },
    { name: 'Requests', href: '/requests', icon: FileText },
    { name: 'Profile', href: '/profile', icon: User },
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <div className="hidden md:flex flex-col h-screen w-64 bg-card border-r border-border fixed left-0 top-0 z-50 px-4 py-6">
            {/* Logo area */}
            <div className="flex items-center gap-2 px-2 mb-8">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                    L
                </div>
                <span className="text-xl font-bold tracking-tight">LifeLink</span>
            </div>

            {/* Create Button */}
            <div className="mb-8 px-2">
                <Link href="/requests/new">
                    <Button className="w-full justify-start gap-2 rounded-xl h-12 text-base shadow-md hover:shadow-lg transition-all" size="lg">
                        <Plus className="h-5 w-5" />
                        New Request
                    </Button>
                </Link>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 space-y-1">
                {navigation.map((item) => {
                    const isActive = pathname === item.href
                    const Icon = item.icon

                    return (
                        <Link key={item.name} href={item.href} className="block group">
                            <div className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative overflow-hidden",
                                isActive
                                    ? "bg-primary/10 text-primary font-medium"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}>
                                {isActive && (
                                    <motion.div
                                        layoutId="sidebar-active"
                                        className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    />
                                )}
                                <Icon className={cn("h-5 w-5", isActive ? "text-primary" : "group-hover:text-foreground transition-colors")} />
                                <span>{item.name}</span>
                            </div>
                        </Link>
                    )
                })}
            </div>

            {/* Bottom Actions */}
            <div className="mt-auto pt-6 border-t border-border space-y-4">
                 <div className="flex items-center justify-between px-2">
                    <span className="text-sm font-medium text-muted-foreground">Theme</span>
                    <ThemeToggle />
                 </div>

                 <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-muted transition-colors cursor-pointer">
                    <UserButton
                        appearance={{
                            elements: {
                                userButtonBox: "flex-row-reverse gap-3",
                                userButtonOuterIdentifier: "text-sm font-medium text-foreground",
                            },
                            variables: {
                                fontFamily: 'var(--font-outfit)',
                            }
                        }}
                        showName
                    />
                 </div>
            </div>
        </div>
    )
}
