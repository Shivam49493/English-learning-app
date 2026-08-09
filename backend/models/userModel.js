import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    
  },
  progress: {
    wordsLearned: { type: Number, default: 0 },
    quizzesTaken: { type: Number, default: 0 },
    quizHighScore: { type: Number, default: 0 },
    sentencesCompleted: { type: Number, default: 0 },
    paragraphsRead: { type: Number, default: 0 },
    exercisesCompleted: { type: Number, default: 0 }
  }
  
},{ timestamps: true,minimize: false });

const User = mongoose.model("User", userSchema);

export default User;