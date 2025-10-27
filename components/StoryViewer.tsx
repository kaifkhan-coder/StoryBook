
import React from 'react';
import type { StoryPage } from '../types';
import { ArrowLeftIcon, ArrowRightIcon, SoundIcon, StartOverIcon } from './icons';

interface StoryViewerProps {
    page: StoryPage;
    currentPage: number;
    totalPages: number;
    onNext: () => void;
    onPrevious: () => void;
    onReadAloud: () => void;
    onStartOver: () => void;
}

const StoryViewer: React.FC<StoryViewerProps> = ({ page, currentPage, totalPages, onNext, onPrevious, onReadAloud, onStartOver }) => {
    return (
        <div className="bg-white/80 backdrop-blur-md p-4 sm:p-6 rounded-2xl shadow-xl border-2 border-white w-full max-w-4xl mx-auto flex flex-col gap-4">
            <div className="aspect-square w-full bg-yellow-100 rounded-lg overflow-hidden border-4 border-white shadow-inner flex items-center justify-center">
                {page?.imageUrl ? (
                    <img src={page.imageUrl} alt={page.imagePrompt} className="w-full h-full object-cover" />
                ) : (
                    <div className="text-yellow-600">Painting...</div>
                )}
            </div>

            <div className="bg-white/50 p-4 rounded-lg text-center">
                <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">{page?.pageText || "Loading story..."}</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                     <button
                        onClick={onStartOver}
                        className="p-3 bg-red-400 text-white rounded-full hover:bg-red-500 transition-colors transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-red-300/50"
                        title="Start Over"
                    >
                       <StartOverIcon />
                    </button>
                    <button
                        onClick={onReadAloud}
                        disabled={!page?.audioData}
                        className="p-3 bg-yellow-400 text-white rounded-full hover:bg-yellow-500 transition-colors transform hover:scale-110 disabled:bg-gray-300 disabled:scale-100 focus:outline-none focus:ring-4 focus:ring-yellow-300/50"
                        title="Read Aloud"
                    >
                       <SoundIcon />
                    </button>
                </div>
                
                <div className="flex items-center gap-4">
                    <button
                        onClick={onPrevious}
                        disabled={currentPage <= 1}
                        className="p-3 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors transform hover:scale-110 disabled:bg-gray-300 disabled:scale-100 focus:outline-none focus:ring-4 focus:ring-pink-300/50"
                        title="Previous Page"
                    >
                        <ArrowLeftIcon />
                    </button>
                    <div className="font-bold text-pink-600 text-lg w-20 text-center">
                        Page {currentPage} / {totalPages}
                    </div>
                    <button
                        onClick={onNext}
                        disabled={currentPage >= totalPages}
                        className="p-3 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors transform hover:scale-110 disabled:bg-gray-300 disabled:scale-100 focus:outline-none focus:ring-4 focus:ring-pink-300/50"
                        title="Next Page"
                    >
                        <ArrowRightIcon />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StoryViewer;
