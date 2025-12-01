'use client';

import { useUser } from '@clerk/nextjs';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Info, AlertTriangle, Award, MessageSquare } from 'lucide-react';
import MotionWrapper from '@/components/ui/MotionWrapper';
import { formatDistanceToNow } from 'date-fns';

export default function NotificationsPage() {
    const { user } = useUser();
    const notifications = useQuery(api.notifications.get, { userId: user?.id || '' });
    const markAllAsRead = useMutation(api.notifications.markAllAsRead);
    const markAsRead = useMutation(api.notifications.markAsRead);

    const handleMarkAllRead = () => {
        if (user?.id) {
            markAllAsRead({ userId: user.id });
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'request': return <AlertTriangle className="w-5 h-5 text-red-500" />;
            case 'badge': return <Award className="w-5 h-5 text-yellow-500" />;
            case 'message': return <MessageSquare className="w-5 h-5 text-blue-500" />;
            default: return <Info className="w-5 h-5 text-gray-500" />;
        }
    };

    return (
        <div className="pb-20">
            <div className="bg-white dark:bg-card pt-8 pb-6 px-4 rounded-b-3xl shadow-sm mb-6 sticky top-0 z-10">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
                    <Button variant="ghost" size="sm" onClick={handleMarkAllRead}>
                        Mark all read
                    </Button>
                </div>
            </div>

            <div className="px-4 space-y-3">
                {notifications?.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">
                        <Bell className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>No notifications yet</p>
                    </div>
                ) : (
                    notifications?.map((notification, index) => (
                        <MotionWrapper key={notification._id} delay={index * 0.05}>
                            <Card
                                className={`border-none shadow-sm ${!notification.isRead ? 'bg-blue-50 dark:bg-blue-900/10' : 'bg-white dark:bg-card'}`}
                                onClick={() => markAsRead({ notificationId: notification._id })}
                            >
                                <CardContent className="p-4 flex gap-4 items-start">
                                    <div className="mt-1 bg-white dark:bg-card p-2 rounded-full shadow-sm">
                                        {getIcon(notification.type)}
                                    </div>
                                    <div className="flex-1">
                                        <p className={`text-sm ${!notification.isRead ? 'font-semibold' : ''}`}>
                                            {notification.message}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                                        </p>
                                    </div>
                                    {!notification.isRead && (
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
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
