import React, { useState, useRef, useEffect } from 'react';
import { Camera, Loader2, RefreshCw, Share2, Download } from 'lucide-react';

function App() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);
  const [hasCamera, setHasCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    // Check if browser supports getUserMedia
    if (!navigator.mediaDevices?.getUserMedia) {
      console.error('Browser API not supported');
      return;
    }
    setHasCamera(true);

    return () => {
      // Cleanup: stop all tracks when component unmounts
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setHasCamera(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const startAnalysis = async () => {
    setIsAnalyzing(true);
    await startCamera();

    // Simulate emotion detection
    const emotions = ['happiness', 'sadness', 'anger', 'surprise', 'neutral'];
    const interval = setInterval(() => {
      setCurrentEmotion(emotions[Math.floor(Math.random() * emotions.length)]);
    }, 2000);

    // Clear interval after 30 seconds
    setTimeout(() => {
      clearInterval(interval);
      setIsAnalyzing(false);
      stopCamera();
    }, 30000);
  };

  const getEmotionColor = (emotion: string) => {
    const colors = {
      happiness: 'bg-yellow-500',
      sadness: 'bg-blue-500',
      anger: 'bg-red-500',
      surprise: 'bg-purple-500',
      neutral: 'bg-gray-500'
    };
    return colors[emotion as keyof typeof colors] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <header className="p-6 border-b border-gray-700">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-8 h-8 text-blue-400" />
            <h1 className="text-2xl font-bold">SentiMatrix</h1>
          </div>
          <div className="flex gap-4">
            <button className="p-2 hover:bg-gray-700 rounded-full">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-gray-700 rounded-full">
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden shadow-xl mb-8">
            {isAnalyzing ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Camera className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                  <p className="text-gray-400">
                    Click "Start Analysis" to begin emotion detection
                  </p>
                </div>
              </div>
            )}
            
            {currentEmotion && (
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className={`px-4 py-2 rounded-full ${getEmotionColor(currentEmotion)} text-white font-semibold`}>
                  {currentEmotion.charAt(0).toUpperCase() + currentEmotion.slice(1)}
                </div>
                <div className="bg-black bg-opacity-50 px-4 py-2 rounded-full">
                  Confidence: 95%
                </div>
              </div>
            )}

            {isAnalyzing && (
              <div className="absolute top-4 left-4 right-4 flex items-center justify-center">
                <div className="bg-black bg-opacity-50 px-4 py-2 rounded-full flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Analyzing expressions...</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={startAnalysis}
              disabled={isAnalyzing || !hasCamera}
              className={`px-6 py-3 rounded-full font-semibold flex items-center gap-2 ${
                isAnalyzing || !hasCamera
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing
                </>
              ) : (
                <>
                  <Camera className="w-5 h-5" />
                  Start Analysis
                </>
              )}
            </button>
            
            <button
              onClick={() => {
                setCurrentEmotion(null);
                stopCamera();
                setIsAnalyzing(false);
              }}
              className="px-6 py-3 rounded-full font-semibold bg-gray-700 hover:bg-gray-600 flex items-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Reset
            </button>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Real-time Analysis</h3>
              <p className="text-gray-400">
                Advanced facial recognition powered by deep learning models for instant emotion detection.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Multiple Emotions</h3>
              <p className="text-gray-400">
                Detect various emotional states including happiness, sadness, anger, surprise, and neutral.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">High Accuracy</h3>
              <p className="text-gray-400">
                Leveraging state-of-the-art AI models for precise emotion classification and analysis.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;