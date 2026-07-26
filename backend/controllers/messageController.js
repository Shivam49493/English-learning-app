import Message from "../models/messageModel.js";
import User from "../models/userModel.js";

/**
 * Get all community chat messages (limit to last 100, sorted oldest first)
 */
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find()
      .sort({ createdAt: -1 })
      .limit(100);

    // Reverse to display oldest first in the stream
    res.status(200).json(messages.reverse());
  } catch (error) {
    console.error("Error in getMessages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Post a new message to community chat
 */
export const postMessage = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== "string" || !text.trim()) {
      return res.status(400).json({ message: "Message content cannot be empty" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Classify role automatically (teachers can sign up with a name/email containing 'teacher')
    const isTeacher = user.email.toLowerCase().includes("teacher") ||
                      user.name.toLowerCase().includes("teacher");
    const role = isTeacher ? "teacher" : "student";

    const newMessage = new Message({
      sender: user._id,
      senderName: user.name,
      role: role,
      text: text.trim(),
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in postMessage:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
