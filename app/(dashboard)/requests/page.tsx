'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { FileText, Plus, Search, MapPin, Clock, AlertTriangle, Droplets, Navigation, QrCode } from 'lucide-react';
import Link from 'next/link';
import MotionWrapper from '@/components/ui/MotionWrapper';
import ShareButton from '@/components/ui/ShareButton';
import { Doc, Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { QRCodeSVG } from 'qrcode.react';

type RequestWithDistance = Doc<"bloodRequests"> & { distance?: number };

// Haversine formula to calculate distance
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
};

const deg2rad = (deg: number) => {
  return deg * (Math.PI / 180);
};

export default function RequestsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isDonating, setIsDonating] = useState<string | null>(null);

  const allRequests = useQuery(api.requests.getAllRequests);
  const userRequests = useQuery(api.requests.getUserRequests);
  const donate = useMutation(api.requests.donateToRequest);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => console.log('Location access denied or error', error)
      );
    }
  }, []);

  const handleDonate = async (requestId: Id<"bloodRequests">) => {
    setIsDonating(requestId);
    try {
      await donate({ requestId });
      toast.success("Thank you! You have successfully volunteered to donate.");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to process donation. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsDonating(null);
    }
  };

  const getFilteredAndSortedRequests = () => {
    if (!allRequests) return [];

    let filtered = allRequests.filter(request => {
      const matchesSearch = request.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.hospitalName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterType === 'all' || filterType === 'near' ||
        (filterType === 'my' && userRequests?.some(ur => ur._id === request._id)) ||
        (filterType === 'urgent' && !request.isFulfilled) ||
        (filterType === 'fulfilled' && request.isFulfilled);

      return matchesSearch && matchesFilter;
    });

    if (filterType === 'near' && userLocation) {
      filtered = filtered.map(req => {
        if (req.latitude && req.longitude) {
          return {
            ...req,
            distance: calculateDistance(userLocation.lat, userLocation.lng, req.latitude, req.longitude)
          };
        }
        return { ...req, distance: Infinity };
      }).sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
    }

    return filtered;
  };

  const filteredRequests = getFilteredAndSortedRequests();

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-card pt-8 pb-6 px-4 rounded-b-3xl shadow-sm mb-6 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">Blood Requests</h1>
          <Link href="/requests/new">
            <Button size="sm" className="rounded-full">
              <Plus className="w-4 h-4 mr-1" />
              New
            </Button>
          </Link>
        </div>

        {/* Search and Filter */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search by patient or hospital..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-secondary/50 border-none rounded-xl"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <Button
              variant={filterType === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterType('all')}
              className="rounded-full whitespace-nowrap"
            >
              All Requests
            </Button>
            <Button
              variant={filterType === 'near' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterType('near')}
              className="rounded-full whitespace-nowrap"
              disabled={!userLocation}
            >
              <Navigation className="w-3 h-3 mr-1" />
              Near Me
            </Button>
            <Button
              variant={filterType === 'urgent' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterType('urgent')}
              className={`rounded-full whitespace-nowrap ${filterType === 'urgent' ? 'bg-red-600 hover:bg-red-700' : ''}`}
            >
              Urgent Needs
            </Button>
            <Button
              variant={filterType === 'my' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterType('my')}
              className="rounded-full whitespace-nowrap"
            >
              My Requests
            </Button>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-4">
        {/* Requests List */}
        <div className="space-y-4">
          {filteredRequests.length > 0 ? (
            filteredRequests.map((request: RequestWithDistance, index) => (
              <MotionWrapper key={request._id} delay={index * 0.05}>
                <Card className="border-none shadow-md overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex">
                      {/* Left Indicator Strip */}
                      <div className={`w-2 ${request.isFulfilled ? 'bg-green-500' : 'bg-red-500'}`} />

                      <div className="flex-1 p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-lg text-foreground">{request.patientName}</h3>
                              {request.isFulfilled && (
                                <Badge variant="secondary" className="text-green-600 bg-green-100 dark:bg-green-900/20">
                                  Fulfilled
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <MapPin className="w-3 h-3 mr-1" />
                              {request.hospitalName}
                              {request.distance !== undefined && request.distance !== Infinity && (
                                <span className="ml-2 text-xs bg-secondary px-1.5 py-0.5 rounded-full">
                                  {request.distance.toFixed(1)} km away
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-600 font-bold border-2 border-red-200 dark:border-red-800">
                              {request.bloodType}
                            </div>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                        <QrCode className="h-4 w-4 text-muted-foreground" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                        <DialogTitle>Share Request</DialogTitle>
                                        <DialogDescription>
                                            Scan this QR code to share or verify this blood request.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="flex items-center justify-center p-6">
                                        <div className="bg-white p-4 rounded-lg">
                                            <QRCodeSVG value={`https://lifelink-pwa.vercel.app/requests/${request._id}`} size={200} />
                                        </div>
                                    </div>
                                    <div className="flex justify-center">
                                        <p className="text-xs text-muted-foreground break-all text-center">
                                            ID: {request._id}
                                        </p>
                                    </div>
                                </DialogContent>
                            </Dialog>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground bg-secondary/30 p-2 rounded-lg">
                            <Droplets className="w-4 h-4 text-primary" />
                            <span>{request.unitsRequired} Units</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground bg-secondary/30 p-2 rounded-lg">
                            <Clock className="w-4 h-4 text-primary" />
                            <span>{new Date(request.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {!request.isFulfilled ? (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-red-200 dark:shadow-none shadow-lg"
                                  disabled={isDonating === request._id}
                                >
                                  {isDonating === request._id ? 'Processing...' : (
                                    <>
                                      <AlertTriangle className="w-4 h-4 mr-2" />
                                      Donate
                                    </>
                                  )}
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirm Donation</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to volunteer to donate for this request?
                                    By clicking continue, you confirm that you are available and willing to donate blood.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDonate(request._id)}>
                                    Confirm Donation
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          ) : (
                            <Button variant="outline" className="flex-1 rounded-xl" disabled>
                              Completed
                            </Button>
                          )}
                          <ShareButton
                            title={`Urgent Blood Request: ${request.bloodType}`}
                            text={`Urgent blood needed for ${request.patientName} at ${request.hospitalName}. Blood Type: ${request.bloodType}.`}
                            className="rounded-xl"
                          />
                        </div>
                      </div >
                    </div >
                  </CardContent >
                </Card >
              </MotionWrapper >
            ))
          ) : (
            <MotionWrapper>
              <Card className="border-dashed border-2 bg-transparent shadow-none">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">No requests found</h3>
                  <p className="text-muted-foreground mb-6">
                    {searchTerm || filterType !== 'all'
                      ? 'Try adjusting your search or filter criteria'
                      : 'No blood requests available at the moment'
                    }
                  </p>
                  <Link href="/requests/new">
                    <Button className="rounded-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Request
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </MotionWrapper>
          )
          }
        </div >
      </div >
    </div >
  );
}
