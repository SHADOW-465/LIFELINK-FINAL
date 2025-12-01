'use client';

import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Droplets, Download, Clock, CheckCircle } from 'lucide-react';
import MotionWrapper from '@/components/ui/MotionWrapper';
import { Progress } from '@/components/ui/progress';

export default function HistoryPage() {
    const { user } = useUser();
    const history = useQuery(api.donations.getUserHistory, { userId: user?.id || '' });
    const currentUser = useQuery(api.users.getCurrentUser);

    const isEligible = currentUser?.isEligible ?? true;
    const eligibilityDate = currentUser?.eligibilityDate || Date.now();
    const daysUntilEligible = Math.ceil((eligibilityDate - Date.now()) / (1000 * 60 * 60 * 24));
    const progress = Math.max(0, Math.min(100, ((90 - daysUntilEligible) / 90) * 100));

    return (
        <div className="pb-20">
            <div className="bg-white dark:bg-card pt-8 pb-6 px-4 rounded-b-3xl shadow-sm mb-6">
                <h1 className="text-2xl font-bold text-foreground mb-6">Donation History</h1>

                {/* Eligibility Card */}
                <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none shadow-lg">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold flex items-center gap-2">
                                <Clock className="w-5 h-5 text-blue-400" />
                                Next Eligibility
                            </h3>
                            {isEligible ? (
                                <Badge className="bg-green-500 hover:bg-green-600">Eligible Now</Badge>
                            ) : (
                                <Badge variant="secondary" className="text-slate-900 bg-white">
                                    {daysUntilEligible} days left
                                </Badge>
                            )}
                        </div>

                        {!isEligible && (
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs text-slate-300">
                                    <span>Recovery Progress</span>
                                    <span>{Math.round(progress)}%</span>
                                </div>
                                <Progress value={progress} className="h-2 bg-slate-700" />
                                <p className="text-xs text-slate-400 mt-2">
                                    Estimated date: {new Date(eligibilityDate).toLocaleDateString()}
                                </p>
                            </div>
                        )}

                        {isEligible && (
                            <p className="text-sm text-slate-300">
                                You are fully recovered and ready to save lives again!
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="px-4 space-y-6">
                <div className="relative border-l-2 border-dashed border-gray-200 dark:border-gray-800 ml-4 space-y-8">
                    {history?.length === 0 ? (
                        <div className="ml-8 text-muted-foreground">
                            <p>No donation history yet.</p>
                        </div>
                    ) : (
                        history?.map((donation, index) => (
                            <MotionWrapper key={donation._id} delay={index * 0.1}>
                                <div className="relative ml-8">
                                    <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-red-500 border-4 border-white dark:border-background shadow-sm" />

                                    <Card className="border-none shadow-sm">
                                        <CardContent className="p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <p className="font-bold text-foreground flex items-center gap-2">
                                                        {donation.units} Unit(s) • {donation.type}
                                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                                    </p>
                                                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {new Date(donation.date).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <Button variant="outline" size="icon" className="h-8 w-8">
                                                    <Download className="w-4 h-4" />
                                                </Button>
                                            </div>

                                            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/30 p-2 rounded-lg">
                                                <MapPin className="w-4 h-4 text-primary" />
                                                {donation.location}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </MotionWrapper>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
