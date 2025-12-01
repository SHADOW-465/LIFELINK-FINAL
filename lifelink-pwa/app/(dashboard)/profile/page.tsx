'use client';

import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Droplets, Calendar, Award, Settings } from 'lucide-react';

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const currentUser = useQuery(api.users.getCurrentUser);
  const userRequests = useQuery(api.requests.getUserRequests);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  const totalRequests = userRequests?.length || 0;
  const fulfilledRequests = userRequests?.filter(req => req.isFulfilled).length || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Profile Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-red-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900">
                  {currentUser?.fullName || user?.fullName || 'User'}
                </h2>
                <div className="flex items-center space-x-2 mt-1">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">
                    {currentUser?.email || user?.emailAddresses[0]?.emailAddress}
                  </span>
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <Droplets className="w-4 h-4 text-gray-500" />
                  <Badge variant="outline" className="text-red-600 border-red-200">
                    {currentUser?.bloodType || 'Not set'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{totalRequests}</div>
              <div className="text-sm text-gray-600">Total Requests</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{fulfilledRequests}</div>
              <div className="text-sm text-gray-600">Fulfilled</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <CardDescription>
              Your recent blood donation activities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {userRequests && userRequests.length > 0 ? (
              userRequests.slice(0, 5).map((request) => (
                <div key={request._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <Droplets className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{request.patientName}</p>
                      <p className="text-sm text-gray-600">{request.hospitalName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={request.isFulfilled ? "default" : "secondary"}>
                      {request.isFulfilled ? "Fulfilled" : "Pending"}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No recent activity</p>
                <p className="text-sm text-gray-500">Start by creating a blood request</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Achievements</CardTitle>
            <CardDescription>
              Your contributions to the community
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                <Award className="w-8 h-8 text-yellow-600" />
                <div>
                  <p className="font-medium text-gray-900">First Donation</p>
                  <p className="text-sm text-gray-600">Completed</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Award className="w-8 h-8 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">Regular Donor</p>
                  <p className="text-sm text-gray-600">5+ donations</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
