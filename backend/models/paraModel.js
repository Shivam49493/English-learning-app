import mongoose from "mongoose";

const paragraphSchema = new mongoose.Schema({
  english: { type: String, required: true },
  hindi: { type: String, required: true },
  keywords: [String],
  exercises: [{
    question: String,
    options: [String],
    answer: String
  }]
});

const Paragraph = mongoose.model('Paragraph', paragraphSchema);
 
export default Paragraph;