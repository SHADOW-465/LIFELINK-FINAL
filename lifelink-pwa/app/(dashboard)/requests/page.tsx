'use client';

import { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { FileText, Plus, Search, Filter, MapPin, Clock, User, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function RequestsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  
  const allRequests = useQuery(api.requests.getAllRequests);
  const userRequests = useQuery(api.requests.getUserRequests);

  const filteredRequests = allRequests?.filter(request => {
    const matchesSearch = request.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.hospitalName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'my' && userRequests?.some(ur => ur._id === request._id)) ||
                         (filterType === 'urgent' && !request.isFulfilled) ||
                         (filterType === 'fulfilled' && request.isFulfilled);
    
    return matchesSearch && matchesFilter;
  }) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Blood Requests</h1>
            <Link href="/requests/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Request
              </Button>
            </Link>
          </div>
          
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterType === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('all')}
              >
                All
              </Button>
              <Button
                variant={filterType === 'my' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('my')}
              >
                My Requests
              </Button>
              <Button
                variant={filterType === 'urgent' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('urgent')}
              >
                Urgent
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {allRequests?.filter(r => !r.isFulfilled).length || 0}
              </div>
              <div className="text-sm text-gray-600">Active Requests</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {allRequests?.filter(r => r.isFulfilled).length || 0}
              </div>
              <div className="text-sm text-gray-600">Fulfilled</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {userRequests?.length || 0}
              </div>
              <div className="text-sm text-gray-600">My Requests</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {allRequests?.filter(r => !r.isFulfilled && new Date(r.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)).length || 0}
              </div>
              <div className="text-sm text-gray-600">Today</div>
            </CardContent>
          </Card>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {filteredRequests.length > 0 ? (
            filteredRequests.map((request) => (
              <Card key={request._id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{request.patientName}</h3>
                        <Badge 
                          variant={request.isFulfilled ? 'default' : 'destructive'}
                          className={request.isFulfilled ? 'bg-green-600' : ''}
                        >
                          {request.isFulfilled ? 'Fulfilled' : 'Urgent'}
                        </Badge>
                        <Badge variant="outline" className="text-red-600 border-red-200">
                          {request.bloodType}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span>{request.hospitalName}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>{request.unitsRequired} units needed</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4" />
                          <span>Posted {new Date(request.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-4 flex flex-col space-y-2">
                      {!request.isFulfilled ? (
                        <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                          <AlertTriangle className="w-4 h-4 mr-1" />
                          Help Now
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" disabled>
                          Fulfilled
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || filterType !== 'all' 
                    ? 'Try adjusting your search or filter criteria'
                    : 'No blood requests available at the moment'
                  }
                </p>
                <Link href="/requests/new">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Request
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
