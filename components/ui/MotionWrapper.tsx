'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

interface MotionWrapperProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}

export default function MotionWrapper({
    children,
    className = "",
    delay = 0,
    direction = 'up'
}: MotionWrapperProps) {

    const variants = {
        hidden: {
            opacity: 0,
            y: direction === 'up' ? 20 : direction === 'down' ? -20 : 0,
            x: direction === 'left' ? 20 : direction === 'right' ? -20 : 0,
        },
        visible: {
            opacity: 1,
            y: 0,
            x: 0,
            transition: {
                duration: 0.5,
                delay: delay,
                ease: "easeOut" as const
            }
        },
        exit: {
            opacity: 0,
            transition: {
                duration: 0.3
            }
        }
    };

    if (direction === 'none') {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay }}
                className={className}
            >
                {children}
            </motion.div>
        );
    }

    return (
        <motion.div
            variants={variants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
