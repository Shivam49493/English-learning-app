import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';

function Sentence() {
  const [sentences, setSentences] = useState([]);
  const [currentSentence, setCurrentSentence] = useState(null);
  const [userTranslation, setUserTranslation] = useState('');
  const [jumbledWords, setJumbledWords] = useState([]);
  const [userArrangement, setUserArrangement] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const API_BASE_URL = 'http://localhost:5000';
  
  const fetchSentences = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/sentences/getsentences`);
      setSentences(response.data);
      console.log(response)
      if (response.data.length > 0) {
        setCurrentSentence(response.data[0]);
        createJumbledWords(response.data[0].english); // Fixed: was using index 3 instead of 0
      }
    } catch (err) {
      console.error('Error fetching sentences:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSentences();
  }, []); // Removed fetchSentences dependency

  const createJumbledWords = (sentence) => {
    if (!sentence) return;
    const words = sentence.split(' ');
    const jumbled = [...words].sort(() => Math.random() - 0.5);
    setJumbledWords(jumbled);
  };

  const handleCheckTranslation = () => {
    if (!currentSentence) return;
    setIsCorrect(userTranslation.toLowerCase().trim() === currentSentence.english.toLowerCase().trim());
  };

  const handleCheckArrangement = () => {
    if (!currentSentence) return;
    setIsCorrect(userArrangement.toLowerCase().trim() === currentSentence.english.toLowerCase().trim());
  };

  const handleNextSentence = () => {
    if (sentences.length === 0) return;
    
    const currentIndex = sentences.findIndex(s => s._id === currentSentence._id);
    const nextIndex = (currentIndex + 1) % sentences.length;
    const nextSentence = sentences[nextIndex];
    
    setCurrentSentence(nextSentence);
    createJumbledWords(nextSentence.english);
    setUserTranslation('');
    setUserArrangement('');
    setIsCorrect(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center text-blue-600 mb-8">Sentence Learning Section</h2>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-lg text-gray-600">Loading sentences...</p>
        </div>
      ) : currentSentence ? (
        <>
          <div className="bg-blue-50 p-6 rounded-lg mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Hindi Sentence:</h3>
            <p className="text-2xl font-bold text-hindi mb-4">{currentSentence.hindi}</p>
            
            {currentSentence.imageUrl && (
              <div className="flex justify-center mb-4">
                <img 
                  src={currentSentence.imageUrl} 
                  alt="Visual aid" 
                  className="max-w-full h-64 object-cover rounded-lg shadow-md"
                />
              </div>
            )}
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Translate to English</h3>
              <textarea
                value={userTranslation}
                onChange={(e) => setUserTranslation(e.target.value)}
                placeholder="Your English translation..."
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
                rows="3"
              />
              <button 
                onClick={handleCheckTranslation}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
              >
                Check Translation
              </button>
              {isCorrect !== null && (
                <p className={`mt-3 text-lg font-semibold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  {isCorrect ? '✅ Correct! Well done!' : '❌ Incorrect, try again!'}
                </p>
              )}
            </div>
            
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Jumbled Words</h3>
              <p className="text-gray-600 mb-4">Arrange these words to form the correct sentence:</p>
              <div className="flex flex-wrap gap-2 mb-4 p-3 bg-white rounded-lg border border-gray-300">
                {jumbledWords.map((word, index) => (
                  <span key={index} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                    {word}
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={userArrangement}
                onChange={(e) => setUserArrangement(e.target.value)}
                placeholder="Type the correct sentence here..."
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button 
                onClick={handleCheckArrangement}
                className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
              >
                Check Arrangement
              </button>
            </div>
          </div>
          
          {currentSentence.grammarPoints && currentSentence.grammarPoints.length > 0 && (
            <div className="bg-yellow-50 p-6 rounded-lg mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Grammar Points</h3>
              <ul className="list-disc list-inside space-y-2">
                {currentSentence.grammarPoints.map((point, index) => (
                  <li key={index} className="text-gray-700">{point}</li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="flex justify-center">
            <button 
              onClick={handleNextSentence}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg transition duration-200"
            >
              Next Sentence
            </button>
          </div>
        </>
      ) : (
        <div className="text-center p-8">
          <p className="text-lg text-gray-600">No sentences available</p>
          <button 
            onClick={fetchSentences}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}

export default Sentence;