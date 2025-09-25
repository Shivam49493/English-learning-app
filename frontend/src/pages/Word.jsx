import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react';

function Word() {
    const [commonWords, setCommonWords] = useState([]);
    const [englishWord, setEnglishWord] = useState('');
    const [matchedWord, setMatchedWord] = useState(null);
    const [loading, setLoading] = useState(false);
    const [quizMode, setQuizMode] = useState(false);
    const [currentQuizWord, setCurrentQuizWord] = useState(null);
    const [options, setOptions] = useState([]);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState('');
    const API_BASE_URL = 'http://localhost:5000';

    useEffect(() => {
        fetchCommonWords();
    }, []);

    const fetchCommonWords = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/api/words/common`);
            setCommonWords(response.data);
        } catch (err) {
            console.error('Error fetching words:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleMatchWord = async (e) => {
        e.preventDefault();
        if (!englishWord.trim()) return;
        
        try {
            setLoading(true);
            const response = await axios.post(`${API_BASE_URL}/api/words/match`, {
                englishWord: englishWord.trim()
            });
            setMatchedWord(response.data);
            setFeedback('');
        } catch (err) {
            console.error('Error matching word:', err);
            setFeedback('Word not found. Please try another word.');
        } finally {
            setLoading(false);
        }
    };

    const startQuiz = async (partOfSpeech = 'noun') => {
        try {
            setLoading(true);
            setQuizMode(true);
            setScore(0);
            
            const response = await axios.get(`${API_BASE_URL}/api/words/quiz`, {
                params: { partOfSpeech }
            });
            
            setCurrentQuizWord(response.data.word);
            
            const optionsResponse = await axios.get(`${API_BASE_URL}/api/words/options`, {
                params: {
                    correctId: response.data.word._id,
                    partOfSpeech
                }
            });
            
            setOptions(optionsResponse.data);
            setFeedback('');
        } catch (err) {
            console.error('Error starting quiz:', err);
            setFeedback('Failed to start quiz. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const checkAnswer = (selectedHindi) => {
        if (selectedHindi === currentQuizWord.hindi) {
            setScore(score + 1);
            setFeedback('Correct! 🎉');
        } else {
            setFeedback(`Incorrect. The correct answer was: ${currentQuizWord.hindi}`);
        }
        
        setTimeout(() => {
            getNewQuizWord();
        }, 1500);
    };

    const getNewQuizWord = async () => {
        try {
            const partOfSpeech = currentQuizWord?.partOfSpeech || 'noun';
            const response = await axios.get(`${API_BASE_URL}/api/words/quiz`, {
                params: { partOfSpeech }
            });
            
            setCurrentQuizWord(response.data.word);
            
            const optionsResponse = await axios.get(`${API_BASE_URL}/api/words/options`, {
                params: {
                    correctId: response.data.word._id,
                    partOfSpeech
                }
            });
            
            setOptions(optionsResponse.data);
            setFeedback('');
        } catch (err) {
            console.error('Error getting quiz word:', err);
            setFeedback('Failed to load next question. Please try again.');
        }
    };

    const endQuiz = () => {
        setQuizMode(false);
        setScore(0);
        setFeedback('');
    };

    if (!quizMode) {
        return (
            <div className="max-w-6xl mx-auto p-6 bg-white min-h-screen">
                <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">Word Learning Section</h1>
                
                {/* Quiz Start Section */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Start a Quiz</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                        {['noun', 'verb', 'adjective', 'interjection', 'adverb', 'preposition'].map((pos) => (
                            <button
                                key={pos}
                                onClick={() => startQuiz(pos)}
                                disabled={loading}
                                className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium py-3 px-4 rounded-lg transition duration-200 capitalize"
                            >
                                {pos}s
                            </button>
                        ))}
                    </div>
                </div>

                {/* Search Form */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 shadow-sm">
                    <form onSubmit={handleMatchWord} className="flex flex-col md:flex-row gap-4">
                        <input
                            type="text"
                            value={englishWord}
                            onChange={(e) => setEnglishWord(e.target.value)}
                            placeholder="Enter English word to find Hindi meaning..."
                            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
                        >
                            {loading ? 'Searching...' : 'Find Meaning'}
                        </button>
                    </form>
                </div>

                {/* Feedback */}
                {feedback && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                        <p className="text-yellow-800">{feedback}</p>
                    </div>
                )}

                {/* Matched Word Display */}
                {matchedWord && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">{matchedWord.english}</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-lg"><span className="font-semibold">Hindi:</span> {matchedWord.hindi}</p>
                                <p className="text-lg"><span className="font-semibold">Pronunciation:</span> {matchedWord.pronunciation}</p>
                                <p className="text-lg"><span className="font-semibold">Part of Speech:</span> 
                                    <span className="capitalize"> {matchedWord.partOfSpeech}</span>
                                </p>
                            </div>
                            {matchedWord.examples && matchedWord.examples.length > 0 && (
                                <div>
                                    <h4 className="font-semibold text-lg mb-2">Examples:</h4>
                                    <ul className="list-disc list-inside space-y-1">
                                        {matchedWord.examples.map((example, i) => (
                                            <li key={i} className="text-gray-700">{example}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Common Words Table */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">20 Most Common Words</h3>
                    {loading ? (
                        <div className="flex justify-center items-center h-40">
                            <p className="text-lg text-gray-600">Loading words...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">English</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Hindi</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Pronunciation</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Part of Speech</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {commonWords.map((word) => (
                                        <tr 
                                            key={word._id} 
                                            onClick={() => setEnglishWord(word.english)}
                                            className="hover:bg-blue-50 cursor-pointer transition duration-150"
                                        >
                                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{word.english}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{word.hindi}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{word.pronunciation}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 capitalize">{word.partOfSpeech}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Quiz Mode
    return (
        <div className="max-w-2xl mx-auto p-6 bg-white min-h-screen">
            <div className="bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-lg p-6 mb-6">
                <h1 className="text-3xl font-bold text-center mb-2">Quiz Mode</h1>
                <p className="text-center text-xl">Category: <span className="capitalize">{currentQuizWord?.partOfSpeech || 'noun'}s</span></p>
                <div className="text-center mt-4">
                    <span className="bg-white text-blue-600 px-4 py-2 rounded-full text-lg font-semibold">
                        Score: {score}
                    </span>
                </div>
            </div>

            {currentQuizWord && (
                <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-lg">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">What is the Hindi translation for:</h3>
                    <h2 className="text-3xl font-bold text-blue-600 text-center mb-8">{currentQuizWord.english}</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {options.map((option, index) => (
                            <button 
                                key={index} 
                                onClick={() => checkAnswer(option.hindi)}
                                className="bg-gray-100 hover:bg-blue-100 border-2 border-gray-200 hover:border-blue-300 rounded-lg p-4 text-lg font-medium transition duration-200 transform hover:scale-105"
                            >
                                {option.hindi}
                            </button>
                        ))}
                    </div>
                    
                    {feedback && (
                        <div className={`p-4 rounded-lg text-center text-lg font-semibold ${
                            feedback.includes('Correct') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                            {feedback}
                        </div>
                    )}
                </div>
            )}

            <div className="text-center">
                <button 
                    onClick={endQuiz}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-8 rounded-lg transition duration-200"
                >
                    End Quiz
                </button>
            </div>
        </div>
    );
}

export default Word;