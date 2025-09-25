import  Word from "../models/wordModel.js" // Add this line at the top


import mongoose from "mongoose";
// Get common words
export const getCommonWords = async (req, res) => {
  try {
    const commonWords = await Word.find().sort({ frequency: -1 }).limit(20);
    res.json(commonWords);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Match English to Hindi
export const matchWords = async (req, res) => {
  try {
    const { englishWord } = req.body;
    const word = await Word.findOne({ 
      english: new RegExp(`^${englishWord}$`, 'i') 
    });
    
    if (!word) {
      return res.status(404).json({ message: 'Word not found' });
    }
    
    res.json(word);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// In controllers/wordController.js
export const getQuizWord = async (req, res) => {
  try {
    const { partOfSpeech } = req.query;
    
    // Get random word matching the part of speech
    const count = await Word.countDocuments({ partOfSpeech });
    const random = Math.floor(Math.random() * count);
    const word = await Word.findOne({ partOfSpeech }).skip(random);
    
    if (!word) {
      return res.status(404).json({ message: 'No words found' });
    }
    
    res.json({ word });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



export const getQuizOptions = async (req, res) => {
  try {
    const { correctId, partOfSpeech } = req.query;

    // Validate ID format
    if (!mongoose.isValidObjectId(correctId)) {
      return res.status(400).json({ message: 'Invalid word ID format' });
    }

    // Convert to ObjectId
    const correctObjectId = new mongoose.Types.ObjectId(correctId);

    const options = await Word.aggregate([
      { 
        $match: { 
          partOfSpeech,
          _id: { $ne: correctObjectId }
        }
      },
      { $sample: { size: 3 } }
    ]);

    const correct = await Word.findById(correctObjectId);
    
    if (!correct) {
      return res.status(404).json({ message: 'Correct answer word not found' });
    }

    const allOptions = [...options, correct].sort(() => Math.random() - 0.5);
    res.json(allOptions);

  } catch (err) {
    console.error('Error in getQuizOptions:', err);
    res.status(500).json({ 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};