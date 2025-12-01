'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Plus, Filter } from 'lucide-react';

export default function SchedulePage() {
  const upcomingEvents = [
    {
      id: 1,
      title: "Community Blood Drive",
      date: "2024-01-15",
      time: "9:00 AM - 5:00 PM",
      location: "City Hospital",
      type: "Blood Drive",
      status: "upcoming"
    },
    {
      id: 2,
      title: "Emergency Blood Collection",
      date: "2024-01-12",
      time: "2:00 PM - 6:00 PM",
      location: "Red Cross Center",
      type: "Emergency",
      status: "urgent"
    },
    {
      id: 3,
      title: "Mobile Blood Unit",
      date: "2024-01-10",
      time: "10:00 AM - 4:00 PM",
      location: "Downtown Plaza",
      type: "Mobile Unit",
      status: "completed"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Schedule</h1>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Event
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">2</div>
              <div className="text-sm text-gray-600">Upcoming</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">1</div>
              <div className="text-sm text-gray-600">Completed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">3</div>
              <div className="text-sm text-gray-600">Total</div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Upcoming Events</CardTitle>
            <CardDescription>
              Your scheduled blood donation events
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{event.title}</h3>
                      <Badge 
                        variant={event.status === 'urgent' ? 'destructive' : 
                                event.status === 'upcoming' ? 'default' : 'secondary'}
                      >
                        {event.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-4">
                    <Button 
                      size="sm" 
                      variant={event.status === 'urgent' ? 'default' : 'outline'}
                      className={event.status === 'urgent' ? 'bg-red-600 hover:bg-red-700' : ''}
                    >
                      {event.status === 'completed' ? 'View Details' : 'Join Event'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <CardDescription>
              Common scheduling tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <Calendar className="w-6 h-6" />
                <span>Schedule Donation</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <MapPin className="w-6 h-6" />
                <span>Find Centers</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
