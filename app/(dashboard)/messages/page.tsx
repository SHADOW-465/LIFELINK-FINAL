'use client';

import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Phone, MoreVertical, Search, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Id } from '@/convex/_generated/dataModel';

export default function MessagesPage() {
    const { user } = useUser();
    const [selectedConversation, setSelectedConversation] = useState<Id<"conversations"> | null>(null);
    const [newMessage, setNewMessage] = useState('');

    // Fetch conversations
    const conversations = useQuery(api.messages.getConversations);

    // Fetch messages for selected conversation
    const messages = useQuery(api.messages.getMessages,
        selectedConversation ? { conversationId: selectedConversation } : "skip"
    );

    const sendMessage = useMutation(api.messages.sendMessage);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom of chat
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConversation) return;

        try {
            await sendMessage({
                conversationId: selectedConversation,
                content: newMessage,
                type: 'text'
            });
            setNewMessage('');
        } catch (error) {
            console.error("Failed to send message", error);
        }
    };

    const selectedConvDetails = conversations?.find(c => c._id === selectedConversation);

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-4 pb-20 md:pb-0">
            {/* Conversations List - Hidden on mobile if chat is selected */}
            <Card className={cn(
                "flex-1 md:flex-none md:w-80 border-none shadow-sm flex flex-col h-full bg-white dark:bg-card",
                selectedConversation ? "hidden md:flex" : "flex"
            )}>
                <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                    <h2 className="text-xl font-bold mb-4">Messages</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="Search messages..." className="pl-9 bg-secondary/50 border-none" />
                    </div>
                </div>
                <ScrollArea className="flex-1">
                    <div className="p-2 space-y-2">
                        {conversations?.length === 0 && (
                            <div className="text-center p-8 text-muted-foreground">
                                No conversations yet. Start a chat from a request!
                            </div>
                        )}
                        {conversations?.map((conv) => (
                            <div
                                key={conv._id}
                                onClick={() => setSelectedConversation(conv._id)}
                                className={cn(
                                    "p-3 rounded-xl cursor-pointer transition-colors flex items-center gap-3",
                                    selectedConversation === conv._id
                                        ? "bg-red-50 dark:bg-red-900/20"
                                        : "hover:bg-gray-50 dark:hover:bg-gray-800"
                                )}
                            >
                                <Avatar>
                                    <AvatarFallback className="bg-red-100 text-red-600">
                                        {conv.otherUser.fullName.substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 overflow-hidden">
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="font-semibold truncate">{conv.otherUser.fullName}</h3>
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(conv.lastMessageAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground truncate">
                                        Click to view messages
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </Card>

            {/* Chat Area */}
            <Card className={cn(
                "flex-[2] border-none shadow-sm flex flex-col h-full overflow-hidden bg-white dark:bg-card",
                !selectedConversation ? "hidden md:flex" : "flex"
            )}>
                {selectedConversation ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-card z-10">
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="md:hidden"
                                    onClick={() => setSelectedConversation(null)}
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </Button>
                                <Avatar className="h-10 w-10">
                                    <AvatarFallback className="bg-red-100 text-red-600">
                                        {selectedConvDetails?.otherUser.fullName.substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-bold leading-none">{selectedConvDetails?.otherUser.fullName}</h3>
                                    <span className="text-xs text-green-500 font-medium">Online</span>
                                </div>
                            </div>
                            <div className="flex gap-1">
                                <Button variant="ghost" size="icon">
                                    <Phone className="w-5 h-5 text-muted-foreground" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                    <MoreVertical className="w-5 h-5 text-muted-foreground" />
                                </Button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div
                            className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-black/20"
                            ref={scrollRef}
                        >
                            {messages?.length === 0 && (
                                <div className="text-center text-muted-foreground my-10">
                                    No messages yet. Say hello!
                                </div>
                            )}
                            {messages?.map((msg) => {
                                const isMe = msg.senderId === user?.id;
                                return (
                                    <div
                                        key={msg._id}
                                        className={cn(
                                            "flex w-full",
                                            isMe ? "justify-end" : "justify-start"
                                        )}
                                    >
                                        <div className={cn(
                                            "max-w-[80%] rounded-2xl px-4 py-2 shadow-sm text-sm",
                                            isMe
                                                ? "bg-primary text-primary-foreground rounded-tr-none"
                                                : "bg-white dark:bg-gray-800 text-foreground rounded-tl-none border border-gray-100 dark:border-gray-700"
                                        )}>
                                            {msg.content}
                                            <div className={cn(
                                                "text-[10px] mt-1 text-right opacity-70",
                                                isMe ? "text-primary-foreground" : "text-muted-foreground"
                                            )}>
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white dark:bg-card border-t border-gray-100 dark:border-gray-800">
                            <form onSubmit={handleSendMessage} className="flex gap-2">
                                <Input
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="bg-secondary/50 border-none rounded-full px-4 focus-visible:ring-primary"
                                />
                                <Button
                                    type="submit"
                                    size="icon"
                                    className="rounded-full bg-primary hover:bg-primary/90 shadow-lg shadow-red-200 dark:shadow-none"
                                    disabled={!newMessage.trim()}
                                >
                                    <Send className="w-4 h-4" />
                                </Button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                            <Send className="w-8 h-8 opacity-50" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                        <p className="text-sm max-w-xs text-center">
                            Choose a chat from the list to start messaging with donors or requesters.
                        </p>
                    </div>
                )}
            </Card>
        </div>
    );
}
