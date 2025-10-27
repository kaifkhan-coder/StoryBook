
import { GoogleGenAI, Type, Modality } from "@google/genai";
import type { StoryPage } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const storyPageSchema = {
  type: Type.OBJECT,
  properties: {
    pageText: {
      type: Type.STRING,
      description: "The text for this page of the story. It should be a short, engaging paragraph suitable for a young child.",
    },
    imagePrompt: {
      type: Type.STRING,
      description: "A detailed, whimsical, and kid-friendly visual prompt for an illustration based on the text. Style: vibrant colors, gentle characters, storybook illustration.",
    },
  },
  required: ["pageText", "imagePrompt"],
};

export async function generateStory(prompt: string): Promise<StoryPage[]> {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Create a short, magical story for a 5-year-old child about ${prompt}. The story must have exactly 5 pages. Respond with ONLY a JSON array.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: storyPageSchema,
                },
            },
        });
        
        const jsonText = response.text.trim();
        const pages = JSON.parse(jsonText);
        
        if (!Array.isArray(pages) || pages.length === 0) {
            throw new Error("Generated story is not in the expected format.");
        }
        return pages;
    } catch (error) {
        console.error("Error generating story:", error);
        throw new Error("Failed to generate story from API.");
    }
}

export async function generateImage(prompt: string): Promise<string> {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '1:1',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        }
        throw new Error("No image was generated.");
    } catch (error) {
        console.error("Error generating image:", error);
        throw new Error("Failed to generate image from API.");
    }
}

export async function generateSpeech(text: string): Promise<string> {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: `Say with a friendly and gentle voice: ${text}` }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' },
                    },
                },
            },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64Audio) {
            return base64Audio;
        }
        throw new Error("No audio data was generated.");
    } catch (error) {
        console.error("Error generating speech:", error);
        throw new Error("Failed to generate speech from API.");
    }
}
