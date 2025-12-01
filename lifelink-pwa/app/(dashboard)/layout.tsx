'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, FileText, User, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toaster } from 'sonner';

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
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-40">
        <div className="flex items-center justify-between max-w-md mx-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  className={`flex flex-col items-center gap-1 h-auto py-2 px-3 ${
                    isActive 
                      ? 'bg-red-600 text-white' 
                      : 'text-gray-600 hover:text-red-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{item.name}</span>
                </Button>
              </Link>
            );
          })}
          
          {/* Floating Action Button */}
          <Link href="/requests/new">
            <Button
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-white rounded-full w-12 h-12 p-0 shadow-lg"
            >
              <Plus className="w-6 h-6" />
            </Button>
          </Link>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
