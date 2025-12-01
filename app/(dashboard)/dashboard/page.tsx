'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, AlertTriangle, MapPin, Droplets, Activity, Bell, MessageSquare } from 'lucide-react';
import OnboardingModal from '@/components/features/onboarding/OnboardingModal';
import Link from 'next/link';
import MotionWrapper from '@/components/ui/MotionWrapper';
import { motion } from 'framer-motion';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const [showOnboarding, setShowOnboarding] = useState(false);

  const currentUser = useQuery(api.users.getCurrentUser);
  const allRequests = useQuery(api.requests.getAllRequests);

  useEffect(() => {
    if (isLoaded && user && currentUser === null) {
      setShowOnboarding(true);
    }
  }, [isLoaded, user, currentUser]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const urgentRequests = allRequests?.filter(request =>
    !request.isFulfilled &&
    (request.bloodType === currentUser?.bloodType ||
      request.bloodType === 'O-' ||
      request.bloodType === 'AB+')
  ).slice(0, 3) || [];

  return (
    <div className="pb-8">
      {/* Header */}
      <div className="bg-white dark:bg-card pt-8 pb-6 px-4 rounded-b-3xl shadow-sm mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold text-foreground"
            >
              Hello, {currentUser?.fullName?.split(' ')[0] || user?.firstName}! 👋
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground text-sm"
            >
              {currentUser?.badges?.includes("Verified Donor") ? "Verified Life Saver" : "Ready to save lives?"}
            </motion.p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/messages">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-secondary">
                <MessageSquare className="w-6 h-6 text-foreground" />
              </Button>
            </Link>
            <Link href="/notifications">
              <div className="relative">
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-secondary">
                  <Bell className="w-6 h-6 text-foreground" />
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-primary rounded-full border-2 border-white dark:border-card"></span>
                </Button>
              </div>
            </Link>
          </div>
        </div>

        {/* Eligibility Card */}
        <MotionWrapper delay={0.2}>
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-4 text-white shadow-lg shadow-emerald-200 dark:shadow-none relative overflow-hidden">
            <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
              <Activity className="w-32 h-32" />
            </div>
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white fill-current" />
              </div>
              <div>
                <h3 className="font-bold text-lg">You are eligible!</h3>
                <p className="text-emerald-50 text-sm opacity-90">
                  Your last donation was over 56 days ago.
                </p>
              </div>
            </div>
          </div>
        </MotionWrapper>
      </div>

      <div className="px-4 space-y-8">
        {/* Emergency Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Urgent Needs
            </h2>
            <Link href="/requests">
              <Button variant="link" className="text-primary text-sm h-auto p-0">View All</Button>
            </Link>
          </div>

          <div className="space-y-4">
            {urgentRequests.length > 0 ? (
              urgentRequests.map((request, index) => (
                <MotionWrapper key={request._id} delay={index * 0.1 + 0.3}>
                  <Card className="border-l-4 border-l-primary overflow-hidden hover:shadow-md transition-all">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold text-foreground">{request.patientName}</h3>
                          <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <MapPin className="w-3 h-3 mr-1" />
                            {request.hospitalName}
                          </div>
                        </div>
                        <Badge variant="destructive" className="rounded-lg px-2 py-1 text-xs font-bold">
                          {request.bloodType}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Droplets className="w-4 h-4 text-primary" />
                          <span>{request.unitsRequired} units needed</span>
                        </div>
                        <Button size="sm" className="rounded-full px-6 bg-primary hover:bg-primary/90">
                          Donate
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </MotionWrapper>
              ))
            ) : (
              <Card className="bg-muted/50 border-dashed">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground font-medium">No urgent requests nearby</p>
                  <p className="text-xs text-muted-foreground mt-1">You&apos;re a hero just for checking!</p>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-lg font-bold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <MotionWrapper delay={0.4}>
              <Link href="/requests/new">
                <div className="bg-rose-50 dark:bg-rose-950/30 p-4 rounded-2xl border border-rose-100 dark:border-rose-900 flex flex-col items-center text-center gap-3 hover:bg-rose-100 transition-colors">
                  <div className="w-12 h-12 bg-white dark:bg-card rounded-full shadow-sm flex items-center justify-center text-primary">
                    <Droplets className="w-6 h-6" />
                  </div>
                  <span className="font-semibold text-sm text-foreground">Request Blood</span>
                </div>
              </Link>
            </MotionWrapper>

            <MotionWrapper delay={0.5}>
              <Link href="/schedule">
                <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-2xl border border-blue-100 dark:border-blue-900 flex flex-col items-center text-center gap-3 hover:bg-blue-100 transition-colors">
                  <div className="w-12 h-12 bg-white dark:bg-card rounded-full shadow-sm flex items-center justify-center text-blue-600">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <span className="font-semibold text-sm text-foreground">Find Drives</span>
                </div>
              </Link>
            </MotionWrapper>
          </div>
        </section>
      </div>

      {/* Onboarding Modal */}
      <OnboardingModal
        isOpen={showOnboarding}
        userEmail={user?.emailAddresses[0]?.emailAddress || ''}
        onComplete={handleOnboardingComplete}
      />
    </div>
  );
}
