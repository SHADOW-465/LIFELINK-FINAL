'use client';

import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/ui/Sidebar';
import { Home, Calendar, FileText, User, Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import React from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Home', href: '/dashboard', icon: Home },
  { name: 'Schedule', href: '/schedule', icon: Calendar },
  { name: 'Requests', href: '/requests', icon: FileText },
  { name: 'Profile', href: '/profile', icon: User },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background pb-24 md:pb-0">

      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="container mx-auto max-w-md md:max-w-none md:ml-64 md:w-[calc(100%-16rem)] md:p-8 transition-all duration-300">
        <div className="md:max-w-5xl md:mx-auto">
             {children}
        </div>
      </main>

      {/* Bottom Navigation (Mobile Only) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-2 pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto">
          <div className="glass rounded-2xl shadow-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border border-white/20 dark:border-white/10 p-2 flex items-center justify-between relative">

            {/* Left Side (Home, Schedule) */}
            {navigation.slice(0, 2).map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link key={item.name} href={item.href} className="flex-1">
                  <div className="flex flex-col items-center justify-center w-full h-full py-1 relative">
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute -top-2 w-1 h-1 bg-primary rounded-full"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`flex flex-col items-center gap-1 h-auto py-2 px-1 w-full hover:bg-transparent ${isActive
                        ? 'text-primary'
                        : 'text-muted-foreground hover:text-primary/70'
                        }`}
                    >
                      <motion.div
                        animate={{ scale: isActive ? 1.2 : 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
                      </motion.div>
                      <span className={`text-[10px] font-medium transition-all duration-300 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 hidden'}`}>
                        {item.name}
                      </span>
                    </Button>
                  </div>
                </Link>
              );
            })}

            {/* Center FAB */}
            <div className="flex items-center justify-center -mt-8 mx-2">
              <Link href="/requests/new">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-700 hover:to-rose-600 text-white rounded-full w-14 h-14 p-0 shadow-lg shadow-red-200 dark:shadow-none border-4 border-gray-50 dark:border-slate-950"
                  >
                    <Plus className="w-7 h-7" />
                  </Button>
                </motion.div>
              </Link>
            </div>

            {/* Right Side (Requests, Profile) */}
            {navigation.slice(2, 4).map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link key={item.name} href={item.href} className="flex-1">
                  <div className="flex flex-col items-center justify-center w-full h-full py-1 relative">
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute -top-2 w-1 h-1 bg-primary rounded-full"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`flex flex-col items-center gap-1 h-auto py-2 px-1 w-full hover:bg-transparent ${isActive
                        ? 'text-primary'
                        : 'text-muted-foreground hover:text-primary/70'
                        }`}
                    >
                      <motion.div
                        animate={{ scale: isActive ? 1.2 : 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
                      </motion.div>
                      <span className={`text-[10px] font-medium transition-all duration-300 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 hidden'}`}>
                        {item.name}
                      </span>
                    </Button>
                  </div>
                </Link>
              );
            })}

          </div>
        </div>
      </div>
    </div>
  );
}
