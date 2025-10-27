
import React from 'react';
import { SparklesIcon } from './icons';

interface LoadingOverlayProps {
    message: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message }) => {
    return (
        <div className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center z-50 text-white">
            <div className="animate-spin text-pink-400 mb-4">
                <SparklesIcon className="w-16 h-16" />
            </div>
            <p className="text-2xl font-bold animate-pulse">{message}</p>
        </div>
    );
};

export default LoadingOverlay;
