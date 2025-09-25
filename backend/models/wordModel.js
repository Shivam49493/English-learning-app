import mongoose from "mongoose";

const wordSchema = new mongoose.Schema({
  english: { type: String, required: true },
  hindi: { type: String, required: true },
  pronunciation: [String],
  partOfSpeech:{ type: String,
    enum: ['noun', 'verb', 'adjective', 'adverb', 'interjection']}
  
});

const Word = mongoose.model('Word', wordSchema);

export default Word;