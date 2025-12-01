'use client';

import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ShareButtonProps {
    title: string;
    text: string;
    url?: string;
    className?: string;
}

export default function ShareButton({ title, text, url, className }: ShareButtonProps) {
    const handleShare = async () => {
        const shareData = {
            title,
            text,
            url: url || window.location.href,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
                toast.success('Shared successfully!');
            } catch (err) {
                console.error('Error sharing:', err);
            }
        } else {
            // Fallback to clipboard
            try {
                await navigator.clipboard.writeText(`${title}\n${text}\n${shareData.url}`);
                toast.success('Link copied to clipboard!');
            } catch (err) {
                toast.error('Failed to copy to clipboard');
            }
        }
    };

    return (
        <Button
            variant="outline"
            size="sm"
            className={className}
            onClick={handleShare}
        >
            <Share2 className="w-4 h-4 mr-2" />
            Share
        </Button>
    );
}
