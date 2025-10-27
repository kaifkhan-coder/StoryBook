
function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}


let audioContext: AudioContext | null = null;
let currentSource: AudioBufferSourceNode | null = null;

export const playAudio = async (base64Audio: string): Promise<void> => {
    if (currentSource) {
        try {
            currentSource.stop();
        } catch (e) {
            // Ignore errors if source is already stopped
        }
    }
    
    if (!audioContext || audioContext.state === 'closed') {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }

    if(audioContext.state === 'suspended') {
        await audioContext.resume();
    }

    try {
        const decodedData = decode(base64Audio);
        const audioBuffer = await decodeAudioData(decodedData, audioContext, 24000, 1);

        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        
        return new Promise((resolve) => {
             source.onended = () => {
                if (currentSource === source) {
                    currentSource = null;
                }
                resolve();
            };
            source.start(0);
            currentSource = source;
        });

    } catch (error) {
        console.error("Failed to play audio", error);
    }
};

export const stopAudio = () => {
    if (currentSource) {
        try {
            currentSource.stop();
            currentSource = null;
        } catch (e) {
             console.error("Error stopping audio", e);
        }
    }
};
