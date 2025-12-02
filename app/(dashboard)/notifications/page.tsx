'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Check, Info, MessageSquare, Droplet } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { Id } from '@/convex/_generated/dataModel';

export default function NotificationsPage() {
    const notifications = useQuery(api.notifications.getNotifications);
    const markAsRead = useMutation(api.notifications.markAsRead);
    const markAllAsRead = useMutation(api.notifications.markAllAsRead);

    const handleMarkAsRead = async (id: Id<"notifications">) => {
        await markAsRead({ notificationId: id });
    };

    const handleMarkAllAsRead = async () => {
        await markAllAsRead();
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'request': return <Droplet className="w-5 h-5 text-red-500" />;
            case 'message': return <MessageSquare className="w-5 h-5 text-blue-500" />;
            case 'system': return <Info className="w-5 h-5 text-gray-500" />;
            default: return <Bell className="w-5 h-5 text-yellow-500" />;
        }
    };

    return (
        <div className="space-y-6 pb-24 md:pb-0">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
                    <p className="text-muted-foreground mt-2">
                        Stay updated with your donation requests and appointments.
                    </p>
                </div>
                {notifications && notifications.length > 0 && (
                    <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
                        <Check className="w-4 h-4 mr-2" />
                        Mark all as read
                    </Button>
                )}
            </div>

            <div className="space-y-4">
                {notifications === undefined ? (
                    <div className="text-center py-10">Loading notifications...</div>
                ) : notifications.length === 0 ? (
                    <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                                <Bell className="w-6 h-6 opacity-50" />
                            </div>
                            <h3 className="font-semibold text-lg">No notifications</h3>
                            <p className="max-w-sm mt-2">
                                You&apos;re all caught up! check back later for updates on your requests and donations.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    notifications.map((notification) => (
                        <Card
                            key={notification._id}
                            className={cn(
                                "transition-colors",
                                !notification.isRead ? "bg-card border-l-4 border-l-primary" : "opacity-80"
                            )}
                        >
                            <CardContent className="p-4 flex gap-4">
                                <div className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                                    !notification.isRead ? "bg-primary/10" : "bg-muted"
                                )}>
                                    {getIcon(notification.type)}
                                </div>
                                <div className="flex-1 space-y-1">
                                    <p className={cn("text-sm", !notification.isRead && "font-medium")}>
                                        {notification.message}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                                    </p>
                                </div>
                                {!notification.isRead && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="shrink-0 h-8 w-8"
                                        onClick={() => handleMarkAsRead(notification._id)}
                                    >
                                        <div className="w-2 h-2 rounded-full bg-primary" />
                                        <span className="sr-only">Mark as read</span>
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
