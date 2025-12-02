'use client';

import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, ArrowLeft, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';

export default function HistoryPage() {
    const { user } = useUser();
    const history = useQuery(api.donations.getUserHistory, user ? { userId: user.id } : "skip");
    const userData = useQuery(api.users.getCurrentUser);

    if (!user || history === undefined || userData === undefined) {
        return (
            <div className="p-8 space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
            </div>
        );
    }

    // Calculate Eligibility Progress
    const now = Date.now();
    const eligibilityDate = userData?.eligibilityDate || 0;
    const lastDonationDate = userData?.lastDonationDate || 0;

    // Total wait time is roughly 90 days (from logic in donations.ts)
    // 90 days in ms = 7776000000
    const totalWaitTime = 90 * 24 * 60 * 60 * 1000;
    const timeSinceLast = now - lastDonationDate;

    // Progress % (0 to 100)
    // If eligible, 100%. If just donated, 0%.
    // But progress usually means "Time passed towards eligibility".
    let progress = 0;
    let daysRemaining = 0;

    if (now >= eligibilityDate) {
        progress = 100;
        daysRemaining = 0;
    } else {
        progress = Math.min(100, (timeSinceLast / totalWaitTime) * 100);
        daysRemaining = Math.ceil((eligibilityDate - now) / (24 * 60 * 60 * 1000));
    }

    return (
        <div className="pb-24 space-y-6">
             <div className="flex items-center gap-4">
                <Link href="/profile">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold">Donation History</h1>
             </div>

             {/* Progress Tracking Section */}
             <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white border-none shadow-lg">
                <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-red-400" />
                            <h2 className="font-semibold">Next Eligibility</h2>
                        </div>
                        <Badge variant={daysRemaining === 0 ? "default" : "secondary"} className={daysRemaining === 0 ? "bg-green-500 hover:bg-green-600" : ""}>
                            {daysRemaining === 0 ? "Eligible Now" : `${daysRemaining} days left`}
                        </Badge>
                    </div>
                    <Progress value={progress} className="h-3 mb-2 bg-gray-700" indicatorClassName="bg-red-500" />
                    <p className="text-xs text-gray-400">
                        {daysRemaining === 0
                            ? "You are eligible to donate again! Find a request nearby."
                            : `Recovery in progress. Estimated eligibility: ${new Date(eligibilityDate).toLocaleDateString()}`
                        }
                    </p>
                </CardContent>
             </Card>

             <h2 className="text-lg font-semibold mt-8 mb-4 px-1">Past Donations</h2>

             <div className="relative border-l-2 border-dashed border-gray-200 dark:border-gray-800 ml-4 space-y-8 pl-8 py-2">
                {history.length === 0 ? (
                    <div className="text-muted-foreground">No donation history found.</div>
                ) : (
                    history.map((donation) => (
                        <div key={donation._id} className="relative">
                            {/* Dot on timeline */}
                            <div className="absolute -left-[41px] top-1 h-5 w-5 rounded-full border-4 border-white dark:border-background bg-red-500" />

                            <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-bold flex items-center gap-2">
                                                {donation.units} Units - {donation.type || 'Whole Blood'}
                                            </h3>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                                <MapPin className="w-3 h-3" />
                                                {donation.location}
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(donation.date).toLocaleDateString()}
                                        </Badge>
                                    </div>
                                    {donation.certificateUrl && (
                                        <Button variant="link" className="px-0 text-primary h-auto py-1 text-sm">
                                            View Certificate
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    ))
                )}
             </div>
        </div>
    );
}
