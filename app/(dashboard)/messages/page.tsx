'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from "@/convex/_generated/dataModel";
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, MessageSquare, ArrowLeft } from 'lucide-react';
import MotionWrapper from '@/components/ui/MotionWrapper';

export default function MessagesPage() {
    const { user } = useUser();
    const [activeConversation, setActiveConversation] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState('');

    const conversations = useQuery(api.messages.getConversations, { userId: user?.id || '' });
    const messages = useQuery(api.messages.getMessages, activeConversation ? { conversationId: activeConversation as Id<"conversations"> } : "skip");
    const sendMessage = useMutation(api.messages.sendMessage);

    const handleSend = async () => {
        if (!newMessage.trim() || !activeConversation || !user?.id) return;

        await sendMessage({
            conversationId: activeConversation as Id<"conversations">,
            senderId: user.id,
            content: newMessage,
            type: 'text'
        });
        setNewMessage('');
    };

    if (activeConversation) {
        return (
            <div className="flex flex-col h-[calc(100vh-80px)]">
                <div className="bg-white dark:bg-card p-4 shadow-sm flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => setActiveConversation(null)}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                            <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <span className="font-semibold">Chat</span>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages?.map((msg) => (
                        <div
                            key={msg._id}
                            className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[80%] p-3 rounded-2xl ${msg.senderId === user?.id
                                    ? 'bg-red-600 text-white rounded-tr-none'
                                    : 'bg-gray-100 dark:bg-gray-800 rounded-tl-none'
                                    }`}
                            >
                                <p className="text-sm">{msg.content}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-4 bg-white dark:bg-card border-t">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSend();
                        }}
                        className="flex gap-2"
                    >
                        <Input
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1"
                        />
                        <Button type="submit" size="icon" className="bg-red-600 hover:bg-red-700">
                            <Send className="w-4 h-4" />
                        </Button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="pb-20">
            <div className="bg-white dark:bg-card pt-8 pb-6 px-4 rounded-b-3xl shadow-sm mb-6">
                <h1 className="text-2xl font-bold text-foreground">Messages</h1>
            </div>

            <div className="px-4 space-y-3">
                {conversations?.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">
                        <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>No messages yet</p>
                        <p className="text-sm mt-2">Start a conversation from a request!</p>
                    </div>
                ) : (
                    conversations?.map((conv) => (
                        <MotionWrapper key={conv._id}>
                            <Card
                                className="border-none shadow-sm mb-2 active:scale-95 transition-transform"
                                onClick={() => setActiveConversation(conv._id)}
                            >
                                <CardContent className="p-4 flex items-center gap-4">
                                    <Avatar>
                                        <AvatarFallback>U</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <p className="font-semibold">User</p>
                                        <p className="text-sm text-muted-foreground truncate">
                                            Tap to view conversation
                                        </p>
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                        {new Date(conv.lastMessageAt).toLocaleDateString()}
                                    </span>
                                </CardContent>
                            </Card>
                        </MotionWrapper>
                    ))
                )}
            </div>
        </div>
    );
}
