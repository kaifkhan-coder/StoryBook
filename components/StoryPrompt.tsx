
import React, { useState } from 'react';
import { SparklesIcon } from './icons';

interface StoryPromptProps {
    onCreateStory: (prompt: string) => void;
    disabled: boolean;
}

const examplePrompts = [
    "a friendly dragon who loves to bake cupcakes",
    "a tiny astronaut exploring a garden",
    "a magical paintbrush that brings drawings to life",
    "a squirrel who wants to fly to the moon",
];

const StoryPrompt: React.FC<StoryPromptProps> = ({ onCreateStory, disabled }) => {
    const [prompt, setPrompt] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (prompt.trim()) {
            onCreateStory(prompt.trim());
        }
    };
    
    const handleExampleClick = (example: string) => {
        setPrompt(example);
        onCreateStory(example);
    }

    return (
        <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-pink-200">
            <h2 className="text-2xl font-bold text-center text-pink-600 mb-4">What should our story be about?</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., a brave little boat..."
                    className="w-full px-4 py-3 border-2 border-yellow-300 rounded-full focus:outline-none focus:ring-4 focus:ring-yellow-400/50 transition duration-300 text-lg"
                    disabled={disabled}
                />
                <button
                    type="submit"
                    disabled={disabled || !prompt.trim()}
                    className="mt-4 w-full flex items-center justify-center gap-2 bg-pink-500 text-white font-bold py-3 px-6 rounded-full hover:bg-pink-600 focus:outline-none focus:ring-4 focus:ring-pink-400/50 transform hover:scale-105 transition-all duration-300 disabled:bg-gray-400 disabled:scale-100"
                >
                    <SparklesIcon />
                    Create My Story!
                </button>
            </form>
             <div className="mt-6 text-center">
                <p className="text-yellow-800 font-semibold mb-3">Or try an example:</p>
                <div className="flex flex-wrap justify-center gap-2">
                    {examplePrompts.map((p, i) => (
                        <button key={i} onClick={() => handleExampleClick(p)} disabled={disabled} className="bg-yellow-200 text-yellow-800 text-sm px-3 py-1 rounded-full hover:bg-yellow-300 transition-colors disabled:bg-gray-300">
                            {p}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StoryPrompt;
