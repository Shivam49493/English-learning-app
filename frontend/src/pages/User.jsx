import React, { useContext, useEffect, useState } from 'react';
import { userDataContext } from '../contexts/UserContext';
import { FaUserCircle, FaBook, FaAward, FaListOl, FaFileAlt, FaCheckCircle, FaCalendarAlt, FaStar } from 'react-icons/fa';

const User = () => {
  const { userData, getCurrentUser } = useContext(userDataContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Refresh user data when progress page is loaded to get latest stats
    const fetchLatest = async () => {
      setLoading(true);
      try {
        await getCurrentUser();
      } catch (err) {
        console.error("Error fetching latest user details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLatest();
  }, []);

  if (loading && !userData) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center mt-20">
        <p className="text-xl text-gray-600">No user data available. Please log in.</p>
      </div>
    );
  }

  // Calculate progress percentages based on target benchmarks
  const progressStats = userData.progress || {
    wordsLearned: 0,
    quizzesTaken: 0,
    quizHighScore: 0,
    sentencesCompleted: 0,
    paragraphsRead: 0,
    exercisesCompleted: 0
  };

  const wordGoal = 20;
  const quizGoal = 10;
  const sentenceGoal = 15;
  const paragraphGoal = 5;
  const exerciseGoal = 5;

  const wordPercent = Math.min(Math.round((progressStats.wordsLearned / wordGoal) * 100), 100);
  const quizPercent = Math.min(Math.round((progressStats.quizzesTaken / quizGoal) * 100), 100);
  const sentencePercent = Math.min(Math.round((progressStats.sentencesCompleted / sentenceGoal) * 100), 100);
  const paragraphPercent = Math.min(Math.round((progressStats.paragraphsRead / paragraphGoal) * 100), 100);
  const exercisePercent = Math.min(Math.round((progressStats.exercisesCompleted / exerciseGoal) * 100), 100);

  // Overall completeness score (average of all percentages)
  const overallScore = Math.round((wordPercent + quizPercent + sentencePercent + paragraphPercent + exercisePercent) / 5);

  const getStatusBadge = (score) => {
    if (score >= 80) return { text: "Expert Learner 🏆", color: "bg-green-100 text-green-800 border-green-200" };
    if (score >= 40) return { text: "Intermediate Learner 📈", color: "bg-blue-100 text-blue-800 border-blue-200" };
    return { text: "Beginner Learner 🌱", color: "bg-yellow-100 text-yellow-800 border-yellow-200" };
  };

  const badge = getStatusBadge(overallScore);

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">

        {/* Profile Card Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-12 text-white flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
              <div className="h-24 w-24 rounded-full bg-white/20 border-4 border-white/30 flex items-center justify-center text-4xl font-bold shadow-lg">
                {userData.name.slice(0, 1).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight">{userData.name}</h1>
                <p className="text-indigo-100 text-lg font-medium">{userData.email}</p>
                <div className="flex items-center gap-2 mt-3 justify-center md:justify-start">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${badge.color}`}>
                    {badge.text}
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center border border-white/10 min-w-[180px]">
              <span className="text-indigo-100 text-sm font-semibold uppercase tracking-wider">Overall Progress</span>
              <h2 className="text-5xl font-black mt-1">{overallScore}%</h2>
              <div className="w-full bg-white/20 rounded-full h-2 mt-3 overflow-hidden">
                <div className="bg-white h-full transition-all duration-1000" style={{ width: `${overallScore}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Detailed Progress Bars */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <FaAward className="text-indigo-600" /> Learning Goals & Milestones
            </h3>

            <div className="space-y-6">

              {/* Words Learned */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <FaBook className="text-emerald-500" /> Vocabulary Words Looked Up
                  </span>
                  <span className="text-sm font-bold text-gray-900">{progressStats.wordsLearned} / {wordGoal}</span>
                </div>
                <div className="w-full bg-gray-100 h-3.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${wordPercent}%` }}
                  ></div>
                </div>
              </div>

              {/* Quizzes Taken */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <FaListOl className="text-blue-500" /> Vocabulary Quizzes Attempted
                  </span>
                  <span className="text-sm font-bold text-gray-900">{progressStats.quizzesTaken} / {quizGoal}</span>
                </div>
                <div className="w-full bg-gray-100 h-3.5 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-500 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${quizPercent}%` }}
                  ></div>
                </div>
              </div>

              {/* Sentences Completed */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <FaCheckCircle className="text-indigo-500" /> Sentence Practice
                  </span>
                  <span className="text-sm font-bold text-gray-900">{progressStats.sentencesCompleted} / {sentenceGoal}</span>
                </div>
                <div className="w-full bg-gray-100 h-3.5 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-500 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${sentencePercent}%` }}
                  ></div>
                </div>
              </div>

              {/* Paragraphs Read */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <FaFileAlt className="text-purple-500" /> Paragraphs Read
                  </span>
                  <span className="text-sm font-bold text-gray-900">{progressStats.paragraphsRead} / {paragraphGoal}</span>
                </div>
                <div className="w-full bg-gray-100 h-3.5 rounded-full overflow-hidden">
                  <div
                    className="bg-purple-500 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${paragraphPercent}%` }}
                  ></div>
                </div>
              </div>

              {/* Comprehension Exercises Completed */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <FaAward className="text-pink-500" /> Comprehension Exercises Finished
                  </span>
                  <span className="text-sm font-bold text-gray-900">{progressStats.exercisesCompleted} / {exerciseGoal}</span>
                </div>
                <div className="w-full bg-gray-100 h-3.5 rounded-full overflow-hidden">
                  <div
                    className="bg-pink-500 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${exercisePercent}%` }}
                  ></div>
                </div>
              </div>

            </div>
          </div>

          {/* Performance Summary & Motivating Tips */}
          <div className="flex flex-col gap-6">

            {/* Quick High Score Card */}
            <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl p-6 text-white shadow-md flex items-center justify-between">
              <div>
                <span className="text-amber-100 text-xs font-bold uppercase tracking-wider">Top Achievement</span>
                <h4 className="text-2xl font-bold mt-1">Quiz High Score</h4>
                <p className="text-sm text-amber-500 bg-white/20 inline-block px-3 py-1 rounded-full mt-3 font-semibold">
                  Record Score: {progressStats.quizHighScore} correct answers
                </p>
              </div>
              <FaStar className="h-16 w-16 text-white/30 animate-pulse" />
            </div>

            {/* Motivating Feedback Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex-1">
              <h3 className="text-lg font-bold text-gray-800 mb-4">💡 Tips to Boost Your Progress</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 text-sm font-bold shrink-0">1</div>
                  <p className="text-sm text-gray-600">
                    <strong className="text-gray-800">Learn New Words Daily:</strong> Check out the <span className="text-indigo-600 font-medium">Word</span> tab to expand your vocabulary. Try using them in everyday sentences!
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-sm font-bold shrink-0">2</div>
                  <p className="text-sm text-gray-600">
                    <strong className="text-gray-800">Take Quizzes:</strong> Build long-term memory by challenging yourself with Word quizzes categorised by noun, verb, or adjective.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 text-sm font-bold shrink-0">3</div>
                  <p className="text-sm text-gray-600">
                    <strong className="text-gray-800">Read & Answer:</strong> Enhance syntax and reading comprehension by completing paragraph exercises on the Paragraph page.
                  </p>
                </li>
              </ul>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default User;
