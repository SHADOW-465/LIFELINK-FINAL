'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Quote, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const stories = [
    {
        id: 1,
        name: "Sarah Jenkins",
        role: "Recipient",
        content: "I never thought I'd need blood until my surgery complications. Thanks to a donor I never met, I'm here today to watch my daughter grow up. LifeLink made it possible.",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=faces"
    },
    {
        id: 2,
        name: "Michael Chen",
        role: "Regular Donor",
        content: "Donating blood used to feel like a chore. With LifeLink, I can see exactly when my blood is used and who it helps. It's incredibly rewarding to know I'm making a real difference.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces"
    },
    {
        id: 3,
        name: "Dr. Emily Rodriguez",
        role: "ER Surgeon",
        content: "In the ER, every second counts. LifeLink has revolutionized how quickly we can source rare blood types during emergencies. It's literally saving lives every single day.",
        image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=faces"
    }
];

export default function ImpactStories() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            nextStory();
        }, 5000);
        return () => clearInterval(timer);
    }, [currentIndex]);

    const nextStory = () => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % stories.length);
    };

    const prevStory = () => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length);
    };

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    };

    return (
        <div className="w-full max-w-4xl mx-auto px-4">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">Real Stories, Real Impact</h2>
                <p className="text-muted-foreground">See how the LifeLink community is changing lives.</p>
            </div>

            <div className="relative h-[400px] md:h-[300px] flex items-center justify-center">
                <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                        key={currentIndex}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 }
                        }}
                        className="absolute w-full"
                    >
                        <Card className="bg-white/50 backdrop-blur-sm border-none shadow-xl overflow-hidden">
                            <CardContent className="p-8 md:p-12">
                                <div className="flex flex-col md:flex-row items-center gap-8">
                                    <div className="relative shrink-0">
                                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                                            <img
                                                src={stories[currentIndex].image}
                                                alt={stories[currentIndex].name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-full shadow-md">
                                            <Quote className="w-4 h-4" />
                                        </div>
                                    </div>

                                    <div className="flex-1 text-center md:text-left">
                                        <p className="text-lg md:text-xl text-gray-700 italic mb-6 leading-relaxed">
                                            &quot;{stories[currentIndex].content}&quot;
                                        </p>
                                        <div>
                                            <h3 className="text-xl font-bold text-foreground">{stories[currentIndex].name}</h3>
                                            <p className="text-primary font-medium">{stories[currentIndex].role}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="flex justify-center gap-4 mt-8">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={prevStory}
                    className="rounded-full hover:bg-primary hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <div className="flex items-center gap-2">
                    {stories.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setDirection(index > currentIndex ? 1 : -1);
                                setCurrentIndex(index);
                            }}
                            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-primary w-8' : 'bg-gray-300 hover:bg-primary/50'
                                }`}
                        />
                    ))}
                </div>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={nextStory}
                    className="rounded-full hover:bg-primary hover:text-white transition-colors"
                >
                    <ArrowRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
