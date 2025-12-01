'use client';

import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OnboardingModalProps {
  isOpen: boolean;
  userEmail: string;
  onComplete: () => void;
}

const BLOOD_TYPES = [
  'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
];

import { useUser } from '@clerk/nextjs';

export default function OnboardingModal({ isOpen, userEmail, onComplete }: OnboardingModalProps) {
  const { user } = useUser();
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationError, setLocationError] = useState('');

  const createUser = useMutation(api.users.createOrUpdateUser);

  const handleLocationRequest = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    setIsSubmitting(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setIsSubmitting(false);
        setLocationError('');
      },
      (error) => {
        console.error('Error getting location:', error);
        setLocationError('Unable to retrieve your location. Please allow access or skip.');
        setIsSubmitting(false);
      }
    );
  };

  const handleSubmit = async () => {
    if (!fullName.trim() || !bloodType || !user?.id) return;

    setIsSubmitting(true);
    try {
      await createUser({
        fullName: fullName.trim(),
        email: userEmail,
        bloodType,
        clerkId: user.id,
        latitude: location?.lat,
        longitude: location?.lng,
        isVerified: !!location, // Verified if location is provided
      });
      onComplete();
    } catch (error) {
      console.error('Error creating user profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = async () => {
    if (!user?.id) return;
    // Create basic profile without location
    setIsSubmitting(true);
    try {
      await createUser({
        fullName: fullName.trim() || 'Anonymous Donor',
        email: userEmail,
        bloodType: bloodType || 'Unknown',
        clerkId: user.id,
        isVerified: false,
      });
      onComplete();
    } catch (error) {
      console.error('Error skipping onboarding:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all duration-300">
      <Card className="w-full max-w-md bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-white/20 shadow-2xl animate-in fade-in zoom-in duration-300">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-16 h-16 bg-red-100/80 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4 shadow-inner">
            <Heart className="w-8 h-8 text-red-600 dark:text-red-500 fill-current" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            {step === 1 ? 'Welcome to LifeLink!' : 'Enable Location'}
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300 font-medium">
            {step === 1
              ? 'Complete your profile to start connecting with the blood donation community'
              : 'Help us find blood requests near you. Enabling location gives you the "Verified Donor" badge!'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 ? (
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-gray-800 dark:text-gray-200 font-semibold">Full Name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="bg-white/50 dark:bg-black/50 border-gray-200 dark:border-gray-700 focus:ring-red-500"
                />
              </div>


              <div className="space-y-2">
                <Label htmlFor="bloodType" className="text-gray-800 dark:text-gray-200 font-semibold">Blood Type</Label>
                <Select value={bloodType} onValueChange={setBloodType}>
                  <SelectTrigger className="w-full bg-white/50 dark:bg-black/50 border-gray-200 dark:border-gray-700 focus:ring-red-500 text-gray-900 dark:text-white">
                    <SelectValue placeholder="Select your blood type" />
                  </SelectTrigger>
                  <SelectContent>
                    {BLOOD_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
                  onClick={handleSkip}
                >
                  Skip for Now
                </Button>
                <Button
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/30 transition-all hover:scale-[1.02]"
                  disabled={!fullName.trim() || !bloodType}
                  onClick={() => setStep(2)}
                >
                  Next
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <div className="bg-blue-50/80 dark:bg-blue-900/20 p-5 rounded-xl border border-blue-100 dark:border-blue-800 text-blue-800 dark:text-blue-200 text-sm shadow-sm">
                  <p className="font-semibold mb-2 flex items-center justify-center gap-2">
                    <span className="text-xl">📍</span> We use your location to:
                  </p>
                  <ul className="space-y-2 text-left pl-8 list-disc marker:text-blue-500">
                    <li>Show urgent requests nearby</li>
                    <li>Verify your donor status</li>
                  </ul>
                </div>

                {locationError && (
                  <p className="text-red-500 text-sm font-medium bg-red-50 dark:bg-red-900/20 p-2 rounded">{locationError}</p>
                )}

                {location ? (
                  <div className="text-green-600 dark:text-green-400 font-bold flex items-center justify-center gap-2 bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                    Location Captured!
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full py-10 border-dashed border-2 border-gray-300 dark:border-gray-600 hover:border-red-500 dark:hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all group"
                    onClick={handleLocationRequest}
                    disabled={isSubmitting}
                  >
                    <div className="flex flex-col items-center gap-2 text-gray-600 dark:text-gray-300 group-hover:text-red-600 dark:group-hover:text-red-400">
                      {isSubmitting ? (
                        <Loader2 className="w-8 h-8 animate-spin" />
                      ) : (
                        <>
                          <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-red-100 dark:group-hover:bg-red-900/30 transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                          </div>
                          <span className="font-medium">Click to Enable Location</span>
                        </>
                      )}
                    </div>
                  </Button>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  onClick={() => setStep(1)}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  Back
                </Button>
                <Button
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/30 transition-all hover:scale-[1.02]"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Complete Setup'
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
