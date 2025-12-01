'use client';

import { useState, useEffect } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Plus, Loader2, Droplets, MapPin, User, Navigation } from 'lucide-react';
import Link from 'next/link';
import MotionWrapper from '@/components/ui/MotionWrapper';
import { toast } from 'sonner';

const BLOOD_TYPES = [
  'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
];

export default function NewRequestPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [formData, setFormData] = useState({
    patientName: '',
    hospitalName: '',
    bloodType: '',
    unitsRequired: 1,
    additionalInfo: '',
    latitude: undefined as number | undefined,
    longitude: undefined as number | undefined,
  });

  const createRequest = useMutation(api.requests.createRequest);

  useEffect(() => {
    // Auto-detect location on mount if possible
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }));
        },
        (error) => {
          console.log('Location auto-detect failed, user can manually retry');
        }
      );
    }
  }, []);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }));
        toast.success('Location updated!');
        setLocationLoading(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        toast.error('Unable to retrieve location.');
        setLocationLoading(false);
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientName || !formData.hospitalName || !formData.bloodType) return;

    setIsSubmitting(true);
    try {
      await createRequest({
        patientName: formData.patientName,
        hospitalName: formData.hospitalName,
        bloodType: formData.bloodType,
        unitsRequired: formData.unitsRequired,
        latitude: formData.latitude,
        longitude: formData.longitude,
      });
      toast.success('Request created successfully!');
      router.push('/requests');
    } catch (error) {
      console.error('Error creating request:', error);
      toast.error('Failed to create request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="pb-10">
      {/* Header */}
      <div className="bg-white dark:bg-card pt-8 pb-6 px-4 rounded-b-3xl shadow-sm mb-6">
        <div className="flex items-center space-x-4">
          <Link href="/requests">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">New Request</h1>
            <p className="text-muted-foreground text-sm">Ask for help from the community</p>
          </div>
        </div>
      </div>

      <div className="px-4 max-w-2xl mx-auto">
        <MotionWrapper>
          <Card className="border-none shadow-lg overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-red-500 to-rose-500" />
            <CardHeader>
              <CardTitle className="text-xl">Request Details</CardTitle>
              <CardDescription>
                Please provide accurate information to help donors reach you.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="patientName" className="flex items-center gap-2">
                      <User className="w-4 h-4 text-primary" />
                      Patient Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="patientName"
                      type="text"
                      value={formData.patientName}
                      onChange={(e) => handleInputChange('patientName', e.target.value)}
                      placeholder="Who needs blood?"
                      className="bg-secondary/30 border-transparent focus:border-primary"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hospitalName" className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      Hospital Name <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="hospitalName"
                        type="text"
                        value={formData.hospitalName}
                        onChange={(e) => handleInputChange('hospitalName', e.target.value)}
                        placeholder="Where is the patient admitted?"
                        className="bg-secondary/30 border-transparent focus:border-primary flex-1"
                        required
                        disabled={isSubmitting}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={handleGetLocation}
                        disabled={locationLoading || isSubmitting}
                        title="Use Current Location"
                        className={formData.latitude ? "text-green-600 border-green-200 bg-green-50" : ""}
                      >
                        {locationLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
                      </Button>
                    </div>
                    {formData.latitude && (
                      <p className="text-xs text-green-600 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> Location attached
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bloodType" className="flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-primary" />
                      Blood Type <span className="text-red-500">*</span>
                    </Label>
                    <select
                      id="bloodType"
                      value={formData.bloodType}
                      onChange={(e) => handleInputChange('bloodType', e.target.value)}
                      className="w-full px-3 py-2 bg-secondary/30 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                      required
                      disabled={isSubmitting}
                    >
                      <option value="">Select</option>
                      {BLOOD_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="unitsRequired">Units</Label>
                    <Input
                      id="unitsRequired"
                      type="number"
                      min="1"
                      max="10"
                      value={formData.unitsRequired}
                      onChange={(e) => handleInputChange('unitsRequired', parseInt(e.target.value))}
                      placeholder="1"
                      className="bg-secondary/30 border-transparent focus:border-primary"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalInfo">Additional Information</Label>
                  <Textarea
                    id="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                    placeholder="Any specific instructions, ward number, or contact details..."
                    rows={4}
                    className="bg-secondary/30 border-transparent focus:border-primary resize-none"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white h-12 text-lg shadow-lg shadow-red-200 dark:shadow-none"
                    disabled={!formData.patientName || !formData.hospitalName || !formData.bloodType || isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Publishing...
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5 mr-2" />
                        Publish Request
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground mt-4">
                    By publishing, you agree to our terms and community guidelines.
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </MotionWrapper>
      </div>
    </div>
  );
}
