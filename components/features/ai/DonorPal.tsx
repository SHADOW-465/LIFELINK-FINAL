'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Bot, X, Send, User } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

type Message = {
    id: string;
    text: string;
    sender: 'user' | 'ai';
};

const FAQ_KNOWLEDGE_BASE = [
    { keywords: ['how often', 'frequency', 'wait'], answer: "You can donate whole blood every 56 days (8 weeks). Platelets can be donated every 7 days, up to 24 times a year." },
    { keywords: ['pain', 'hurt', 'painful'], answer: "Most donors feel only a quick pinch when the needle is inserted. The donation itself is painless." },
    { keywords: ['eat', 'food', 'diet'], answer: "Eat a healthy meal rich in iron and drink plenty of fluids before donating. Avoid fatty foods." },
    { keywords: ['sick', 'cold', 'flu'], answer: "You should wait until you are fully recovered and symptom-free before donating." },
    { keywords: ['age', 'old', 'young'], answer: "You must be at least 17 years old (16 with parental consent in some areas) to donate." },
    { keywords: ['weight', 'heavy'], answer: "You must weigh at least 110 lbs (50 kg) to be eligible for whole blood donation." },
    { keywords: ['location', 'where'], answer: "You can find nearby donation centers in the 'Schedule' tab or by checking the 'Requests' page for drives." },
];

export default function DonorPal() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', text: "Hi! I'm DonorPal. Ask me anything about blood donation!", sender: 'ai' }
    ]);
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (!inputText.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), text: inputText, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInputText('');

        // Simple keyword matching for MVP AI
        setTimeout(() => {
            const lowerInput = inputText.toLowerCase();
            let response = "I'm not sure about that. You can check the 'Schedule' tab to contact a center directly.";

            for (const item of FAQ_KNOWLEDGE_BASE) {
                if (item.keywords.some(k => lowerInput.includes(k))) {
                    response = item.answer;
                    break;
                }
            }

            setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), text: response, sender: 'ai' }]);
        }, 600);
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-20 right-4 z-50 w-80 md:w-96 shadow-2xl"
                    >
                        <Card className="border-none shadow-lg overflow-hidden">
                            <CardHeader className="bg-red-600 text-white p-4 flex flex-row items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Bot className="w-6 h-6" />
                                    <CardTitle className="text-lg">DonorPal AI</CardTitle>
                                </div>
                                <Button variant="ghost" size="icon" className="text-white hover:bg-red-700" onClick={() => setIsOpen(false)}>
                                    <X className="w-5 h-5" />
                                </Button>
                            </CardHeader>
                            <CardContent className="p-0 h-96 flex flex-col bg-white dark:bg-card">
                                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                    {messages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.sender === 'user'
                                                        ? 'bg-red-600 text-white rounded-tr-none'
                                                        : 'bg-gray-100 dark:bg-gray-800 text-foreground rounded-tl-none'
                                                    }`}
                                            >
                                                {msg.text}
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>
                                <div className="p-3 border-t flex gap-2">
                                    <Input
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                        placeholder="Ask a question..."
                                        className="flex-1"
                                    />
                                    <Button size="icon" className="bg-red-600 hover:bg-red-700" onClick={handleSend}>
                                        <Send className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {!isOpen && (
                <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-24 right-4 z-40 bg-red-600 text-white p-4 rounded-full shadow-lg hover:bg-red-700 transition-colors"
                >
                    <Bot className="w-6 h-6" />
                </motion.button>
            )}
        </>
    );
}
