'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Heart, AlertTriangle, MapPin, Clock, Users, Activity } from 'lucide-react';
import OnboardingModal from '@/components/features/onboarding/OnboardingModal';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [helpingRequest, setHelpingRequest] = useState<string | null>(null);
  
  const currentUser = useQuery(api.users.getCurrentUser);
  const allRequests = useQuery(api.requests.getAllRequests);
  // Temporarily disabled until Convex is properly set up
  // const helpWithRequest = useMutation(api.requests.helpWithRequest);

  useEffect(() => {
    if (isLoaded && user && currentUser === null) {
      setShowOnboarding(true);
    }
  }, [isLoaded, user, currentUser]);

  const handleHelpRequest = async (requestId: string) => {
    setHelpingRequest(requestId);
    try {
      // TODO: Uncomment when Convex is properly set up
      // await helpWithRequest({ requestId: requestId as Id<"bloodRequests"> });
      
      // Temporary simulation for demo purposes
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("You're now helping with this blood request! The requester will be notified.", {
        description: "Thank you for your willingness to help save a life!",
        duration: 4000,
      });
    } catch (error) {
      console.error('Error helping with request:', error);
      toast.error("Failed to help with this request. Please try again.", {
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        duration: 4000,
      });
    } finally {
      // Reset after 3 seconds
      setTimeout(() => setHelpingRequest(null), 3000);
    }
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  const urgentRequests = allRequests?.filter(request => 
    !request.isFulfilled && 
    (request.bloodType === currentUser?.bloodType || 
     request.bloodType === 'O-' || 
     request.bloodType === 'AB+')
  ).slice(0, 3) || [];

  // Helper function to get request ID (Convex uses _id)
  const getRequestId = (request: { _id: string }): string => request._id;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {currentUser?.fullName || user?.firstName}!
              </h1>
              <p className="text-gray-600">
                {currentUser?.bloodType ? `Blood Type: ${currentUser.bloodType}` : 'Complete your profile to get started'}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Eligibility Banner */}
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-green-800">You&apos;re eligible to donate!</h3>
                <p className="text-sm text-green-700">
                  Your last donation was 8 weeks ago. You can donate again.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Request Button */}
        <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-red-800">Emergency Blood Request</h3>
                  <p className="text-sm text-red-700">
                    Urgent need for {currentUser?.bloodType || 'your blood type'}
                  </p>
                </div>
              </div>
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                Respond Now
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Nearby Requests */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Nearby Requests</h2>
            <Link href="/requests">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>
          
          <div className="space-y-3">
            {urgentRequests.length > 0 ? (
              urgentRequests.map((request) => (
                <Card key={getRequestId(request)} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-medium text-gray-900">{request.patientName}</h3>
                          <Badge variant="destructive" className="text-xs">
                            {request.bloodType}
                          </Badge>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 space-x-4">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{request.hospitalName}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{request.unitsRequired} units</span>
                          </div>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-red-600 hover:bg-red-700 text-white"
                        onClick={() => handleHelpRequest(getRequestId(request))}
                        disabled={helpingRequest === getRequestId(request)}
                      >
                        {helpingRequest === getRequestId(request) ? 'Helping...' : 'Help'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No urgent requests nearby</p>
                  <p className="text-sm text-gray-500">Check back later or create a request</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Community Updates */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Community Updates</CardTitle>
            <CardDescription>
              Latest news and updates from the LifeLink community
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Blood drive at City Hospital this weekend
                </p>
                <p className="text-xs text-gray-600">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  New donor registration milestone reached
                </p>
                <p className="text-xs text-gray-600">1 day ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Updated safety guidelines for blood donation
                </p>
                <p className="text-xs text-gray-600">3 days ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
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
