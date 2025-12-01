'use client';

import { useUser } from '@clerk/nextjs';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  User, MapPin, Droplets, Award, Calendar,
  ShieldCheck, Heart, Activity, Edit, FileText, ChevronRight
} from 'lucide-react';
import MotionWrapper from '@/components/ui/MotionWrapper';
import { Skeleton } from '@/components/ui/skeleton';
import DonorPal from '@/components/features/ai/DonorPal';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
import Image from 'next/image';

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const userData = useQuery(api.users.getCurrentUser);
  const updateProfile = useMutation(api.users.updateProfile);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: '',
    bloodType: '',
  });

  const handleEditClick = () => {
    if (userData) {
      setEditForm({
        fullName: userData.fullName,
        bloodType: userData.bloodType,
      });
      setIsEditing(true);
    }
  };

  const handleSaveProfile = async () => {
    if (!userData?.clerkId) return;
    try {
      await updateProfile({
        clerkId: userData.clerkId,
        fullName: editForm.fullName,
        bloodType: editForm.bloodType,
      });
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  if (!isLoaded || userData === undefined) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-40 w-full rounded-3xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  // Calculate Level and Progress
  const donations = userData?.donationsCount || 0;
  const currentLevel = Math.floor(donations / 5) + 1;
  const nextLevelDonations = currentLevel * 5;
  const progress = ((donations % 5) / 5) * 100;

  // Calculate Karma Points (Mock calculation)
  const karmaPoints = (donations * 50) + ((userData?.badges?.length || 0) * 100);

  return (
    <div className="pb-24">
      {/* Header Section */}
      <div className="bg-white dark:bg-card pt-8 pb-6 px-4 rounded-b-3xl shadow-sm mb-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleEditClick}>
                <Edit className="w-5 h-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <Input
                    value={editForm.fullName}
                    onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Blood Type</label>
                  <Input
                    value={editForm.bloodType}
                    onChange={(e) => setEditForm({ ...editForm, bloodType: e.target.value })}
                  />
                </div>
                <Button className="w-full bg-red-600 hover:bg-red-700" onClick={handleSaveProfile}>
                  Save Changes
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center overflow-hidden border-4 border-white dark:border-gray-900 shadow-md">
            <Image
              src={user?.imageUrl || '/placeholder-user.jpg'}
              alt="Profile"
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              {userData?.fullName}
              {userData?.badges?.includes("Verified Donor") && (
                <ShieldCheck className="w-5 h-5 text-blue-500" />
              )}
            </h2>
            <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
              <Droplets className="w-4 h-4 text-red-500" />
              <span>{userData?.bloodType} Donor</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <MapPin className="w-4 h-4" />
              <span>Dhaka, Bangladesh</span>
            </div>
          </div>
        </div>

        {/* Level Progress */}
        <div className="bg-gray-50 dark:bg-secondary/30 p-4 rounded-2xl">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-sm">Level {currentLevel}</span>
            <span className="text-xs text-muted-foreground">{donations} / {nextLevelDonations} donations</span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {5 - (donations % 5)} more donations to reach Level {currentLevel + 1}
          </p>
        </div>
      </div>

      <div className="px-4 space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <MotionWrapper delay={0.1}>
            <Card className="border-none shadow-sm bg-red-50 dark:bg-red-900/10">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-2">
                  <Heart className="w-5 h-5 text-red-600" />
                </div>
                <span className="text-2xl font-bold text-red-700 dark:text-red-400">{donations}</span>
                <span className="text-xs text-muted-foreground">Lives Saved (Est.)</span>
              </CardContent>
            </Card>
          </MotionWrapper>

          <MotionWrapper delay={0.2}>
            <Card className="border-none shadow-sm bg-blue-50 dark:bg-blue-900/10">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-2xl font-bold text-blue-700 dark:text-blue-400">{karmaPoints}</span>
                <span className="text-xs text-muted-foreground">Karma Points</span>
              </CardContent>
            </Card>
          </MotionWrapper>
        </div>

        {/* History Link */}
        <MotionWrapper delay={0.25}>
          <Link href="/history">
            <Button variant="outline" className="w-full justify-between h-12 px-4 border-dashed border-2">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                View Donation History
              </span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Button>
          </Link>
        </MotionWrapper>

        {/* Badges Section */}
        <MotionWrapper delay={0.3}>
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {userData?.badges && userData.badges.length > 0 ? (
                  userData.badges.map((badge, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1 text-sm">
                      {badge}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No badges earned yet. Start donating!</p>
                )}
              </div>
            </CardContent>
          </Card>
        </MotionWrapper>

        {/* Medical History Summary */}
        <MotionWrapper delay={0.4}>
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-green-500" />
                Medical Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Last Donation</span>
                  <span className="font-medium">
                    {userData?.lastDonationDate
                      ? new Date(userData.lastDonationDate).toLocaleDateString()
                      : 'Never'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Eligibility Status</span>
                  <span className={`font-medium ${userData?.isEligible !== false ? 'text-green-600' : 'text-red-600'}`}>
                    {userData?.isEligible !== false ? 'Eligible' : 'Deferred'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </MotionWrapper>
      </div>

      {/* AI Assistant */}
      <DonorPal />
    </div>
  );
}
