import mongoose from "mongoose";

const SentenceSchema = new mongoose.Schema({
  english: { type: String, required: true },
  hindi: { type: String, required: true },
});

const Sentence = mongoose.model('Sentence', SentenceSchema);

export default Sentence;