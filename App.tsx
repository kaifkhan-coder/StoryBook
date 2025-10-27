
import React, { useState, useCallback, useEffect } from 'react';
import type { StoryPage } from './types';
import { generateStory, generateImage, generateSpeech } from './services/geminiService';
import StoryPrompt from './components/StoryPrompt';
import StoryViewer from './components/StoryViewer';
import LoadingOverlay from './components/LoadingOverlay';
import { playAudio, stopAudio } from './utils/audio';

const loadingMessages = [
    "Mixing colors for our illustrations...",
    "Gathering magical words...",
    "Waking up the story characters...",
    "Finding the perfect storytelling voice...",
    "Turning imagination into pictures...",
];

export default function App() {
    const [storyIdea, setStoryIdea] = useState<string>('');
    const [storyPages, setStoryPages] = useState<StoryPage[]>([]);
    const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadingMessage, setLoadingMessage] = useState<string>(loadingMessages[0]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isLoading) {
            const interval = setInterval(() => {
                setLoadingMessage(prev => {
                    const currentIndex = loadingMessages.indexOf(prev);
                    const nextIndex = (currentIndex + 1) % loadingMessages.length;
                    return loadingMessages[nextIndex];
                });
            }, 2500);
            return () => clearInterval(interval);
        }
    }, [isLoading]);

    const handleCreateStory = useCallback(async (prompt: string) => {
        setIsLoading(true);
        setError(null);
        setStoryPages([]);
        setCurrentPageIndex(0);
        setStoryIdea(prompt);

        try {
            setLoadingMessage("Dreaming up a wonderful story...");
            const pages = await generateStory(prompt);
            setStoryPages(pages);
            await loadPageAssets(0, pages);
        } catch (err) {
            console.error(err);
            setError('Oh no! We couldn\'t create the story. Please try another idea.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const loadPageAssets = async (index: number, pages: StoryPage[]) => {
        if (pages[index] && (!pages[index].imageUrl || !pages[index].audioData)) {
            setIsLoading(true);
            try {
                setLoadingMessage("Painting a beautiful picture...");
                const imageUrl = await generateImage(pages[index].imagePrompt);
                
                setLoadingMessage("Warming up our storytelling voice...");
                const audioData = await generateSpeech(pages[index].pageText);
                
                const updatedPages = [...pages];
                updatedPages[index] = { ...updatedPages[index], imageUrl, audioData };
                setStoryPages(updatedPages);
                
                if (audioData) {
                    await playAudio(audioData);
                }
            } catch (err) {
                console.error(err);
                setError('A little hiccup! We couldn\'t load this page. Let\'s try another.');
            } finally {
                setIsLoading(false);
            }
        } else if (pages[index]?.audioData) {
            await playAudio(pages[index].audioData);
        }
    };

    const handleNextPage = () => {
        if (currentPageIndex < storyPages.length - 1) {
            const newIndex = currentPageIndex + 1;
            setCurrentPageIndex(newIndex);
            stopAudio();
            loadPageAssets(newIndex, storyPages);
        }
    };
    
    const handlePreviousPage = () => {
        if (currentPageIndex > 0) {
            const newIndex = currentPageIndex - 1;
            setCurrentPageIndex(newIndex);
            stopAudio();
            loadPageAssets(newIndex, storyPages);
        }
    };
    
    const handleReadAloud = async () => {
        const page = storyPages[currentPageIndex];
        if (page && page.audioData) {
            await playAudio(page.audioData);
        }
    };

    const handleStartOver = () => {
        stopAudio();
        setStoryPages([]);
        setCurrentPageIndex(0);
        setStoryIdea('');
        setError(null);
    };

    return (
        <div className="bg-gradient-to-br from-yellow-100 to-pink-200 min-h-screen w-full flex flex-col items-center justify-center p-4 text-gray-800">
            <div className="w-full max-w-4xl mx-auto">
                <header className="text-center mb-6">
                    <h1 className="text-4xl md:text-6xl font-bold text-pink-500 drop-shadow-lg">Storybook Illustrator</h1>
                    <p className="text-lg text-yellow-700 mt-2">Where your words become wonderful worlds!</p>
                </header>

                {isLoading && <LoadingOverlay message={loadingMessage} />}

                <main className="relative">
                    {error && (
                        <div className="bg-red-200 border-2 border-red-400 text-red-700 p-4 rounded-lg text-center mb-4">
                            <p>{error}</p>
                        </div>
                    )}

                    {storyPages.length === 0 ? (
                        <StoryPrompt onCreateStory={handleCreateStory} disabled={isLoading} />
                    ) : (
                        <StoryViewer
                            page={storyPages[currentPageIndex]}
                            currentPage={currentPageIndex + 1}
                            totalPages={storyPages.length}
                            onNext={handleNextPage}
                            onPrevious={handlePreviousPage}
                            onReadAloud={handleReadAloud}
                            onStartOver={handleStartOver}
                        />
                    )}
                </main>
            </div>
        </div>
    );
}
