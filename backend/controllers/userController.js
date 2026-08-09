import User from '../models/userModel.js';

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    console.log(user)
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error in getCurrentUser:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUserProgress = async (req, res) => {
  try {
    const {
      wordsLearned,
      quizzesTaken,
      quizHighScore,
      sentencesCompleted,
      paragraphsRead,
      exercisesCompleted,
    } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.progress) {
      user.progress = {
        wordsLearned: 0,
        quizzesTaken: 0,
        quizHighScore: 0,
        sentencesCompleted: 0,
        paragraphsRead: 0,
        exercisesCompleted: 0,
      };
    }

    if (typeof wordsLearned === "number") user.progress.wordsLearned += wordsLearned;
    if (typeof quizzesTaken === "number") user.progress.quizzesTaken += quizzesTaken;
    if (typeof quizHighScore === "number") {
      user.progress.quizHighScore = Math.max(user.progress.quizHighScore || 0, quizHighScore);
    }
    if (typeof sentencesCompleted === "number") user.progress.sentencesCompleted += sentencesCompleted;
    if (typeof paragraphsRead === "number") user.progress.paragraphsRead += paragraphsRead;
    if (typeof exercisesCompleted === "number") user.progress.exercisesCompleted += exercisesCompleted;

    await user.save();
    res.status(200).json({ message: "Progress updated successfully", progress: user.progress });
  } catch (error) {
    console.error("Error in updateUserProgress:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
