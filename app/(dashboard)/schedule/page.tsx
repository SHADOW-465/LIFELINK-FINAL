'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Clock, Calendar as CalendarIcon, Plus } from 'lucide-react';
import MotionWrapper from '@/components/ui/MotionWrapper';
import { toast } from 'sonner';

export default function SchedulePage() {
  const { user } = useUser();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [selectedCenter, setSelectedCenter] = useState<string>('');
  const [isBooking, setIsBooking] = useState(false);

  const appointments = useQuery(api.appointments.getUserAppointments, { userId: user?.id || '' });
  const bookAppointment = useMutation(api.appointments.bookAppointment);
  const cancelAppointment = useMutation(api.appointments.cancelAppointment);

  const handleBook = async () => {
    if (!date || !selectedSlot || !selectedCenter || !user?.id) return;

    setIsBooking(true);
    try {
      await bookAppointment({
        donorId: user.id,
        centerName: selectedCenter,
        date: date.getTime(), // In real app, combine date + slot time
        type: 'Whole Blood',
      });
      toast.success('Appointment booked successfully!');
      setIsBooking(false);
    } catch {
      toast.error('Failed to book appointment');
      setIsBooking(false);
    }
  };

  return (
    <div className="pb-20">
      <div className="bg-white dark:bg-card pt-8 pb-6 px-4 rounded-b-3xl shadow-sm mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-foreground">Appointments</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="rounded-full bg-red-600 hover:bg-red-700">
                <Plus className="w-4 h-4 mr-2" />
                Book New
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Schedule Donation</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Date</label>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                    disabled={(date) => date < new Date()}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Center</label>
                  <Select onValueChange={setSelectedCenter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a center" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="City Hospital Blood Bank">City Hospital Blood Bank</SelectItem>
                      <SelectItem value="Red Cross Center">Red Cross Center</SelectItem>
                      <SelectItem value="Community Health Center">Community Health Center</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Time</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM'].map((slot) => (
                      <Button
                        key={slot}
                        variant={selectedSlot === slot ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedSlot(slot)}
                      >
                        {slot}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button
                  className="w-full bg-red-600 hover:bg-red-700"
                  onClick={handleBook}
                  disabled={isBooking || !date || !selectedCenter || !selectedSlot}
                >
                  {isBooking ? 'Booking...' : 'Confirm Appointment'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="px-4 space-y-4">
        <h2 className="font-semibold text-lg">Upcoming</h2>
        {appointments?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-xl">
            <CalendarIcon className="w-10 h-10 mx-auto mb-2 opacity-20" />
            <p>No upcoming appointments</p>
          </div>
        ) : (
          appointments?.map((apt) => (
            <MotionWrapper key={apt._id}>
              <Card className="border-none shadow-sm">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-foreground">{apt.centerName}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" />
                        1.2 km away
                      </p>
                    </div>
                    <Badge variant={apt.status === 'scheduled' ? 'default' : 'secondary'}>
                      {apt.status}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-sm mb-4">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <CalendarIcon className="w-4 h-4" />
                      {new Date(apt.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      10:00 AM {/* Mock time since we only stored date timestamp */}
                    </div>
                  </div>

                  {apt.status === 'scheduled' && (
                    <Button
                      variant="outline"
                      className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => cancelAppointment({ appointmentId: apt._id })}
                    >
                      Cancel Appointment
                    </Button>
                  )}
                </CardContent>
              </Card>
            </MotionWrapper>
          ))
        )}
      </div>
    </div>
  );
}
