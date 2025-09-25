import Paragraph from "../models/paraModel.js";

export const getParagraphs = async (req, res) => {
  try {
    const paragraphs = await Paragraph.find();
    res.json(paragraphs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  } 
};