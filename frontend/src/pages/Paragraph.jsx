import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios'

function Paragraph() {
    const [paragraphs, setParagraphs] = useState([]);
    const [currentParagraph, setCurrentParagraph] = useState(null);
    const [userParagraph, setUserParagraph] = useState('');
    const [exerciseAnswers, setExerciseAnswers] = useState({});
    const [score, setScore] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const API_BASE_URL = 'http://localhost:5000';

    useEffect(() => {
        fetchParagraphs();
    }, []);

    const fetchParagraphs = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${API_BASE_URL}/api/paragraphs/getparagraphs`);
            setParagraphs(response.data);
            if (response.data.length > 0) {
                setCurrentParagraph(response.data[0]);
            }
        } catch (err) {
            console.error('Error fetching paragraphs:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleExerciseAnswer = (questionIndex, answer) => {
        setExerciseAnswers({
            ...exerciseAnswers,
            [questionIndex]: answer
        });
    };

    const calculateScore = () => {
        if (!currentParagraph || !currentParagraph.exercises) return;
        
        let correct = 0;
        currentParagraph.exercises.forEach((exercise, index) => {
            if (exerciseAnswers[index] === exercise.answer) {
                correct++;
            }
        });
        
        setScore({
            correct,
            total: currentParagraph.exercises.length,
            percentage: Math.round((correct / currentParagraph.exercises.length) * 100)
        });
    };

    const handleNextParagraph = () => {
        if (paragraphs.length === 0) return;
        
        const currentIndex = paragraphs.findIndex(p => p._id === currentParagraph._id);
        const nextIndex = (currentIndex + 1) % paragraphs.length;
        const nextParagraph = paragraphs[nextIndex];
        
        setCurrentParagraph(nextParagraph);
        setUserParagraph('');
        setExerciseAnswers({});
        setScore(null);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-lg text-gray-600">Loading paragraphs...</p>
                </div>
            </div>
        );
    }

    if (!currentParagraph) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <p className="text-xl text-gray-600 mb-4">No paragraphs available</p>
                    <button 
                        onClick={fetchParagraphs}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen">
            <h2 className="text-3xl font-bold text-center text-blue-600 mb-8">Paragraph Formation Section</h2>
            
            {/* Paragraph Display */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{currentParagraph.title}</h3>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h4 className="text-lg font-semibold text-gray-700 mb-3">English:</h4>
                        <p className="text-gray-800 leading-relaxed">{currentParagraph.english}</p>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h4 className="text-lg font-semibold text-gray-700 mb-3">Hindi:</h4>
                        <p className="text-hindi text-lg leading-relaxed">{currentParagraph.hindi}</p>
                    </div>
                </div>
                
                {currentParagraph.keywords && currentParagraph.keywords.length > 0 && (
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                        <h4 className="text-lg font-semibold text-gray-700 mb-3">Keywords:</h4>
                        <div className="flex flex-wrap gap-2">
                            {currentParagraph.keywords.map((keyword, index) => (
                                <span key={index} className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                                    {keyword}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            
            {/* Exercises Section */}
            <div className="space-y-8">
                {/* Write Paragraph Exercise */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h4 className="text-xl font-semibold text-gray-800 mb-4">Write a similar paragraph in English:</h4>
                    <textarea
                        value={userParagraph}
                        onChange={(e) => setUserParagraph(e.target.value)}
                        placeholder="Write your paragraph here using the keywords and structure from the example..."
                        rows="6"
                        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-vertical"
                    />
                    <div className="mt-2 text-sm text-gray-600">
                        Word count: {userParagraph.split(/\s+/).filter(word => word.length > 0).length}
                    </div>
                </div>
                
                {/* Multiple Choice Questions */}
                {currentParagraph.exercises && currentParagraph.exercises.length > 0 && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                        <h4 className="text-xl font-semibold text-gray-800 mb-4">Multiple Choice Questions:</h4>
                        
                        <div className="space-y-6">
                            {currentParagraph.exercises.map((exercise, index) => (
                                <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                                    <p className="text-lg font-medium text-gray-800 mb-3">
                                        {index + 1}. {exercise.question}
                                    </p>
                                    <div className="space-y-2">
                                        {exercise.options.map((option, optIndex) => (
                                            <label key={optIndex} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name={`exercise-${index}`}
                                                    value={option}
                                                    onChange={() => handleExerciseAnswer(index, option)}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                                />
                                                <span className="text-gray-700">{option}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
                            <button 
                                onClick={calculateScore}
                                className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-8 rounded-lg transition duration-200"
                            >
                                Check Answers
                            </button>
                            
                            {score && (
                                <div className={`p-4 rounded-lg ${
                                    score.percentage >= 70 ? 'bg-green-100 text-green-800' : 
                                    score.percentage >= 50 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                                }`}>
                                    <p className="text-lg font-semibold">
                                        Score: {score.correct} out of {score.total} ({score.percentage}%)
                                    </p>
                                    <p className="text-sm mt-1">
                                        {score.percentage >= 70 ? 'Excellent! 🎉' : 
                                         score.percentage >= 50 ? 'Good job! 👍' : 'Keep practicing! 💪'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            
            {/* Navigation */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                <button 
                    onClick={fetchParagraphs}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
                >
                    Refresh
                </button>
                
                <button 
                    onClick={handleNextParagraph}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
                >
                    Next Paragraph
                </button>
            </div>
        </div>
    );
}

export default Paragraph;